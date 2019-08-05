import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({

  title: DS.attr('string'),
  text: DS.attr('string'),
  landscapeTimestamp: DS.attr('string'),
  steps: DS.hasMany('step', { inverse: 'parent', async: false }),
  parent: DS.belongsTo('tutorial', { inverse: 'sequences' }),

  containsSteps: computed('steps', function () {
    return this.get('steps.length') > 0;
  })

});
