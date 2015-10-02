/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var tpl = require('../../../templates/projects/list.html');
var Page = require('../page');

module.exports = function ($, _, Backbone, tpl) {

  var ProjectsListView = Page.extend({

    render: function () {
      console.log('render projects list view');
      var data = {};
      var compiledTemplate = _.template(tpl, data);
      this.$el.html(compiledTemplate);
    }

  });

  return ProjectsListView;

}($, _, Backbone, tpl);
