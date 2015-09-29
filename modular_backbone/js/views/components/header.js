/**
 * Created by Berlioz on 28/09/2015.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/components/header.html'
], function ($, _, Backbone, headerTemplate) {

  var HeaderView = Backbone.View.extend({

    el: $('header'),

    render: function () {
      var data = {};
      var compiledTemplate = _.template(headerTemplate, data);
      this.$el.html(compiledTemplate);
    }

  });

  return HeaderView;
});
