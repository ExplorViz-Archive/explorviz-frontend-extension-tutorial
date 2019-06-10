import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  text: DS.attr('string'),
  landscapeTimestamp: DS.attr('string'),
  steps: DS.hasMany('step',{async:false}),
});
