'use strict'

const Schema = use('Schema')

class KeysTableSchema extends Schema {

  up () {
    this.create('keys', (table) => {
      table.increments()
      table.integer('temp_user_id').unsigned().references('id').inTable('temp_users')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('key');
      table.string('type');
      table.integer('is_used');
      table.timestamp('used_at');
      table.timestamps()
    })
  }

  down () {
    this.drop('keys')
  }

}

module.exports = KeysTableSchema
