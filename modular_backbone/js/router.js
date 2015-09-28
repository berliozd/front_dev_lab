/**
 * Created by Berlioz on 28/09/2015.
 */
// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/projects/list',
  'views/users/list'
], function($, _, Backbone, ProjectListView, UserListView){

  //console.log('in router');

  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'projects': 'showProjects',
      'users': 'showUsers',

      // Default
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){
    console.log('AppRouter');

    var app_router = new AppRouter;

    app_router.on('route:showProjects', function(){
      console.log('showProjects');
      // Call render on the module we loaded in via the dependency array
      // 'views/projects/list'
      var projectListView = new ProjectListView();
      projectListView.render();
    });
    // As above, call render on our loaded module
    // 'views/users/list'
    app_router.on('route:showUsers', function(){
      console.log('showUsers');
      var userListView = new UserListView();
      userListView.render();
    });
    app_router.on('route:defaultAction', function(actions){
      console.log('defaultAction');
      // We have no matching route, lets just log what the URL was
      console.log('No route:', actions);
    });
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };

});
