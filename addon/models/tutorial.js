import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  text: DS.attr('string'),
  targetId: DS.attr('string'),
  targetType: DS.attr('string'),
  landscapeTimestamp: DS.attr('string'),
  sequences: DS.hasMany('sequence',{inverse:"tutorial"}),
  landscape: Ember.computed(function() {
        return DS.PromiseObject.create({
        promise: this.get('store').queryRecord('landscape', {timestamp: this.landscapeTimestamp}).then(landscape => {
            return landscape;
          })
        });
    }),
});
