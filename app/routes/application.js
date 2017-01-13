import Ember from 'ember';
import Unsplash from "npm:unsplash-js";

export default Ember.Route.extend({
  model() {
    
    const unsplash = new Unsplash({
      applicationId: "a2e6a431b8bcb3e0c43ee4027c8a4dfc23c81369a561a521e1513c85fdc7d9b9"
    });
    
    unsplash.photos.getRandomPhoto()
      .then(toJson)
      .then(json => {
        console.log(this);
      });
    }

});
