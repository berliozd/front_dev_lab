/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var projectsListTemplate = require('../../../templates/projects/list.html');

module.exports = function ($, _, Backbone, projectsListTemplate) {

  var ProjectsListView = Backbone.View.extend({

    el: $('#container'),

    render: function () {
      var data = {};

      var compiledTemplate = _.template(projectsListTemplate, data);
      this.$el.html(compiledTemplate);
    }

  });

  return ProjectsListView;
}($, _, Backbone, projectsListTemplate);
