import Ember from 'ember';

export default Ember.CollectionView.extend(Ember.TargetActionSupport, {
  disabled: false,

  tagName: 'ul',

  arrayDidChangeAfterElementInserted: function() {
    Ember.run.scheduleOnce('afterRender', this, this._refreshSortable);
  },

  arrayWillChangeAfterElementInserted: function() {
  },

  destroySortable: Ember.on('willDestroyElement', function() {
    this._contentWillChangeAfterElementInserted();

    Ember.removeBeforeObserver(this, 'content', this, this._contentWillChangeAfterElementInserted);
    this.removeObserver('content', this, this._contentDidChangeAfterElementInserted);

    this.$().sortable('destroy');
  }),

  initSortable: Ember.on('didInsertElement', function() {
    var opts = {};

    Ember.EnumerableUtils.forEach(['start', 'stop'], function(callback) {
      opts[callback] = Ember.run.bind(this, callback);
    }, this);

    this.$().sortable(opts);

    Ember.EnumerableUtils.forEach([
      'axis', 'containment', 'cursor', 'cursorAt', 'delay', 'disabled',
      'distance', 'forceHelperSize', 'forcePlaceholderSize', 'grid', 'handle', 'helper',
      'opacity', 'placeholder', 'revert', 'scroll', 'scrollSensitivity',
      'scrollSpeed', 'tolerance', 'zIndex'
    ], this._bindSortableOption, this);

    Ember.addBeforeObserver(this, 'content', this, this._contentWillChangeAfterElementInserted);
    this.addObserver('content', this, this._contentDidChangeAfterElementInserted);

    this._contentDidChangeAfterElementInserted();
  }),

  move: function(oldIndex, newIndex) {
    var content = this.get('content');

    if (content) {
      var item = content.objectAt(oldIndex);

      content.removeAt(oldIndex);
      content.insertAt(newIndex, item);

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

  stop: function(event, ui) {
    var oldIndex = ui.item.data('oldIndex');
    var newIndex = ui.item.index();

    // Ember.CollectionView wants to control the DOM, so make sure jQuery UI
    // isn't moving elements around without it knowing. Calling cancel here
    // will revert the item to its prior position.
    this.$().sortable('cancel');

    this.move(oldIndex, newIndex);
  },

  targetObject: Ember.computed(function() {
    var parentView = this.get('_parentView');
    return parentView ? parentView.get('controller') : null;
  }).property('_parentView'),

  _bindSortableOption: function(key) {
    this.addObserver(key, this, this._optionDidChange);

    if (key in this) {
      this._optionDidChange(this, key);
    }

    this.on('willDestroyElement', this, function() {
      this.removeObserver(key, this, this._optionDidChange);
    });
  },

  _contentDidChangeAfterElementInserted: function() {
    var content = this.get('content');

    if (content) {
      content.addArrayObserver(this, {
        didChange: 'arrayDidChangeAfterElementInserted',
        willChange: 'arrayWillChangeAfterElementInserted'
      });
    }

    var len = content ? Ember.get(content, 'length') : 0;
    this.arrayDidChangeAfterElementInserted(content, 0, null, len);
  },

  _contentWillChangeAfterElementInserted: function() {
    var content = this.get('content');

    if (content) {
      content.removeArrayObserver(this, {
        didChange: 'arrayDidChangeAfterElementInserted',
        willChange: 'arrayWillChangeAfterElementInserted'
      });
    }

    var len = content ? Ember.get(content, 'length') : 0;
    this.arrayWillChangeAfterElementInserted(content, 0, len);
  },

  _optionDidChange: function(sender, key) {
    this.$().sortable('option', key, this.get(key));
  },

  _refreshSortable: function() {
    if (this.isDestroying) { return; }
    this.$().sortable('refresh');
  }
});
