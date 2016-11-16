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
  conversations() {
  return this.hasMany('App/Model/Conversation','id','sender_id');
}
  //---------------------------------------
  //---------------------------------------

}

module.exports = User


