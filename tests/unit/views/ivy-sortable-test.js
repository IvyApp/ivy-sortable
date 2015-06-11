import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

var people, containerView, view;

moduleFor('view:ivy-sortable', 'view:ivy-sortable', {
  setup: function() {
    people = Ember.A([
      { name: 'Tyrion' },
      { name: 'Cersei' }
    ]);

    view = this.subject({
      content: people,

      moved: 'moved',

      itemViewClass: Ember.View.extend({
        template: Ember.Handlebars.compile('{{view.content.name}}')
      })
    });

    containerView = Ember.ContainerView.create();

    Ember.run(function() {
      containerView.pushObject(view);
      containerView.appendTo('#ember-testing');
    });
  },

  teardown: function() {
    Ember.run(containerView, 'destroy');
  }
});

test('should render the template for each item in an array', function(assert) {
  var items = view.$('li.ui-sortable-handle');
  assert.equal(items.length, 2);
  assert.equal(items.text(), 'TyrionCersei');
});

test('should update the view if content is replaced', function(assert) {
  Ember.run(function() {
    view.set('content', Ember.A([
      { name: 'Joffrey' },
      { name: 'Sansa' }
    ]));
  });

  var items = view.$('li.ui-sortable-handle');
  assert.equal(items.length, 2);
  assert.equal(items.text(), 'JoffreySansa');
});

test('should update the view if an item is added', function(assert) {
  Ember.run(function() {
    people.pushObject({ name: 'Tywin' });
  });

  assert.equal(view.$().text(), 'TyrionCerseiTywin');
});

test('should update the view if an item is removed', function(assert) {
  Ember.run(function() {
    people.removeAt(0);
  });

  assert.equal(view.$().text(), 'Cersei');
});

test('should update the view if an item is replaced', function(assert) {
  Ember.run(function() {
    people.removeAt(0);
    people.insertAt(0, { name: 'Jaime' });
  });

  assert.equal(view.$().text(), 'JaimeCersei');
});

test('should not cause Morph errors if an item is dragged and then moved', function(assert) {
  view.$('li:eq(0)').simulate('drag', { dy: 22 });

  assert.equal(view.$().text(), 'CerseiTyrion');

  Ember.run(function() {
    var tyrion = people.objectAt(1);
    people.removeAt(1);
    people.insertAt(0, tyrion);
  });

  assert.equal(view.$().text(), 'TyrionCersei');
});

test('should update the view if an item is dragged', function(assert) {
  view.$('li:eq(0)').simulate('drag', { dy: 22 });

  assert.equal(view.$().text(), 'CerseiTyrion');
});

test('should update the content if an item is dragged', function(assert) {
  view.$('li:eq(0)').simulate('drag', { dy: 22 });

  assert.deepEqual(people.mapBy('name'), ['Cersei', 'Tyrion']);
});

test('should become disabled if the disabled attribute is true', function(assert) {
  Ember.run(function() { view.set('disabled', true); });
  view.$('li:eq(0)').simulate('drag', { dy: 22 });

  assert.equal(view.$().text(), 'TyrionCersei', 'setting disabled to true disables dragging');

  Ember.run(function() { view.set('disabled', false); });
  view.$('li:eq(0)').simulate('drag', { dy: 22 });

  assert.equal(view.$().text(), 'CerseiTyrion', 'setting disabled to false enables dragging');
});

test('should trigger moved action after successful drag', function(assert) {
  assert.expect(3);

  Ember.run(function() {
    containerView.set('controller', Ember.Object.create({
      moved: function(item, oldIndex, newIndex) {
        assert.strictEqual(item, people.objectAt(1));
        assert.equal(oldIndex, 0);
        assert.equal(newIndex, 1);
      }
    }));
  });

  view.$('li:eq(0)').simulate('drag', { dy: 22 });
});

test('should not refresh after destruction', function(assert) {
  assert.expect(1);

  Ember.run(function() {
    people.pushObject({ name: 'Arya' });
    containerView.destroy();
  });

  assert.ok(true, 'no error was thrown');
});

function optionTest(key, beforeValue, afterValue) {
  test('should update jQuery UI ' + key + ' option when ' + key + ' property changes', function(assert) {
    assert.equal(view.$().sortable('option', key), beforeValue,
                 'precond - initial value of ' + key + ' option is correct');

    Ember.run(function() {
      view.set(key, afterValue);
    });

    assert.equal(view.$().sortable('option', key), afterValue,
                 key + ' option is updated after ' + key + ' property is changed');
  });
}

optionTest('axis', false, 'x');
optionTest('containment', false, 'parent');
optionTest('cursor', 'auto', 'move');
optionTest('cursorAt', false, { left: 5 });
optionTest('delay', 0, 150);
optionTest('disabled', false, true);
optionTest('distance', 1, 5);
optionTest('forceHelperSize', false, true);
optionTest('forcePlaceholderSize', false, true);
optionTest('grid', false, [20, 10]);
optionTest('helper', 'original', 'clone');
optionTest('opacity', false, 0.5);
optionTest('placeholder', false, 'sortable-placeholder');
optionTest('revert', false, true);
optionTest('scroll', true, false);
optionTest('scrollSensitivity', 20, 10);
optionTest('scrollSpeed', 20, 40);
optionTest('tolerance', 'intersect', 'pointer');
optionTest('zIndex', 1000, 9999);
