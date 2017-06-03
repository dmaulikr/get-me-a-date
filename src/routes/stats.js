/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { Route } = require('serverful')

const Joi = require('joi')

const Database = require('../database')

class Stats extends Route {
  constructor () {
    super('GET', '/stats', 'Stats', 'Returns stats')
  }

  handler ({ query }, reply) {
    const { page = 1, limit = 25 } = query

    Database.Stats.findAll(page, limit)
      .then(({ results, totalCount }) => reply({ results, totalCount }))
  }

  auth () {
    return false
  }

  plugins () {
    return {
      pagination: {
        enabled: true
      }
    }
  }

  validate () {
    return {
      query: {
        page: Joi.string()
          .optional()
          .description('page number'),
        limit: Joi.string()
          .optional()
          .description('page results limit')
      }
    }
  }
}

module.exports = new Stats()