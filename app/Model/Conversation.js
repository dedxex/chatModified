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
}

module.exports = Conversation
