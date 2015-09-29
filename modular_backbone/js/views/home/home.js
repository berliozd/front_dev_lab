/**
 * Created by Berlioz on 28/09/2015.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home/home.html'
], function ($, _, Backbone, homeTemplate) {

  var HomeView = Backbone.View.extend({

    el: $('#container'),

    render: function () {
      var data = {};
      var compiledTemplate = _.template(homeTemplate, data);
      this.$el.html(compiledTemplate);
    }

  });

  return HomeView;
});
