import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    return this.store.query('photo', {per_page: 20, query: "nature"});
  }
});
