/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var menuTemplate = require('../../../templates/components/menu.html');

module.exports = function ($, _, Backbone, menuTemplate) {

  var MenuView = Backbone.View.extend({

    el: $('aside'),

    render: function () {
      console.log('in MenuView rendering in ' + this.$el);
      var data = {};
      var compiledTemplate = _.template(menuTemplate, data);
      this.$el.html(compiledTemplate);
    }

  });

  return MenuView;
}($, _, Backbone, menuTemplate);
