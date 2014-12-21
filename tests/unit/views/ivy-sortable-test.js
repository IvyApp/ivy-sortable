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

test('should render the template for each item in an array', function() {
  equal(view.$().text(), 'TyrionCersei');
});

test('should update the view if an item is added', function() {
  Ember.run(function() {
    people.pushObject({ name: 'Tywin' });
  });

  equal(view.$().text(), 'TyrionCerseiTywin');
});

test('should update the view if an item is removed', function() {
  Ember.run(function() {
    people.removeAt(0);
  });

  equal(view.$().text(), 'Cersei');
});

test('should update the view if an item is replaced', function() {
  Ember.run(function() {
    people.removeAt(0);
    people.insertAt(0, { name: 'Jaime' });
  });

  equal(view.$().text(), 'JaimeCersei');
});

test('should update the view if an item is dragged', function() {
  view.$('li:eq(0)').simulate('drag', { dy: 22 });

  equal(view.$().text(), 'CerseiTyrion');
});

test('should update the content if an item is dragged', function() {
  view.$('li:eq(0)').simulate('drag', { dy: 22 });

  deepEqual(people.mapBy('name'), ['Cersei', 'Tyrion']);
});

test('should become disabled if the disabled attribute is true', function() {
  Ember.run(function() { view.set('disabled', true); });
  view.$('li:eq(0)').simulate('drag', { dy: 22 });

  equal(view.$().text(), 'TyrionCersei', 'setting disabled to true disables dragging');

  Ember.run(function() { view.set('disabled', false); });
  view.$('li:eq(0)').simulate('drag', { dy: 22 });

  equal(view.$().text(), 'CerseiTyrion', 'setting disabled to false enables dragging');
});

test('should trigger moved action after successful drag', function() {
  expect(3);

  Ember.run(function() {
    containerView.set('controller', Ember.Object.create({
      moved: function(item, oldIndex, newIndex) {
        strictEqual(item, people.objectAt(1));
        equal(oldIndex, 0);
        equal(newIndex, 1);
      }
    }));
  });

  view.$('li:eq(0)').simulate('drag', { dy: 22 });
});

function optionTest(key, beforeValue, afterValue) {
  test('should update jQuery UI ' + key + ' option when ' + key + ' property changes', function() {
    equal(view.$().sortable('option', key), beforeValue,
          'precond - initial value of ' + key + ' option is correct');

    Ember.run(function() {
      view.set(key, afterValue);
    });

    equal(view.$().sortable('option', key), afterValue,
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
