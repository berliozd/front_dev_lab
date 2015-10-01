/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var homeTemplate = require('../../../templates/home/home.html');

module.exports = function ($, _, Backbone, homeTemplate) {

  var HomeView = Backbone.View.extend({

    el: $('#container'),

    render: function () {
      var data = {};
      var compiledTemplate = _.template(homeTemplate, data);
      this.$el.html(compiledTemplate);
    }

  });

  return HomeView;
}($, _, Backbone, homeTemplate);
