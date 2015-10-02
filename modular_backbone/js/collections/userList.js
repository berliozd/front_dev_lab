/**
 * Created by Berlioz on 28/09/2015.
 */
var Backbone = require('backbone');

module.exports = function (Backbone) {

  var UserList = Backbone.Collection.extend({

    url: "rest/users.json"

  });

  return UserList;
}(Backbone);
