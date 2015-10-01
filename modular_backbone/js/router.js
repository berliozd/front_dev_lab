/**
 * Created by Berlioz on 28/09/2015.
 */
// Filename: router.js
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var ProjectListView = require('./views/projects/list');
var UserListView = require('./views/users/list');
var HomeView = require('./views/home/home');
var HeaderView = require('./views/components/header');
var MenuView = require('./views/components/menu');
var FooterView = require('./views/components/footer');

module.exports = function ($, _, Backbone, ProjectListView, UserListView, HomeView, HeaderView, MenuView, FooterView) {

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

    // Render common views
    var menuView = new MenuView();
    menuView.render();
    var headerView = new HeaderView();
    headerView.render();
    var footerView = new FooterView();
    footerView.render();


    Backbone.history.start();
  };

  return {
    initialize: initialize
  };

}($, _, Backbone, ProjectListView, UserListView, HomeView, HeaderView, MenuView, FooterView);
