import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  text: DS.attr('string'),
  tutorial: DS.belongsTo('tutorial',{inverse:"sequences",async:false}),
  steps: DS.hasMany('step',{inverse:"sequence",async:false}),
});
