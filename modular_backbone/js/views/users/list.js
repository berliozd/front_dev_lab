/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var usersListTemplate = '../../../templates/users/list.html';
var UserList = require('../../collections/userList');

module.exports = function ($, _, Backbone, usersListTemplate, UserList) {

  var UsersListView = Backbone.View.extend({

    el: $('#container'),

    render: function () {

      var userList = new UserList();
      var that = this;

      userList.fetch({

        success: function (users) {
          var tpl = _.template(usersListTemplate);
          that.$el.html(tpl({data: users.models}));
        }

      });
    }

  });

  return UsersListView;
}($, _, Backbone, usersListTemplate, UserList);
