/**
 * Created by Berlioz on 27/09/2015.
 */

define(
  function () {
    //Do setup work here
    this.color = 'blue';

    var util = {
      size: "unisize",
      display: function () {
        console.log('display : ' + color);
      },
      hide: function () {
        console.log('hiding 1');
      },
      close: function () {
        console.log('closing 1');
      }
    };

    return util;
  }
);
