'use strict'

const Schema = use('Schema')

class ConversationsTableSchema extends Schema {

  up () {
    this.create('conversations', (table) => {
      table.increments()
      table.integer('sender_id').unsigned().references('id').inTable('users');
      table.integer('receiver_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('conversations')
  }

}

module.exports = ConversationsTableSchema
