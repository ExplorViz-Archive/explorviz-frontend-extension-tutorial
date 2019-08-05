import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({

  title: DS.attr('string'),
  landscapeTimestamp: DS.attr('string'),
  sequences: DS.hasMany('sequence', { async: false }),

  containsSequences: computed ('sequences', function () {
    return this.get('sequences.length') > 0;
  })

});