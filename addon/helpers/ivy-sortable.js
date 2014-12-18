import Ember from 'ember';

export default function(path, options) {
  var ctx, helperName = 'ivy-sortable';

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
