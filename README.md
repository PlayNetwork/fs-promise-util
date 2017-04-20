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
* options [ Object | string ]

	* encoding [ string | null ] default = 'utf8' 
	* mode [ integer ] default = 0o666 
	* flag [ string ] default = 'a' 
                                                
```javascript

return Promise.resolve(fs-promise-util.appendFile(file, data, { encoding : 'binary' }));
```  



### fs-promise-util.createReadStream (path, options)

This method returns a new readStream object.

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

This method returns a new writeStream object.

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

This method removes 'x' number of least recent files matching a given pattern from a directory.

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

return await fs-promise-util.readdir(path, { encoding : 'utf8' });
```


### fs-promise-util.readlink (path, options)

This method returns the absolute path of a file or folder pointed by a symlink as a promise. If the path is not an symlink or shortcut, it will resolve to an empty string.

* path [ string | Buffer ]
* options [ string | Object ]
	* encoding [ string ] default = 'utf8'

	
```javascript

return await fs-promise-util.readlink(path, { encoding : 'utf8' });
```

### fs-promise-util.readAndSort (directoryPath, options)

This method reads the content of the directory passed and sorts files based on date and returns files. 'options' object can be used to pass in:

* options.sort : sort files based on date

* options.filter : any filters passed with the file name(options.filter.name)

```javascript

let exists = await fs-promise-util.readAndSort(directoryPath,
	
{ filter :{ name : new RegExp('\\w+'), notEmpty : true} };)

```

### fs-promise-util.readFile (file, options)

This method asynchronously reads the entire contents of a file and returns a Promise

* file [string | Buffer | integer ] filename or file descriptor
* options [ Object | string ]
	* encoding [ string | null ] default = null
	* flag [ string ] default = 'r'
	
```javascript

await fs-promise-util.readFile('/etc/readme');```

	
If options is a string, then it specifies the encoding. 

```javascript

await fs-promise-util.readFile('/etc/readme', { encoding : 'utf8' });```

### fs-promise-util.realpath (path, options)

This method returns the absolute pathname for the given path as a Promise. In other words, it returns a promise for fs.realPath (https://nodejs.org/dist/latest-v7.x/docs/api/fs.html#fs_fs_realpath_path_options_callback)


* path [ string | Buffer ]
* options [ string | Object ]
	* encoding [ string ] default = 'utf8'
	
Lets say the directory structure is '/etc/readme'

```javascript

await fs-promise-util.realpath('readme');```

Above method returns '/etc/readme' as a Promise.
	
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the path passed to the callback. If the encoding is set to 'buffer', the path returned will be passed as a Buffer object.

### fs-promise-util.rename (oldPath, newPath)

This method renames a file, moving it between directories if required.
Returns a Promise for fs.rename

* oldPath [ string | Buffer ]
* newPath [ string | Buffer ]

```javascript

await fs-promise-util.rename('temp/abc', 'tmp/xyz');```


If newpath already exists, it will be atomically replaced, so that there is no point at which another process attempting to access newpath will find it missing.  However, there will probably be a window in which both oldpath and newpath refer to the file being renamed.

If oldpath and newpath are existing hard links referring to the same file, then rename() does nothing, and returns a success status.

If newpath exists but the operation fails for some reason, rename() guarantees to leave an instance of newpath in place.

oldpath can specify a directory.  In this case, newpath must either not exist, or it must specify an empty directory.

If oldpath refers to a symbolic link, the link is renamed; if newpath refers to a symbolic link, the link will be overwritten.



### fs-promise-util.stat (path)

This method retrieves information about a file pointed to by the given path. Returns a Promise for fs.stat (http://nodejs.cn/doc/node/fs.html#fs_fs_stat_path_callback)

* path [ string | Buffer ]


```javascript

return new Promise((resolve) => {
			return fs-promise-util.stat(path)
				.then(() => resolve(true))
				.catch(() => resolve(false));
		});
		```


### fs-promise-util.symlink (target, path)

This method creates a symbolic link named path which contains the string target. 

Returns a Promise for fs.symlink (http://nodejs.cn/doc/node/fs.html#fs_fs_symlink_target_path_type_callback)

* target [ string | Buffer ]
* path [ string | Buffer ]

```javascript

return await fs-promise-util.symlink(target, path)
				.then(() => Promise.resolve(true))
				.catch((err) => {
					return Promise.resolve(false);
				});
				```
Symbolic links are interpreted at run time as if the contents of the link had been substituted into the path being followed to find a file or directory.

Symbolic links may contain ..  path components, which (if used at the start of the link) refer to the parent directories of that in which the link resides. 

A symbolic link (also known as a soft link) may point to an existing file or to a nonexistent one; the latter case is known as a dangling link.

If path exists, it will not be overwritten.

### fs-promise-util.tryWriteFile (file, data, options)

This method is a wrapper for fs-promise-util.writeFile that returns a Promise. 

Asynchronously writes data to a file, replacing the file if it already exists. data can be a string or a buffer.

The encoding option is ignored if data is a buffer. It defaults to 'utf8'.

* file [ string | Buffer | number ] filename or file descriptor
* data [ string | Buffer ]
* options [ Object | string ]

	* encoding [ string | null ] default = 'utf8' 
	* mode [ integer ] default = 0o666 
	* flag [ string ] default = 'w' 

### fs-promise-util.unlink (path)

Promise for fs.unlink

* path [ string | Buffer ]

This method deletes a name from the filesystem.  If that name was the last link to a file and no processes have the file open, the file is deleted and the space it was using is made available for reuse.

If the name was the last link to a file but any processes still have the file open, the file will remain in existence until the last file descriptor referring to it is closed.

If the name referred to a symbolic link, the link is removed.


### fs-promise-util.writeFile (filePath, data, options)

Returns a Promise for fs.writeFile (http://nodejs.cn/doc/node/fs.html#fs_fs_writefile_file_data_options_callback)

This method asynchronously writes data to a file, replacing the file if it already exists. data can be a string or a buffer.

The encoding option is ignored if data is a buffer. It defaults to 'utf8'.

* file [ string | Buffer | number ] filename or file descriptor
* data [ string | Buffer | Uint8Array ]
* options [ Object | string ]

	* encoding [ string | null ] default = 'utf8' 
	* mode [ integer ] default = 0o666 
	* flag [ string ] default = 'w' 

If options is a string, then it specifies the encoding.

```javascript

return await fs-promise-util.writeFile(filePath, data, { encoding : 'utf8' })
	.then(() => {
	.catch((err) => {
		return Promise.resolve();
					});
			})
			.catch((err) => {
				// log inability to write
		return Promise.resolve();
			});
