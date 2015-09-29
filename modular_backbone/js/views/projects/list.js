/**
 * Created by Berlioz on 28/09/2015.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/projects/list.html'
], function ($, _, Backbone, projectsListTemplate) {

  var ProjectsListView = Backbone.View.extend({

    el: $('#container'),

    render: function () {
      var data = {};

      var compiledTemplate = _.template(projectsListTemplate, data);
      this.$el.html(compiledTemplate);
    }

  });

  return ProjectsListView;
});
