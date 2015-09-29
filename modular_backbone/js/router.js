/**
 * Created by Berlioz on 28/09/2015.
 */
// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/projects/list',
  'views/users/list',
  'views/home/home',
  'views/components/header',
  'views/components/menu',
  'views/components/footer',
], function($, _, Backbone, ProjectListView, UserListView,
            HomeView, HeaderView, MenuView, FooterView){

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

  var initialize = function(){
    console.log('AppRouter');

    var app_router = new AppRouter;

    app_router.on('route:showProjects', function(){
      var projectListView = new ProjectListView();
      projectListView.render();
    });

    app_router.on('route:showUsers', function(){
      var userListView = new UserListView();
      userListView.render();
    });

    app_router.on('route:showHome', function(){
      var homeView = new HomeView();
      homeView.render();
    });

    app_router.on('route:defaultAction', function(){
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

});
