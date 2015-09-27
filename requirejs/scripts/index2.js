/**
 * Created by Berlioz on 27/09/2015.
 */
requirejs(["helper/util", "helper/connection"], function() {
  app.util.display();
  app.util.hide();
  app.connection.open();
  app.connection.close();
  //This function is called when scripts/helper/util.js is loaded.
  //If util.js calls define(), then this function is not fired until
  //util's dependencies have loaded, and the util argument will hold
  //the module value for "helper/util".
});
