/**
 * Created by Berlioz on 28/09/2015.
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = function ($, _, Backbone) {

  var UserList = Backbone.Collection.extend({

    url: "rest/users.json"

  });

  return UserList;
}($, _, Backbone);
