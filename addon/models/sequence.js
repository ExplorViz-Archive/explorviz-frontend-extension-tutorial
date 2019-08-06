import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({

  title: DS.attr('string'),
  text: DS.attr('string'),
  landscapeTimestamp: DS.attr('string'),
  steps: DS.hasMany('step', { async: false }),

  containsSteps: computed('steps', function () {
    return this.get('steps.length') > 0;
  })

});
