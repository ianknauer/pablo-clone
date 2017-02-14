import Ember from 'ember';

export default Ember.Route.extend({
  
  //This is the logic that brings in all the different models (defined under the /models/ folder)
  //and makes the accessible through the controllers and components drawn in the main page. I used
  //The hash to get more than one set of unrelated models into the route.
  model(params) {
    return Ember.RSVP.hash({
      photos: this.store.query('photo', {per_page: 10, query: "nature"}),  
      postcard: this.store.createRecord('postcard'),
      header: this.store.createRecord('header'),
      body: this.store.createRecord('body'),
      caption: this.store.createRecord('caption'),
    });
  }
});
