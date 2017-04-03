import 'babel-polyfill';
import 'source-map-support/register';

import debugLog from 'debug';
import fs from 'graceful-fs';
import mkdirp from 'mkdirp';
import path from 'path';
import renege from 'renege';

const debug = debugLog('fs-promise-util');

export default ((self) => {
	// Promise for fs.appendFile
	self.appendFile = renege.promisify(fs.appendFile);

	self.createReadStream = fs.createReadStream;

	self.createWriteStream = fs.createWriteStream;

	// Promise for mkdirp (3rd party module)
	self.ensurePath = (directoryPath) => {
		debug('examining path %s', directoryPath);

		return new Promise((resolve, reject) => {
			if (typeof directoryPath !== 'string' || !directoryPath.length) {
				debug('invalid path %s', directoryPath);

				return reject(new Error('path is invalid'));
			}

			return mkdirp(directoryPath, (err) => {
				if (err) {
					debug('an error occurred while creating the directory %s (error: %s)',
						directoryPath, err.message);

					return reject(err);
				}
				debug('successfully created path %s', directoryPath);

				return resolve();
			});
		});
	};

	// Promise that wraps stat to determine true or false
	self.exists = (filePath) => {
		debug('checking to see if file %s exists', filePath);

		return new Promise((resolve) => {
			return self
				.lstat(filePath)
				.then(() => resolve(true))
				.catch(() => resolve(false));
		});
	};

	// Promise for fs.stat
	self.lstat = renege.promisify(fs.lstat);

	// Promise to remove X number of least recent files matching pattern
	self.prune = async (directoryPath, filter, retainCount) => {
		debug('attempting to remove files at %s and retain %s',
			directoryPath, retainCount);

		if (typeof directoryPath !== 'string' || !directoryPath.length) {
			debug('invalid path %s', directoryPath);

			throw new Error('path is invalid');
		}

		if (typeof retainCount !== 'number' || retainCount < 0) {
			debug('invalid retainCount %s', retainCount);

			throw new Error('retainCount is invalid');
		}

		let filePaths = await self.readAndSort(
			directoryPath,
			{ filter : { name : filter } });

		if (filePaths.length > retainCount) {
			debug('removing %d files', (filePaths.length - retainCount));

			return await Promise.all(
				filePaths
					.slice(retainCount)
					.map((filePath) => self.unlink(filePath)));
		}
	};

	// Promise for fs.readdir
	self.readdir = renege.promisify(fs.readdir);

	self.readlink = renege.promisify(fs.readlink);

	// Promise for fs.readdir that additional sorts files based on date
	self.readAndSort = async (directoryPath, options) => {
		debug('sorting files based on date at %s', directoryPath);

		// ensure sort function is defined
		options = options || {};
		options.sort = (options.sort || ((a, b) => b.stats.mtime - a.stats.mtime));

		// read file names from specified directory
		let
			files = await self.readdir(directoryPath),
			statPromises;

		// no files? no need to move down further
		if (!files.length) {
			debug('no files found at %s', directoryPath);

			return [];
		}

		// filter if specified in options
		if (options.filter && options.filter.name) {
			files = files.filter((name) => options.filter.name.test(name));
		}

		// turn into a list of full paths
		statPromises = files
			.map((name) => path.join(directoryPath, name))
			.map((filePath) => {
				return new Promise((resolve, reject) => {

					/* eslint object-shorthand:0 */
					return self.lstat(filePath)
						.then((stats) =>
							resolve({
								path : filePath,
								stats : stats
							})
						)
						.catch(reject);
				});
			});

		return await Promise
			.all(statPromises)
			.then((fileStats) => {
				// filter out links and files on type filter
				if (options.filter && options.filter.type) {
					let typeFilter = options.filter.type;

					fileStats = fileStats.filter((fileStat) => {
						let isLink = fileStat.stats.isSymbolicLink();

						// links filter is defined and this is a symbolic links, so filter it
						if (typeFilter.links !== null && isLink) {
							return typeFilter.links;
						}

						// file filter is defined and this is a file, so filter it
						if (typeFilter.files !== null && !isLink) {
							return typeFilter.files;
						}

						return false;
					});
				}

				// filter out 0 length files (if specified)
				if (options.filter && options.filter.notEmpty) {
					fileStats = fileStats.filter((fileStat) => fileStat.stats.size > 0);
				}

				// filter files and keep those newer than specified time
				if (options.filter && options.filter.modifiedAfter) {
					fileStats = fileStats.filter((fileStat) => {
						if (options.filter.modifiedAfter instanceof Date) {
							return fileStat.stats.mtime <= options.filter.modifiedAfter;
						}

						return (Date.now() - fileStat.stats.mtime) <= options.filter.modifiedAfter;
					});
				}

				// filter files and keep those older than specified time
				if (options.filter && options.filter.modifiedBefore) {
					fileStats = fileStats.filter((fileStat) => {
						if (options.filter.modifiedBefore instanceof Date) {
							return fileStat.stats.mtime >= options.filter.modifiedBefore;
						}

						return (Date.now() - fileStat.stats.mtime) >= options.filter.modifiedBefore;
					});
				}

				// sort based on input
				fileStats = fileStats.sort(options.sort);

				// return an array of file paths
				debug('successfully sorted files');

				return Promise.resolve(fileStats.map((fileStat) => fileStat.path));
			});
	};

	// Promise for fs.createReadStream
	self.readFile = (filePath, options) => {
		debug('attempting to read file at %s', filePath);

		return new Promise((resolve, reject) => {
			let
				chunks = [],
				reader = fs.createReadStream(filePath, options);

			// capture events
			reader.on('data', (chunk) => chunks.push(chunk));
			reader.on('end', () => resolve(chunks.join('')));
			reader.on('error', reject);
		});
	};

	self.realpath = renege.promisify(fs.realpath);

	// Promise for fs.rename
	self.rename = renege.promisify(fs.rename);

	// Promise for fs.stat
	self.stat = renege.promisify(fs.stat);

	self.symlink = renege.promisify(fs.symlink);

	// wrapper for self.writeFile that will always resolve
	self.tryWriteFile = (filePath, data, options) => {
		debug('attempting to write file at %s', filePath);

		return new Promise((resolve) => {
			return self
				.writeFile(filePath, data, options)
				.then(() => resolve())
				.catch((err) => resolve({ err }));
		});
	};

	// Promise for fs.unlink
	self.unlink = renege.promisify(fs.unlink);

	// Promise for fs.createWriteStream
	self.writeFile = (filePath, data, options) => {
		debug('attempting to write file at %s', filePath);

		return new Promise((resolve, reject) => {
			let writer = fs.createWriteStream(filePath, options);

			// capture events
			writer.on('error', reject);
			writer.on('finish', resolve);

			// write data
			writer.end(data);
		});
	};

	return self;
})({});
