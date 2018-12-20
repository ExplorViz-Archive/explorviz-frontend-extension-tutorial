import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  text:  DS.attr('string'),

  action: DS.attr('string'),
  target: DS.attr('string'),

  landscape: belongsTo('landscape'),
  parentTutorial: belongsTo('tutorial'),
  steps:  hasMany('tutorialStep', {
    inverse: 'parentSequence'
  }),
});
