import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
      photos: this.store.query('photo', {per_page: 10, query: "nature"}),  //query: "nature"}),
      postcard: this.store.createRecord('postcard'),
      header: this.store.createRecord('header'),
      body: this.store.createRecord('body'),
      caption: this.store.createRecord('caption'),
    });
  }
});
