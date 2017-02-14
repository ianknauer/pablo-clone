import Ember from 'ember';

export default Ember.Controller.extend({
  classNames: ['full-screen'],
  queryParams: ['search'],
  actions: {
    // this changes the background image of the canvas to what was clicked in the sidebar.
    testAction(image) {
      let postcard = this.get('model.postcard');
      postcard.set('url', image);
    },
  }
});