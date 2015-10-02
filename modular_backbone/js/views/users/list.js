/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var tpl = require('../../../templates/users/list.html');
var UserListCollections = require('../../collections/userList');
var Page = require('../page');

module.exports = function ($, _, Backbone, tpl, UserListCollections) {

  var UsersListView = Page.extend({

    render: function () {

      console.log('render users list view');

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

  });

  return UsersListView;

}($, _, Backbone, tpl, UserListCollections);
