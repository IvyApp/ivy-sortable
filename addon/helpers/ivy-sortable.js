import Ember from 'ember';

export default function(path, options) {
  var ctx, helperName = 'ivy-sortable';

  Ember.deprecate(
    'Using the {{ivy-sortable}} helper is deprecated. ' +
    'Please use the collection form ' +
    '(`{{#collection "ivy-sortable" content=foo}}`) instead.');

  if (arguments.length === 1) {
    options = path;
    path = 'this';
  } else {
    helperName += ' ' + path;
  }

  options.hash.contentBinding = path;

  // can't rely on this default behavior when use strict
  ctx = this || window;

  options.helperName = options.helperName || helperName;

  return Ember.Handlebars.helpers.collection.call(ctx, 'ivy-sortable', options);
}
