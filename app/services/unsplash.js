import Ember from 'ember';

export default Ember.Service.extend({
  
  backgroundImage(url) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      const img = new Image();
      img.onload = event => {
        Ember.run(() => {
          resolve(img);
        });
      };
      img.onerror = () => {
        Ember.run(() => reject());
      };
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
    });
  }
});
