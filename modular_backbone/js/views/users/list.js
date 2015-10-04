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

  var userListColl = new UserListCollections();

  var UsersListView = Page.extend({

    models: userListColl,

    render: function () {
      var compiledTpl = _.template(tpl);
      this.$el.html(compiledTpl({data: this.models.models}));
    },

    initialize : function() {
      (new Page()).initialize();

      this.listenTo(this.models, 'sync', this.render);

      this.models.fetch();
    },


  });

  return UsersListView;

}($, _, Backbone, tpl, UserListCollections);
