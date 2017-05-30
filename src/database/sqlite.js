/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Promise = require('bluebird')

const sqlite3 = require('sqlite3')

const { mkdirAsync, existsSync } = Promise.promisifyAll(require('fs'))

const { join } = require('path')

const createFile = function () {
  return Promise.resolve()
    .then(() => {
      const path = join(__dirname, '../../tmp/')

      if (!existsSync(path)) {
        return mkdirAsync(path)
      }
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        const path = join(__dirname, '../../tmp/get-me-a-date.db')
        const options = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
        const callback = (error) => {
          if (error) {
            reject(error)

            return
          }

          resolve()
        }

        this._database = Promise.promisifyAll(new sqlite3.Database(path, options, callback))
      })
    })
}

const createSchema = function () {
  return this._database.runAsync(
    'CREATE TABLE IF NOT EXISTS people (' +
    'id VARCHAR(36) NOT NULL, ' +
    'created_date DATETIME DEFAULT CURRENT_TIMESTAMP, ' +
    'updated_date DATETIME DEFAULT CURRENT_TIMESTAMP, ' +
    'like INTEGER NOT NULL DEFAULT 0,' +
    'photos_similarity_mean REAL NOT NULL,' +
    'train INTEGER NOT NULL DEFAULT 0,' +
    'provider VARCHAR(32) NOT NULL, ' +
    'provider_id VARCHAR(64) NOT NULL, ' +
    'data TEXT,' +
    'PRIMARY KEY (provider, provider_id)' +
    ')')
    .then(() => this._database.runAsync(
      'CREATE TABLE IF NOT EXISTS auth (' +
      'provider VARCHAR(32) NOT NULL, ' +
      'created_date DATETIME DEFAULT CURRENT_TIMESTAMP, ' +
      'updated_date DATETIME DEFAULT CURRENT_TIMESTAMP, ' +
      'api_token TEXT NOT NULL,' +
      'PRIMARY KEY (provider)' +
      ')'))
}

class SQLite {
  start () {
    if (this._database) {
      return Promise.resolve()
    }

    return createFile.bind(this)()
      .then(() => createSchema.bind(this)())
  }

  run (...args) {
    return this._database.runAsync(...args)
  }

  get (...args) {
    return this._database.getAsync(...args)
  }

  all (...args) {
    return this._database.allAsync(...args)
  }
}

module.exports = new SQLite()