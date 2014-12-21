import Ember from 'ember';

export default Ember.CollectionView.extend(Ember.TargetActionSupport, {
  disabled: false,

  tagName: 'ul',

  destroySortable: Ember.on('willDestroyElement', function() {
    this.$().sortable('destroy');
  }),

  initSortable: Ember.on('didInsertElement', function() {
    var opts = {};

    Ember.EnumerableUtils.forEach(['start', 'update'], function(callback) {
      opts[callback] = Ember.run.bind(this, callback);
    }, this);

    this.$().sortable(opts);

    Ember.EnumerableUtils.forEach([
      'axis', 'containment', 'cursor', 'cursorAt', 'delay', 'disabled',
      'distance', 'forceHelperSize', 'forcePlaceholderSize', 'grid', 'helper',
      'opacity', 'placeholder', 'revert', 'scroll', 'scrollSensitivity',
      'scrollSpeed', 'tolerance', 'zIndex'
    ], this._bindSortableOption, this);
  }),

  move: function(oldIndex, newIndex) {
    var content = this.get('content');

    if (content) {
      var item = content.objectAt(oldIndex);

      this._disableArrayObservers(content, function() {
        content.removeAt(oldIndex);
        content.insertAt(newIndex, item);
      });

      this.sendAction('moved', item, oldIndex, newIndex);
    }
  },

  /**
   * Copied from `Ember.Component`. Read the `sendAction` documentation there
   * for more information.
   *
   * @method sendAction
   */
  sendAction: function(action) {
    var actionName;
    var contexts = Array.prototype.slice.call(arguments, 1);

    if (action === undefined) {
      actionName = this.get('action');
      Ember.assert('The default action was triggered on the component ' + this.toString() +
                   ', but the action name (' + actionName + ') was not a string.',
                   Ember.isNone(actionName) || typeof actionName === 'string');
    } else {
      actionName = this.get(action);
      Ember.assert('The ' + action + ' action was triggered on the component ' +
                   this.toString() + ', but the action name (' + actionName +
                   ') was not a string.',
                   Ember.isNone(actionName) || typeof actionName === 'string');
    }

    // If no action name for that action could be found, just abort.
    if (actionName === undefined) { return; }

    this.triggerAction({
      action: actionName,
      actionContext: contexts
    });
  },

  start: function(event, ui) {
    ui.item.data('oldIndex', ui.item.index());
  },

  targetObject: Ember.computed(function() {
    var parentView = this.get('_parentView');
    return parentView ? parentView.get('controller') : null;
  }).property('_parentView'),

  update: function(event, ui) {
    var oldIndex = ui.item.data('oldIndex');
    var newIndex = ui.item.index();

    this.move(oldIndex, newIndex);
  },

  _bindSortableOption: function(key) {
    this.addObserver(key, this, this._optionDidChange);

    if (key in this) {
      this._optionDidChange(this, key);
    }

    this.on('willDestroyElement', this, function() {
      this.removeObserver(key, this, this._optionDidChange);
    });
  },

  _disableArrayObservers: function(content, callback) {
    content.removeArrayObserver(this);
    try {
      callback.call(this);
    } finally {
      content.addArrayObserver(this);
    }
  },

  _optionDidChange: function(sender, key) {
    this.$().sortable('option', key, this.get(key));
  }
});
