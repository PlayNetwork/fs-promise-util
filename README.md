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

This method appends data to a file, creating the file if it does not exist. It returns a promise for fs.appendFile (https://nodejs.org/dist/latest-v7.x/docs/api/fs.html#fs_fs_appendfile_file_data_options_callback)


* file [ string | Buffer | number ] filename or file descriptor
* data [ string | Buffer ]
* options [ Object | string ]

	* encoding [ string | null ] default = 'utf8' 
	* mode [ integer ] default = 0o666 
	* flag [ string ] default = 'a' 
                                                
```javascript
import fs from 'fs-promise-util';

export async function saveMessage (message = '') {
  return await fs
    .appendFile(
      '/path/to/messages.log',
      message,
      { encoding : 'utf8' })
    .catch((err) => console.error(err));
}
```  


### fs-promise-util.createReadStream (filepath, options)

The function fs-promise-util.createReadStream() allows you to open up a readable stream in a very simple manner. All you have to do is pass the path of the file to start streaming in. This method uses the graceful-fs createReadStream method. 

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
import fs from 'fs-promise-util';

export async function getContent () {
	return await new Promise((resolve, reject) => {
		let
			chunks = [],
			reader = fs
				.createReadStream(
					'/path/to/messages.log',
					{ encoding : 'utf8' });			
		// capture events
		reader.on('data', (chunk) => chunks.push(chunk));
		reader.on('end', () => resolve(chunks.join('')));
		reader.on('error', reject);
	});
}
```

options is an object or string with the following defaults:

	{
  		flags: 'r',
  		encoding: null,
  		fd: null,
  		mode: 0o666,
  		autoClose: true
	}


### fs-promise-util.createWriteStream (filepath, options)

The function fs-promise-util.createWriteStream() creates a writable stream. After a call to fs-promise-util.createWriteStream with the filepath, you have a writeable stream to work with. This method uses the graceful-fs createWriteStream method. 

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
import fs from 'fs-promise-util';

export async function writeContent () {
	return await new Promise((resolve, reject) => {
		let writer = fs
			.createWriteStream(
				'/path/to/messages.log',
				{ encoding : 'utf8' });			
		// capture events
		writer.on('error', reject);
		writer.on('finish', resolve);					
		// write data
		writer.end(data);
	});
}
```


### fs-promise-util.ensurePath (directoryPath)

This method creates a given path and returns a Promise. It takes in a string  value which is the directory path and creates it.

* directoryPath [ string ]

```javascript
import fs from 'fs-promise-util';

export async function writeContent () {
	return await fs
		.ensurePath(
			'/path/to/messages')
		.then((path) => {
			console.info('directory created');
			return Promise.resolve(path);
		})
		.catch((err) => console.error(err));
	}
```

### fs-promise-util.exists (filePath)

This method takes in a path as an argument. It checks whether a given path exists in the file system and returns a true or a false.

```javascript
import fs from 'fs-promise-util';

export async function checkIfExists () {
 let exists = await fs
 	.exists(
 		'/path/to/messages.log');
 if(exists) {
 	return true;
}		
```

### fs-promise-util.lstat (path)

This method returns a promise for lstat. More details here. (https://nodejs.org/api/fs.html#fs_fs_lstat_path_callback)

```javascript
import fs from 'fs-promise-util';

export async function getStatus () {
	return fs
		.lstat(
			'/path/to/messages.log')
		.catch((err) => console.error(err));
	});
}
```

### fs-promise-util.prune (directoryPath, filter, retainCount)

This method removes 'x' number of least recent files matching a given pattern from a directory.

directoryPath: directory to remove the files

filter: pattern for the file removal. For example: a regular expression matching a file name 

retainCount: number of files you want to keep in the directory

```javascript
import fs from 'fs-promise-util';

export async function removeFiles () {
	return await fs
		.prune(
			'/path/to/messages',
			new RegExp('\\w+'),
			'number of files to keep')
		.catch((err) => console.error(err));
}
```

### fs-promise-util.readdir (path, options)

This method reads the contents of a directory and returns a promise.

* path [ string | Buffer ]
* options [ string | Object ] 
	* encoding [ string ] default = 'utf8'
	
```javascript
import fs from 'fs-promise-util';

export async function getFiles () {
	return await fs
		.readdir(
			'/path/to/messages directory',
			{ encoding : 'utf8' })
		.catch((err) => console.error(err));
}
```


### fs-promise-util.readlink (path, options)

This method returns the absolute path of a file or folder pointed by a symlink as a promise. If the path is not an symlink or shortcut, it will resolve to an empty string.

* path [ string | Buffer ]
* options [ string | Object ]
	* encoding [ string ] default = 'utf8'

	
```javascript
import fs from 'fs-promise-util';

export async function getPath () {
	return await fs
		.readlink(
			'/path/to/messages.log', 
			'utf8')
		.catch((err) => console.error(err));
}
```

### fs-promise-util.readAndSort (directoryPath, options)

This method reads the content of the directory passed and sorts files based on date and returns files. 'options' object can be used to pass in:

* options.sort : sort files based on date

* options.filter : any filters passed with the file name(options.filter.name)

```javascript
import fs from 'fs-promise-util';

export async function sortFiles () {
	let exists = await fs
		.readAndSort(
			'/path/to/messages directory',
			{ filter :{ name : new RegExp('\\w+')}})
		.catch((err) => console.error(err));
}
```

### fs-promise-util.readFile (file, options)

This method asynchronously reads the entire contents of a file and returns a Promise

* file [string | Buffer | integer ] filename or file descriptor
* options [ Object | string ]
	* encoding [ string | null ] default = null
	* flag [ string ] default = 'r'
	
	
```javascript
import fs from 'fs-promise-util';

export async function getFileContent () {
	return await fs
		.readFile(
			'/path/to/log.txt')			)
		.catch((err) => console.error(err));
}
```

	
If options is a string, then it specifies the encoding. 


```javascript
import fs from 'fs-promise-util';

export async function getFileContent () {
	return await fs
		.readFile(
			'/path/to/messages directory',
			'utf8')
		.catch((err) => console.error(err));
}
```


### fs-promise-util.realpath (path, options)

This method returns the absolute pathname for the given path as a Promise. In other words, it returns a promise for fs.realPath (https://nodejs.org/dist/latest-v7.x/docs/api/fs.html#fs_fs_realpath_path_options_callback)


* path [ string | Buffer ]
* options [ string | Object ]
	* encoding [ string ] default = 'utf8'
	
Lets say the directory structure is '/etc/readme'

```javascript
import fs from 'fs-promise-util';

export async function getAbsolutePath () {
	return await fs
		.realPath(
			'/messages directory',
			'utf8')
		.catch((err) => console.error(err));
}
```
	
The optional 'options' argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the path passed to the callback. If the encoding is set to 'buffer', the path returned will be passed as a Buffer object.

### fs-promise-util.rename (oldPath, newPath)

This method renames a file, moving it between directories if required.
Returns a Promise for fs.rename

* oldPath [ string | Buffer ]
* newPath [ string | Buffer ]

```javascript
import fs from 'fs-promise-util';

export async function renameFile () {
  return await fs
    .rename(
      '/path/to/tmp dir',
      '/path/to/messages dir')
    .catch((err) => console.error(err));
}
```


If newpath already exists, it will be atomically replaced, so that there is no point at which another process attempting to access newpath will find it missing.  However, there will probably be a window in which both oldpath and newpath refer to the file being renamed.

If oldpath and newpath are existing hard links referring to the same file, then rename() does nothing, and returns a success status.

If newpath exists but the operation fails for some reason, rename() guarantees to leave an instance of newpath in place.

oldpath can specify a directory.  In this case, newpath must either not exist, or it must specify an empty directory.

If oldpath refers to a symbolic link, the link is renamed; if newpath refers to a symbolic link, the link will be overwritten.



### fs-promise-util.stat (path)

This method retrieves information about a file pointed to by the given path. Returns a Promise for fs.stat (http://nodejs.cn/doc/node/fs.html#fs_fs_stat_path_callback)

* path [ string | Buffer ]


```javascript
import fs from 'fs-promise-util';

export async function getStat () {
	return fs
		.stat(
			'/path/to/info.log')
		.catch((err) => console.error(err));
}
```


### fs-promise-util.symlink (target, path)

This method creates a symbolic link named path which contains the string target. 

Returns a Promise for fs.symlink (http://nodejs.cn/doc/node/fs.html#fs_fs_symlink_target_path_type_callback)

* target [ string | Buffer ]
* path [ string | Buffer ]

```javascript
import fs from 'fs-promise-util';

export async function createSymink () {
	return await fs
		.symlink('./foo','./bar')
		.catch((err) => console.error(err));
}
```
The above function creates a symbolic link named "bar" that points to "foo".

Symbolic links are interpreted at run time as if the contents of the link had been substituted into the path being followed to find a file or directory.

Symbolic links may contain ..  path components, which (if used at the start of the link) refer to the parent directories of that in which the link resides. 

A symbolic link (also known as a soft link) may point to an existing file or to a nonexistent one; the latter case is known as a dangling link.

If path exists, it will not be overwritten.

### fs-promise-util.tryWriteFile (file, data, options)

This method is a wrapper for fs-promise-util.writeFile that always resolves to a Promise.

Asynchronously writes data to a file, replacing the file if it already exists. data can be a string or a buffer.

The encoding option is ignored if data is a buffer. It defaults to 'utf8'.

* file [ string | Buffer | number ] filename or file descriptor
* data [ string | Buffer ]
* options [ Object | string ]

	* encoding [ string | null ] default = 'utf8' 
	* mode [ integer ] default = 0o666 
	* flag [ string ] default = 'w' 

```javascript
import fs from 'fs-promise-util';

export async function tryWriteContent (data = '') {
	return await fs
		.tryWriteFile(
			'/path/to/info.log',
			'data',
			{ encoding : 'utf8' })
		.catch((err) => console.error(err));
}
```

### fs-promise-util.unlink (path)

Promise for fs.unlink

* path [ string | Buffer ]


```javascript
import fs from 'fs-promise-util';

export async function delete () {
	return fs
		.unlink(
			'/path/to/file')
		.catch((err) => console.error(err));
}
```


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
import fs from 'fs-promise-util';


export async function tryWriteContent () {
	return await fs
		.writeFile(
			'/path/to/messages.log',
			'data to write',
			{ encoding : 'utf8' })
		.catch((err) => console.error(err));
}
```
