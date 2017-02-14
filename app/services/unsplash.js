import Ember from 'ember';

export default Ember.Service.extend({
  
  backgroundImage(url) {
    //I had to make the getting of the image from unsplash a promise as I need to wait for the image to load before i can add it to the 
    //html canvas component and modify it.
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
      //canvas elements don't play well with images loades from outside urls so you have to tell Fabric that it's coming from another domain.
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
    });
  }
});
