/**
 * Created by Berlioz on 28/09/2015.
 */
// Filename: views/users/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!../../../templates/users/list.html'
], function($, _, Backbone, usersListTemplate){
  var UsersListView = Backbone.View.extend({
    el: $('#container'),
    render: function(){

      console.log('render users list');
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template( usersListTemplate, data );
      // Append our compiled template to this Views "el"
      this.$el.append( compiledTemplate );
    }
  });
  // Our module now returns our view
  return UsersListView;
});
