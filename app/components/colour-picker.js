import Ember from 'ember';

export default Ember.Component.extend({
  //colour picker component with toggling and default colours. I ran into some issues where it isn't
  //redrawing after the colour change, only when something else changes. There seems to be some issues 
  //between the CSS framework and the modal component I used.
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
