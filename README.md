# fs-promise-util
A utility library for file system interaction on *nix machines

## Requirements

* `Node.js`: >= `v4.x`
* `Platform`: `Darwin`, `Unix` or `Linux` (_Windows is not supported at this time_)

## Installation

```bash
npm install fs-promise-util
```

## Usage

This module exposes the following methods.

## Methods in alphabetical order

### fs-promise-util.appendFile

This method appends data to a file, creating the file if it does not exist and returns a Promise.                                                    

### fs-promise-util.createReadStream

This method returns a new readStream object

```javascript

return Promise.resolve(fs-promise-util.createReadStream(targetFile));
```

### fs-promise-util.createWriteStream

This method returns a new writeStream object


### fs-promise-util.ensurePath (directoryPath)

This method takes in a path as an argument. It creates a given path and returns a Promise.

```javascript

return fs-promise-util.ensurePath(directoryPath)
	.then((path) => {
		return Promise.resolve(path);
	});
```

### fs-promise-util.exists (filePath)

This method takes in a path as an argument. It checks whether a given path exists in the file system and returns a true or a false.

```javascript

let exists = await fs.exists(filePath);		
```

### fs-promise-util.lstat

This method returns a promise for lstat

### fs-promise-util.prune (directoryPath, filter, retainCount)

Async function that removes 'x' number of least recent files matching pattern

### fs-promise-util.readdir

returns a promise for fs.readdir

### fs-promise-util.readlink

returns a promise for fs.readlink

### fs-promise-util.readAndSort (directoryPath, options)

async function that returns a promise for fs.readdir that additionaly sorts files based on date

### fs-promise-util.readFile (filePath, options)

Promise for fs.createReadStream

### fs-promise-util.realpath

Promise for fs.realPath

### fs-promise-util.rename

Promise for fs.rename

### fs-promise-util.stat

Promise for fs.stat

### fs-promise-util.symlink

Promise for fs.symlink

### fs-promise-util.tryWriteFile (filePath, data, options)

wrapper for fs-promise-util.writeFile that returns a Promise

### fs-promise-util.unlink

Promise for fs.unlink

### fs-promise-util.writeFile (filePath, data, options)

Promise for fs.createWriteStream

