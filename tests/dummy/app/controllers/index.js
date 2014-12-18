import Ember from 'ember';

export default Ember.ArrayController.extend({
  model: Ember.A([
    Ember.Object.create({ name: 'Tyrion' }),
    Ember.Object.create({ name: 'Cersei' }),
    Ember.Object.create({ name: 'Jaime' })
  ]),

  names: Ember.computed(function() {
    return this.mapBy('name').join(', ');
  }).property('@each.name')
});
