/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var tpl = require('../../../templates/home/home.html');
var Page = require('../page');

module.exports = function ($, _, Backbone, tpl) {

  var HomeView = Page.extend({

    render: function () {
      console.log('render home view');
      var data = {};
      var compiledTemplate = _.template(tpl, data);
      this.$el.html(compiledTemplate);
    }

  });

  return HomeView;

}($, _, Backbone, tpl);
