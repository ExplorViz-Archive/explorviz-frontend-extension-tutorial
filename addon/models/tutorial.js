import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  text: DS.attr('string'),
  landscape: DS.attr('string'),
  sequences: DS.hasMany('sequence'),
});
