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

	describe('#ensurePath', function () {
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

	describe('#exists', function () {
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

	describe('#prune', function () {
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

	describe('#readAndSort', function () {
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
	});

	describe('#tryWriteFile', function () {
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