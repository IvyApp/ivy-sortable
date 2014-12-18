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
