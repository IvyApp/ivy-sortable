var distES6 = require('broccoli-dist-es6-module');

module.exports = distES6('lib', {
  global: 'ivy.sortable',
  packageName: 'ivy-sortable',
  main: 'main',
  shim: {
    'ember': 'Ember'
  }
});
