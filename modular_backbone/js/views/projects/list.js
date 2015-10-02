/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var tpl = require('../../../templates/projects/list.html');
var HeaderView = require('../../views/components/header');
var MenuView = require('../../views/components/menu');
var FooterView = require('../../views/components/footer');

module.exports = function ($, _, Backbone, tpl, HeaderView, FooterView, MenuView) {

  var ProjectsListView = Backbone.View.extend({

    el: '#container',

    render: function () {

      // Render common views
      var menuView = new MenuView();
      menuView.render();
      var headerView = new HeaderView();
      headerView.render();
      var footerView = new FooterView();
      footerView.render();

      var data = {};

      var compiledTemplate = _.template(tpl, data);
      this.$el.html(compiledTemplate);
    }

  });

  return ProjectsListView;
}($, _, Backbone, tpl, HeaderView, FooterView, MenuView);
