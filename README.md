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

import fs-promise-util from 'fs-promise-util';


## Methods in alphabetical order

// append data to a file, creating the file if it does not exist and return a Promise 

**fs-promise-util.appendFile**


// returns a new readStream object

**fs-promise-util.createReadStream**

// returns a new writeStream object

**fs-promise-util.createWriteStream**

// creates a given path and returns a Promise

**ensurePath (directoryPath)**

// checks whether a given path exists in the file system and returns a Promise(true or false) 

**exists (filePath)**

// returns a promise for lstat

**fs-promise-util.lstat**

// async function that removes x number of least recent files matching pattern

**fs-promise-util.prune (directoryPath, filter, retainCount)**

// returns a promise for fs.readdir

**fs-promise-util.readdir**

// returns a promise for fs.readlink

**fs-promise-util.readlink**

// async function that returns a promise for fs.readdir that additionaly sorts files based on date

**fs-promise-util.readAndSort (directoryPath, options)**

// Promise for fs.createReadStream

**fs-promise-util.readFile (filePath, options)**

// Promise for fs.realPath

**fs-promise-util.realpath**

// Promise for fs.rename

**fs-promise-util.rename**

// Promise for fs.stat

**fs-promise-util.stat**

// Promise for fs.symlink

**fs-promise-util.symlink**

// wrapper for fs-promise-util.writeFile that returns a Promise

**fs-promise-util.tryWriteFile (filePath, data, options)**

// Promise for fs.unlink

**fs-promise-util.unlink**

// Promise for fs.createWriteStream

**fs-promise-util.writeFile (filePath, data, options)**

