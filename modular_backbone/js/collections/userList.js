/**
 * Created by Berlioz on 28/09/2015.
 */
define([
  'jquery',
  'underscore',
  'backbone',
], function ($, _, Backbone) {

  var UserList = Backbone.Collection.extend({

    url : "rest/users.json"

  });

  return UserList;
});
