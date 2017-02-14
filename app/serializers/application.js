import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  
  //Ember Data is meant to work with dash based urls not Camel Case as is provided by Unsplash
  //So I needed to convert the responses.
  
  keyForAttribute(key) {
    return Ember.String.decamelize(key);
  }
  
});
