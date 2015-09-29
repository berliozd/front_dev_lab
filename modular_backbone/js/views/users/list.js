/**
 * Created by Berlioz on 28/09/2015.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/users/list.html',
  'collections/userList'
], function ($, _, Backbone, usersListTemplate, UserList) {

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
});
