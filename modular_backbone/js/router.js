/**
 * Created by Berlioz on 28/09/2015.
 */
// Filename: router.js
var Backbone = require('backbone');
var ProjectListView = require('./views/projects/list');
var UserListView = require('./views/users/list');
var HomeView = require('./views/home/home');


module.exports = function (Backbone, ProjectListView, UserListView, HomeView) {

  //console.log('in router');

  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'projects': 'showProjects',
      'users': 'showUsers',
      'home': 'showHome',
      // Default
      '*actions': 'defaultAction'
    }
  });

  var initialize = function () {
    console.log('AppRouter');

    var app_router = new AppRouter;

    app_router.on('route:showProjects', function () {
      var projectListView = new ProjectListView();
      projectListView.render();
    });

    app_router.on('route:showUsers', function () {
      var userListView = new UserListView();
      userListView.render();
    });

    app_router.on('route:showHome', function () {
      var homeView = new HomeView();
      homeView.render();
    });

    app_router.on('route:defaultAction', function () {
      var homeView = new HomeView();
      homeView.render();
    });

    Backbone.history.start();
  };

  return {
    initialize: initialize
  };

}(Backbone, ProjectListView, UserListView, HomeView);
