import DS from 'ember-data';

//model definition for the photos in the image-preview component. I use the "thumbURL" 
//for the preview url and the regular URL as the source image for the component.

export default DS.Model.extend({
  width: DS.attr(),
  height: DS.attr(),
  likes: DS.attr(),
  thumbUrl: DS.attr('string'),
  regularUrl: DS.attr('string'),
  postcard: DS.belongsTo(),
});
