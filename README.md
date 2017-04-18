# fs-promise-util
A utility library for file system interaction on *nix machines. This library utilizes the graceful-fs, an improvement over the fs module.

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

### fs-promise-util.appendFile (file, data, options)

This method appends data to a file, creating the file if it does not exist and returns a Promise. 


* file [ string | Buffer | number ] filename or file descriptor
* data [ string | Buffer ]
* options [ Object> | <string ]

	* encoding [ string | null default = 'utf8' ]
	* mode [ integer default = 0o666 ]
	* flag [ string default = 'a' ]
                                                
```javascript

return Promise.resolve(fs-promise-util.appendFile(file, data, { encoding : 'binary' }));
```  



### fs-promise-util.createReadStream (path, options)

This method returns a new readStream object

* path [ string | Buffer ]
* options [ string | Object ]
	* flags [ string ]
	* encoding [ string ]
	* fd [ integer ]
	* mode [ integer ]
	* autoClose [ boolean ]
	* start [ integer ]
	* end [ integer]

```javascript

return Promise.resolve(fs-promise-util.createReadStream(path));
```

### fs-promise-util.createWriteStream (path, options)

This method returns a new writeStream object

* path [ string | Buffer ]
* options [ ]string | Object ]
	* flags [ string ]
	* defaultEncoding [ string ]
	* fd [ integer ]
	* mode [ integer ]
	* autoClose [ boolean ]
	* start [ integer ]

options is an object or string with the following defaults:

	{
  
  		flags: 'w',
  
  		defaultEncoding: 'utf8',
  
  		fd: null,
  
  		mode: 0o666,
  
  		autoClose: true
	}
	

```javascript

return Promise.resolve(fs-promise-util.createWriteStream(path, {
						defaultEncoding : 'utf8'
					})));
```

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

let exists = await fs-promise-util.exists(filePath);		
```

### fs-promise-util.lstat (path)

This method returns a promise for lstat. More details here. (https://nodejs.org/api/fs.html#fs_fs_lstat_path_callback)

```javascript

return new Promise((resolve) => {
				fs-promise-util.lstat(path)
				.then(() => resolve(true))
				.catch(() => resolve(false));
			});
```

### fs-promise-util.prune (directoryPath, filter, retainCount)

This method removes 'x' number of least recent files matching pattern from a directory.

directoryPath: directory to remove the files

filter: pattern for the file removal. For example: a regular expression matching a file name 

retainCount: number of files you want to keep in the directory

```javascript

return await fs-promise-util.prune(directoryPath, filter, retainCount);

```

### fs-promise-util.readdir (path, options)

This method reads the contents of a directory and returns a promise.

* path [ string | Buffer ]
* options [ string | Object ] 
	* encoding [ string ] default = 'utf8'
	
```javascript

return await fs-promise-util.readdir(path, { encoding : 'utf8' });```

### fs-promise-util.readlink (path, options)

returns a promise for fs.readlink

* path [ string | Buffer ]
* options [ string | Object ]
	* encoding [ string ] default = 'utf8'

	
```javascript

return await fs-promise-util.readlink(path, { encoding : 'utf8' });```

### fs-promise-util.readAndSort (directoryPath, options)

This method reads the content of the directory passed and sorts files based on date and returns files. 'options' object can be used to pass in:

options.sort : sort files based on date

options.filter : any filters passed with the file name(options.filter.name)

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

