import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  sequences:  hasMany('tutorialSequence', {
    inverse: 'parentTutorial'
  }),

});
