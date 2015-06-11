/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var pickFiles = require('broccoli-static-compiler');

/*
  This Brocfile specifes the options for the dummy test app of this
  addon, located in `/tests/dummy`

  This Brocfile does *not* influence how the addon or the app using it
  behave. You most likely want to be modifying `./index.js` or app's Brocfile
*/

var app = new EmberAddon();

app.import(app.bowerDirectory + '/ember/ember-template-compiler.js', { type: 'test' });
app.import(app.bowerDirectory + '/jquery-simulate/jquery.simulate.js', { type: 'test' });

var bootstrapTree = pickFiles(app.bowerDirectory + '/bootstrap/dist', {
  destDir: '/assets',
  srcDir: '/'
});

module.exports = app.toTree([bootstrapTree]);
