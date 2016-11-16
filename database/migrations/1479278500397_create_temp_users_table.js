'use strict'

const Schema = use('Schema')

class TempUsersTableSchema extends Schema {

  up () {
    this.create('temp_users', (table) => {
      table.increments()
      table.string('username', 80).notNullable()
      table.string('email', 254).notNullable()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('temp_users')
  }

}

module.exports = TempUsersTableSchema
