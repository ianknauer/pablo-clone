import Ember from 'ember';

export default Ember.Component.extend({
  isShowingPopup: false,
  colours: ['white', 'black', 'red', 'green', 'blue', 'orange', 'yellow', 'purple'],

  actions: {
    toggleModal: function() {
      this.toggleProperty('isShowingPopup');
    },
  },
  
  click() {
    this.toggleProperty('isShowingPopup');
  }
});
