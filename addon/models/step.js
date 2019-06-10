import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  text: DS.attr('string'),
  targetId: DS.attr('string'),
  targetType: DS.attr('string'),
  actionType: DS.attr('string'),
});
