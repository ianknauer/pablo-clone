import Ember from 'ember';

export default Ember.Controller.extend({
  classNames: ['full-screen'],
  queryParams: ['search'],
  actions: {
    testAction(image) {
      let postcard = this.get('model.postcard');
      postcard.set('url', image);
    },
  }
});