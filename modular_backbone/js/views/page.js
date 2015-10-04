/**
 * Created by Berlioz on 28/09/2015.
 */
var Backbone = require('backbone');
var HeaderView = require('./components/header');
var MenuView = require('./components/menu');
var FooterView = require('./components/footer');

module.exports = function (Backbone, HeaderView, FooterView, MenuView) {

  var Page = Backbone.View.extend({

    el: '#container',

    initialize: function () {
      // Render common views
      var menuView = new MenuView();
      menuView.render();
      var headerView = new HeaderView();
      headerView.render();
      var footerView = new FooterView();
      footerView.render();
    }
  });

  return Page;

}(Backbone, HeaderView, FooterView, MenuView);
