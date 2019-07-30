import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  landscapeTimestamp: DS.attr('string'),
  sequences: DS.hasMany('sequence', { async: false }),
  containsSequences: function () {
    return this.get('sequences.length') > 0;
  }.property('sequences'),

});
