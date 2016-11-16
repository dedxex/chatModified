'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  apiTokens () {
    return this.hasMany('App/Model/Token');
  }
  //---------------------------------------
  keys () {
    return this.hasMany('App/Model/Key');
  }
  //---------------------------------------
  conSent() {
    return this.hasMany('App/Model/Conversation','id','sender_id');
  }
  //---------------------------------------
  conReceived() {
    return this.hasMany('App/Model/Conversation','id','receiver_id');
  }
  //---------------------------------------

}

module.exports = User


