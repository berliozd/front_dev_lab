/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var tpl = require('../../../templates/users/list.html');
var UserListCollections = require('../../collections/userList');
var HeaderView = require('../../views/components/header');
var MenuView = require('../../views/components/menu');
var FooterView = require('../../views/components/footer');

module.exports = function ($, _, Backbone, tpl, UserListCollections, HeaderView, FooterView, MenuView) {

  var UsersListView = Backbone.View.extend({

    el: '#container',

    render: function () {

      // Render common views
      var menuView = new MenuView();
      menuView.render();
      var headerView = new HeaderView();
      headerView.render();
      var footerView = new FooterView();
      footerView.render();

      var userListColl = new UserListCollections();
      var that = this;

      userListColl.fetch({

        success: function (users) {
          console.log('fetch success');
          var compiledTpl = _.template(tpl);
          that.$el.html(compiledTpl({data: users.models}));
        }

      });
    },

    initialize : function() {

    }
  });

  return UsersListView;
}($, _, Backbone, tpl, UserListCollections, HeaderView, FooterView, MenuView);
