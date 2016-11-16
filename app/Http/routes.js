'use strict'

/*
 |--------------------------------------------------------------------------
 | Router
 |--------------------------------------------------------------------------
 |
 | AdonisJs Router helps you in defining urls and their actions. It supports
 | all major HTTP conventions to keep your routes file descriptive and
 | clean.
 |
 | @example
 | Route.get('/user', 'UserController.index')
 | Route.post('/user', 'UserController.store')
 | Route.resource('user', 'UserController')
 */

const Route = use('Route')

//application welcome page
Route.on('/').render('welcome');

//loging and logout
Route.get('/login','AuthController.index');
Route.post('/login','AuthController.login');
Route.get('/logout','AuthController.logout');

//activation and user registration
Route.get('activate/:key','RegisterController.activate');
Route.get('/register','RegisterController.index');
Route.post('/register','RegisterController.register');

//chating and chat history
Route.group('auth-routes', () => {
  Route.get('/chat','ConversationController.index');
  Route.post('/chat','ConversationController.store');
  Route.get('/history/:date','ConversationController.history');
}).middleware('auth')

//forget password
Route.get('forgetpasswordrequest','ForgetpasswordController.index');
Route.post('forgetpasswordrequest','ForgetpasswordController.sendmail');
Route.get('codeverification','ForgetpasswordController.getcode');
Route.post('codeverification','ForgetpasswordController.verifycode');


