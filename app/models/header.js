import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string', {defaultValue: 'header'}),
  top: DS.attr('number', {defaultValue: 35 }),
  left: DS.attr('number', {defaultValue:0 }),
  text: DS.attr('string', {defaultValue: 'Your awesome header text'}),
  font: DS.attr('string', {defaultValue: 'Roboto' }),
  colour: DS.attr('string', {defaultValue: '#fff' }),
  weight: DS.attr('number', {defaultValue: 700 }),
  alignment: DS.attr('string', {defaultValue: 'center' }),
  size: DS.attr('number', {defaultValue: 32 }),
  italicize: DS.attr('string', {defaultValue: ''}),
  visible: DS.attr('string', {defaultValue: 'true'}),
  width: DS.attr('number', {defaultValue: 480}),
});
