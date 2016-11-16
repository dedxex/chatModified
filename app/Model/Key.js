'use strict'

const Lucid = use('Lucid')

class Key extends Lucid {
  temp_users () {
    return this.belongsTo('App/Model/TempUser')
  }
  users () {
    return this.belongsTo('App/Model/User')
  }
}

module.exports = Key
