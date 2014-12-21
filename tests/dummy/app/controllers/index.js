import Ember from 'ember';

export default Ember.ArrayController.extend({
  model: Ember.A([
    Ember.Object.create({ title: 'The Phantom Menace' }),
    Ember.Object.create({ title: 'Attack of the Clones' }),
    Ember.Object.create({ title: 'Revenge of the Sith' }),
    Ember.Object.create({ title: 'A New Hope' }),
    Ember.Object.create({ title: 'The Empire Strikes Back' }),
    Ember.Object.create({ title: 'Return of the Jedi' }),
    Ember.Object.create({ title: 'The Force Awakens' })
  ])
});
