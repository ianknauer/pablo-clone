import DS from 'ember-data';

export default DS.Model.extend({
  width: DS.attr(),
  height: DS.attr(),
  likes: DS.attr(),
  thumbUrl: DS.attr('string'),
  regularUrl: DS.attr('string'),
  postcard: DS.belongsTo(),
});
