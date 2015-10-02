/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var menuTemplate = require('../../../templates/components/menu.html');

module.exports = (function ($, _, Backbone, menuTemplate) {

  var MenuView = Backbone.View.extend({

    el: '#menu',

    render: function () {
      this.$el.html(menuTemplate);
      return this;
    }

  });

  return MenuView;

})($, _, Backbone, menuTemplate);
