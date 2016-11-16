'use strict'

const Lucid = use('Lucid')

class Key extends Lucid {
  user () {
    return this.belongsTo('App/Model/User')
  }
}

module.exports = Key
