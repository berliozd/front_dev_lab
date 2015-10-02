/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var headerTemplate = require('../../../templates/components/header.html');

module.exports = function ($, _, Backbone, headerTemplate) {

  var HeaderView = Backbone.View.extend({

    el: 'header',

    render: function () {
      var data = {};
      var compiledTemplate = _.template(headerTemplate, data);
      this.$el.html(headerTemplate);
      return this;
    }

  });

  return HeaderView;
}($, _, Backbone, headerTemplate);
