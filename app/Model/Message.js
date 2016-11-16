'use strict'

const Lucid = use('Lucid')

class Message extends Lucid {
  conversations () {
    return this.belongsTo('App/Model/Conversation')
  }
}

module.exports = Message
