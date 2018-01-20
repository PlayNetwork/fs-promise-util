/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */
import fs from 'graceful-fs';
import fsWrapper from '../../../src/index';
import path from 'path';
import renege from 'renege';

const
	NEGATIVE_RETAIN_COUNT = -5,
	INVALID_PATH = 3;


describe('src/index', async () => {
	afterEach(async () => await removeTestCache());

	describe('#appendFile', () => {
		beforeEach(async () => await prepareTestCacheAsDirectory());

		it('should reject with invalid path', async () => {
			let invalidPath = [TEST_CACHE_PATH, 'invalid', 'test-file.json'].join('/');

			return fsWrapper
				.appendFile(invalidPath, { test : true })
				.should.be.rejectedWith(Error, /ENOENT/);
		});
	});

	describe('#createReadStream', () => {
		it('should resolve to a readStream for a valid path', async() => {
			let filename = 'i-exist.txt';
			before(async () => await prepareTestCacheFile(filename));

			return await fsWrapper
				.createReadStream(TEST_CACHE_PATH)
				.should.be.fulfilled;
		});
	});

	describe('#createWriteStream', () => {
		it('should resolve to a writeStream for a valid path', async() => {
			let filename = 'i-exist.txt';
			before(async () => await prepareTestCacheFile(filename));

			return await fsWrapper
				.createWriteStream(TEST_CACHE_PATH)
				.should.be.fulfilled;
		});
	});

	describe('#ensurePath', () => {
		it('should reject given undefined path', async () => {
			return fsWrapper
				.ensurePath()
				.should.be.rejectedWith(Error, /path/);
		});

		it('should reject given empty path', async () => {
			return fsWrapper
				.ensurePath('')
				.should.be.rejectedWith(Error, /path/);
		});

		it('should reject given cache path already exists but is not a folder', async () => {
			return await prepareTestCacheAsFile()
				.then(() => fsWrapper
					.ensurePath(TEST_CACHE_PATH)
					.should.be.rejectedWith(Error, /EEXIST/));
		});

		it('should resolve given cache path already exists as a directory', async () => {
			return await prepareTestCacheAsDirectory()
				.then(() => fsWrapper
					.ensurePath(TEST_CACHE_PATH)
					.should.be.fulfilled);
		});

		it('should resolve given cache path already exists as symbolic link', async () => {
			return await prepareTestCacheAsSymbolicLink()
				.then(() => fsWrapper
					.ensurePath(TEST_CACHE_PATH)
					.should.be.fulfilled)
		});

		it('should resolve given valid path', async () => {
			return fsWrapper
				.ensurePath(TEST_CACHE_PATH)
				.should.be.fulfilled;
		});

		it('should resolve a Promise for a valid path', async () => {
			return fsWrapper.ensurePath(TEST_CACHE_PATH)
				.then((path) => {
					return Promise.resolve(path);
				});
		});
	});

	describe('#lstat', () => {
		it('should resolve to given path', () => {
			return new Promise((resolve) => {
				fsWrapper.lstat(TEST_CACHE_PATH)
				.then(() => resolve(true))
				.catch(() => resolve(false));
			});
		});
	});

	describe('#exists', () => {
		it('should resolve to false given undefined filePath', async () => {
			return fsWrapper.exists()
				.should.eventually.be.false;
		});

		it('should resolve to false given unknown filePath', async () => {
			return fsWrapper.exists('non-existent-filename')
				.should.eventually.be.false;
		});

		it('should resolve to true given existing file', async () => {
			let filename = 'i-exist.txt';

			return await prepareTestCacheAsDirectory()
				.then(() => prepareTestCacheFile(filename))
				.then(() => fsWrapper
					.exists(path.join(TEST_CACHE_PATH, filename))
					.should.eventually.be.true);
		});

		it('should resolve a Promise for a existing filePath', () => {
			return fsWrapper.exists(TEST_CACHE_PATH)
				.then((path) => {
					return Promise.resolve(true);
				});
		});

		it('should resolve a Promise for an unexisting path', () => {
			return new Promise((resolve) => {
				return fsWrapper.exists()
					.then(() => resolve(true))
					.catch(() => resolve(false))
			});
		});
	});

	describe('#prune', () => {
		it('should reject given undefined directoryPath', async () => {
			return fsWrapper
				.prune()
				.should.be.rejectedWith(Error, /path/);
		});

		it('should reject given empty directoryPath', async () => {
			return fsWrapper
				.prune('')
				.should.be.rejectedWith(Error, /path/);
		});

		it('should reject given undefined retainCount', async () => {
			return fsWrapper
				.prune('does-not-exist')
				.should.be.rejectedWith(Error, /retainCount/);
		});

		it('should reject given negative retainCount', async () => {
			return fsWrapper
				.prune('does-not-exist', null, NEGATIVE_RETAIN_COUNT)
				.should.be.rejectedWith(Error, /retainCount/);
		});

		it('should reject given invalid directoryPath', async () => {
			return fsWrapper
				.prune('does-not-exist', null, INVALID_PATH)
				.should.be.rejectedWith(Error, /directory/);
		});

		it('should resolve given empty TEST_CACHE_PATH', async () => {
			return await prepareTestCacheAsDirectory()
				.then(() => fsWrapper
					.prune(TEST_CACHE_PATH, null, INVALID_PATH)
					.should.be.fulfilled);
		});

		it('should resolve and remove file given TEST_CACHE_PATH with file', async () => {
			let filename = 'file-1.txt';
			return await prepareTestCacheAsDirectory()
				.then(() => prepareTestCacheFile(filename))
				.then(() => fsWrapper.prune(TEST_CACHE_PATH, null, 0))
				.then(() => renege
					.promisify(fs.stat)(path.join(TEST_CACHE_PATH, filename))
					.should.be.rejected);
		});

		it('should resolve, remove, and retain file given TEST_CACHE_PATH with files', async () => {
			let filename = 'file-1.txt';
			return await prepareTestCacheAsDirectory()
				.then(() => prepareTestCacheFile('file-4.txt'))
				.then(() => prepareTestCacheFile('file-3.txt'))
				.then(() => prepareTestCacheFile('file-2.txt'))
				.then(() => prepareTestCacheFile(filename))
				.then(() => fsWrapper.prune(TEST_CACHE_PATH, null, 1))
				.then(() => renege
					.promisify(fs.stat)(path.join(TEST_CACHE_PATH, filename))
					.should.be.fulfilled);
		});
	});

	describe('#readAndSort', () => {
		it('should reject given undefined directoryPath', async () => {
			return fsWrapper
				.readAndSort()
				.should.be.rejectedWith(Error, /path/);
		});

		it('should reject given empty directoryPath', async () => {
			return fsWrapper
				.readAndSort('')
				.should.be.rejectedWith(Error, /ENOENT/);
		});

		it('should reject given undefined retainCount', async () => {
			return fsWrapper
				.readAndSort('does-not-exist')
				.should.be.rejectedWith(Error, /ENOENT/);
		});

		it('should reject given negative retainCount', async () => {
			return fsWrapper
				.readAndSort('does-not-exist', null, NEGATIVE_RETAIN_COUNT)
				.should.be.rejectedWith(Error, /ENOENT/);
		});

		it('should reject given invalid directoryPath', async () => {
			return fsWrapper
				.readAndSort('does-not-exist', null, INVALID_PATH)
				.should.be.rejectedWith(Error, /directory/);
		});

		it('should resolve given empty TEST_CACHE_PATH', async () => {
			return await prepareTestCacheAsDirectory()
				.then(() => fsWrapper
					.readAndSort(TEST_CACHE_PATH, null, INVALID_PATH)
					.should.be.fulfilled);
		});

		it('should resolve and remove file given TEST_CACHE_PATH with file', async () => {
			let filename = 'file-1.txt';
			return await prepareTestCacheAsDirectory()
				.then(() => prepareTestCacheFile(filename))
				.then(() => fsWrapper.readAndSort(TEST_CACHE_PATH, null, 0))
				.then(() => renege
					.promisify(fs.stat)(path.join(TEST_CACHE_PATH, filename))
					.should.be.fulfilled);
		});

		it('should resolve, remove, and retain file given TEST_CACHE_PATH with files', async () => {
			let filename = 'file-1.txt';
			return await prepareTestCacheAsDirectory()
				.then(() => prepareTestCacheFile('file-4.txt'))
				.then(() => prepareTestCacheFile('file-3.txt'))
				.then(() => prepareTestCacheFile('file-2.txt'))
				.then(() => prepareTestCacheFile(filename))
				.then(() => fsWrapper.readAndSort(TEST_CACHE_PATH, null, 1))
				.then(() => renege
					.promisify(fs.stat)(path.join(TEST_CACHE_PATH, filename))
					.should.be.fulfilled);
		});

		it('should resolve, remove, and retain file given TEST_CACHE_PATH with files', async () => {
			let
				filename = 'file-1.txt',
				date = new Date();
			date.setDate(date.getDate()-1);

			return await prepareTestCacheAsDirectory()
				.then(() => prepareTestCacheFile('file-4.txt'))
				.then(() => prepareTestCacheFile('file-3.txt'))
				.then(() => prepareTestCacheFile('file-2.txt'))
				.then(() => prepareTestCacheFile(filename))
				.then(() => fsWrapper.readAndSort(TEST_CACHE_PATH,
					{
					filter : {
						type : {
							files : true
						},
						modifiedAfter: date,
						modifiedBefore: date
					}
				})
			)
			.then(() => renege
				.promisify(fs.stat)(path.join(TEST_CACHE_PATH, filename))
				.should.be.fulfilled);
		});

		it('should filter out future files (modifiedBefore)', async () => {
			return await prepareTestCacheAsDirectory()
				.then(() => prepareTestCacheFile('file-4.txt', '203101010000'))
				.then(() => prepareTestCacheFile('file-3.txt'))
				.then(() => prepareTestCacheFile('file-2.txt', '203001010000'))
				.then(() => prepareTestCacheFile('file-1.txt'))
				.then(() => fsWrapper.readAndSort(TEST_CACHE_PATH, {
						filter : {
							type : {
								files : true
							},
							modifiedBefore: new Date()
						}
					})
				)
				.then((result) => {
					result[0].should.equal('test/sandbox/test-cache/file-1.txt');
					result[1].should.equal('test/sandbox/test-cache/file-3.txt');
				})
		});

		it('should filter out future files (relative to modifiedBefore)', async () => {
			const
				AGE1 = 20000,
				AGE2 = 30000,
				AGE3 = 10000;

			let now = Date.now();

			return await prepareTestCacheAsDirectory()
				.then(() => prepareTestCacheFile('file-4.txt', new Date(now + AGE1)))
				.then(() => prepareTestCacheFile('file-3.txt'))
				.then(() => prepareTestCacheFile('file-2.txt', new Date(now + AGE2)))
				.then(() => prepareTestCacheFile('file-1.txt'))
				.then(() => fsWrapper.readAndSort(TEST_CACHE_PATH, {
						filter : {
							type : {
								files : true
							},
							modifiedBefore : AGE3
						}
					})
				)
				.then((result) => {
					result[0].should.equal('test/sandbox/test-cache/file-1.txt');
					result[1].should.equal('test/sandbox/test-cache/file-3.txt');
				})
		});

		it('should return only future files (relative to modifiedAfter)', async () => {
			const
				AGE1 = 100000,
				AGE2 = 200000,
				AGE3 = 300000,
				AGE4 = 150000;

			let now = Date.now();

			return await prepareTestCacheAsDirectory()
				.then(() => prepareTestCacheFile('file-4.txt', new Date(now + AGE1)))
				.then(() => prepareTestCacheFile('file-3.txt', new Date(now + AGE2)))
				.then(() => prepareTestCacheFile('file-2.txt', new Date(now + AGE3)))
				.then(() => prepareTestCacheFile('file-1.txt'))
				.then(() => fsWrapper.readAndSort(TEST_CACHE_PATH, {
						filter : {
							type : {
								files : true
							},
							modifiedAfter : AGE4
						}
					})
				)
				.then((result) => {
					result[0].should.equal('test/sandbox/test-cache/file-2.txt');
					result[1].should.equal('test/sandbox/test-cache/file-3.txt');
				})
		});

		it('should return only future files (modifiedAfter)', async () => {
			const
				FUTURE_YEAR = 2027,
				FUTURE_MONTH = 1,
				FUTURE_DAY = 1;

			return await prepareTestCacheAsDirectory()
				.then(() => prepareTestCacheFile('file-4.txt', '203101010000'))
				.then(() => prepareTestCacheFile('file-3.txt'))
				.then(() => prepareTestCacheFile('file-2.txt', '203001010000'))
				.then(() => prepareTestCacheFile('file-1.txt'))
				.then(() => fsWrapper.readAndSort(TEST_CACHE_PATH, {
						filter : {
							type : {
								files : true
							},
							modifiedAfter: new Date(FUTURE_YEAR, FUTURE_MONTH, FUTURE_DAY)
						}
					})
				)
				.then((result) => {
					result[0].should.equal('test/sandbox/test-cache/file-4.txt');
					result[1].should.equal('test/sandbox/test-cache/file-2.txt');
				})
		});

		it('should return files with mod dates in a date range (modifedBefore and After)', async () => {
			const
				DATEONEYEAR = 2029,
				DATEONEMONTH = 1,
				DATEONEDAY = 1,
				DATETWOYEAR = 2033,
				DATETWOMONTH = 1,
				DATETWODAY = 1;

			return await prepareTestCacheAsDirectory()
				.then(() => prepareTestCacheFile('file-4.txt', '203401010000'))
				.then(() => prepareTestCacheFile('file-3.txt', '203201010000'))
				.then(() => prepareTestCacheFile('file-2.txt', '203001010000'))
				.then(() => prepareTestCacheFile('file-1.txt', '202701010000'))
				.then(() => fsWrapper.readAndSort(TEST_CACHE_PATH, {
						filter : {
							type : {
								files : true
							},
							modifiedAfter: new Date(DATEONEYEAR, DATEONEMONTH, DATEONEDAY),
							modifiedBefore: new Date(DATETWOYEAR, DATETWOMONTH, DATETWODAY)
						}
					})
				)
				.then((result) => {
					result[0].should.equal('test/sandbox/test-cache/file-3.txt');
					result[1].should.equal('test/sandbox/test-cache/file-2.txt');
				})
		});
	});

	describe('#readFile', () => {
		it('should resolve reading a file', async () => {
			let
				filename = 'file-1.txt',
				filePath = path.join(TEST_CACHE_PATH, filename);
			return await prepareTestCacheAsDirectory()
				.then(() => prepareTestCacheFile(filename))
				.then(() => fsWrapper.readFile(filePath))
				.should.be.fulfilled;
		});
	});

	describe('#tryWriteFile', () => {
		it('should resolve given undefined filePath', async () => {
			return await Promise.all([
				fsWrapper
					.tryWriteFile()
					.should.be.fulfilled,
				fsWrapper
					.tryWriteFile()
					.should.eventually.have.property('err').that.is.an('error'),
				fsWrapper
					.tryWriteFile()
					.then((obj) => obj.err.message).should.eventually.to.contain('path')
			]);
		});

		it('should resolve given and file written given filePath', async () => {
			let filename = 'file-1.txt';
			return await prepareTestCacheAsDirectory()
				.then(() => fsWrapper
					.tryWriteFile(path.join(TEST_CACHE_PATH, filename), 'file contents'))
				.then(() => renege
					.promisify(fs.stat)(path.join(TEST_CACHE_PATH, filename))
					.should.be.fulfilled);
		});
	});
});
