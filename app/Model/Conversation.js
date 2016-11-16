'use strict'

const Lucid = use('Lucid')

class Conversation extends Lucid {
  messages () {
    return this.hasMany('App/Model/Message');
  }
  //--------------------------------------------------------
  senderId() {
    return this.belongsTo('App/Model/User','id','sender_id')
  }
  //--------------------------------------------------------
  receiverId() {
    return this.belongsTo('App/Model/User','id','receiver_id')
  }
  //--------------------------------------------------------
  static scopreConversationWith(query, receiver_id)
  {
    query.where('receiver_id', receiver_id)
  }
  //--------------------------------------------------------
  // var message = yield User.query().where('id', 1)
  // .conversations().conversationWith(2).messages().fetch()

  //--------------------------------------------------------
}

module.exports = Conversation
