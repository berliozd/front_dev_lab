/**
 * Created by Berlioz on 28/09/2015.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/components/menu.html'
], function ($, _, Backbone, menuTemplate) {

  var MenuView = Backbone.View.extend({

    el: $('aside'),

    render: function () {
      var data = {};
      var compiledTemplate = _.template(menuTemplate, data);
      this.$el.html(compiledTemplate);
    }

  });

  return MenuView;
});
