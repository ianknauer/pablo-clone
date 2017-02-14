import DS from 'ember-data';

//I broke the different elements on the canvas down to individual models to allow for easier definition.
//Caption and Header both include the same fields but have different default values.

export default DS.Model.extend({
  name: DS.attr('string', {defaultValue: 'body'}),
  top: DS.attr('number', {defaultValue: 100 }),
  left: DS.attr('number', {defaultValue:0 }),
  text: DS.attr('string', {defaultValue: 'Click here twice to edit text'}),
  font: DS.attr('string', {defaultValue: 'Roboto' }),
  colour: DS.attr('string', {defaultValue: '#fff' }),
  weight: DS.attr('number', {defaultValue: 300 }),
  alignment: DS.attr('string', {defaultValue: 'center' }),
  size: DS.attr('number', {defaultValue: 24 }),
  italicize: DS.attr('string', {defaultValue: ''}),
  visible: DS.attr('string', {defaultValue: 'true'}),
  width: DS.attr('number', {defaultValue: 480}),
});
