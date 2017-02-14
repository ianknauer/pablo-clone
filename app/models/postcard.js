import DS from 'ember-data';

export default DS.Model.extend({
  width: DS.attr(),
  height: DS.attr(),
  filter: DS.attr('string', {defaultValue: 'Light Blur'}),
  headerText: DS.attr('string', {defaultValue: 'Your awesome header text'}),
  bodyText: DS.attr('string'),
  caption: DS.attr('string'),
  photos: DS.hasMany(),
  sizing: DS.attr('string', {defaultValue: 'instagram'}),
  url: DS.attr('string', {defaultValue: "http://images.unsplash.com/photo-1413752567787-baa02dde3c65?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&h=725"}),
});
