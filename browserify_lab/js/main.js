/**
 * Created by Berlioz on 25/09/2015.
 */

var _ = require('underscore'),
  names = require('./names.js'),
  findSuperMan = require('./findSuperman.js')

if (findSuperMan(names())) {
  document.write('We found Superman');
} else {
  document.write('No Superman...');
}
