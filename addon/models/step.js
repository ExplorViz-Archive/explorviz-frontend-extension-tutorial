import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  text: DS.attr('string'),
  sequence: DS.belongsTo('sequence',{inverse:"steps"}),
  targetId: DS.attr('string'),
  targetType: DS.attr('string')
});
