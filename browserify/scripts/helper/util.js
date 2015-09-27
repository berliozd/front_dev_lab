/**
 * Created by Berlioz on 27/09/2015.
 */


module.exports = function () {
  //Do setup work here
  this.color = 'blue';

  return {
    size: "unisize",
    display: function () {
      console.log('dispddddddddlaying ' + color);
    },
    hide: function () {
      console.log('hiding 1');
    },
    close: function () {
      console.log('closing 1');
    }
  }
}();
