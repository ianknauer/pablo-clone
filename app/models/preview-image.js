import DS from 'ember-data';

export default DS.Model.extend({
  previewUrl: DS.attr('string'),
  largeUrl: DS.attr('string')
});
