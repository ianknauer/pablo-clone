import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string', {defaultValue: 'caption'}),
  top: DS.attr('number', {defaultValue: 150 }),
  left: DS.attr('number', {defaultValue:0 }),
  text: DS.attr('string', {defaultValue: 'your fantastic caption text \n -Ian'}),
  font: DS.attr('string', {defaultValue: 'Roboto' }),
  colour: DS.attr('string', {defaultValue: '#fff' }),
  weight: DS.attr('number', {defaultValue: 300 }),
  alignment: DS.attr('string', {defaultValue: 'center' }),
  size: DS.attr('number', {defaultValue: 16 }),
  italicize: DS.attr('string', {defaultValue: 'italic'}),
  visible: DS.attr('string', {defaultValue: 'true'}),
  width: DS.attr('number', {defaultValue: 480}),
});
