import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import { spawn } from 'child_process';
import sinon from 'sinon';

const TEST_CACHE_PATH = 'test/sandbox/test-cache';

global.chai = chai;

global.chai.use(chaiAsPromised);

global.sinon = sinon;

global.execAsPromise = (command, args) => {
  return new Promise((resolve, reject) => {
    let
      message = [],
      process = spawn(command, args);

    process.stderr.on('data', (buffer) => message.push(buffer.toString()));

    process.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(message.join('')));
      }

      return resolve();
    });
  });
};

function pad2 ( number ) {
  const TEN = 10;
  return (number < TEN ? '0' : '') + number
}

global.prepareTestCacheAsDirectory = () => {
  return global.execAsPromise('mkdir', ['-p', TEST_CACHE_PATH]);
};

global.prepareTestCacheAsFile = () => {
  return global.execAsPromise('touch', [TEST_CACHE_PATH]);
};

global.prepareTestCacheFile = (filename, modifiedDate) => {
  if (modifiedDate) {
    if (modifiedDate instanceof Date) {
      let
        day = modifiedDate.getDate(),
        hour = modifiedDate.getHours(),
        min = modifiedDate.getMinutes(),
        month = modifiedDate.getMonth()+1,
        year = modifiedDate.getFullYear();

      return global.execAsPromise('touch', ['-mt', [year, pad2(month), pad2(day), pad2(hour), pad2(min)].join(''), path.join(TEST_CACHE_PATH, filename)]);
    }

    // assume if you are here, the date is in correct touch format
    return global.execAsPromise('touch', ['-mt', modifiedDate, path.join(TEST_CACHE_PATH, filename)]);
  } else {
    return global.execAsPromise('touch', [path.join(TEST_CACHE_PATH, filename)]);
  }
};

global.prepareTestCacheAsSymbolicLink = () => {
  return global.execAsPromise('ln', ['-s', '.', TEST_CACHE_PATH]);
};

global.removeTestCache = () => {
  return global.execAsPromise('rm', ['-rf', TEST_CACHE_PATH]);
};

global.should = chai.should();

global.TEST_CACHE_PATH = TEST_CACHE_PATH;
