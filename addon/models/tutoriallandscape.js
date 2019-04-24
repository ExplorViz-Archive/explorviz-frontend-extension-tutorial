import DS from 'ember-data';
import Landscape from "explorviz-frontend/models/landscape"
const { belongsTo, hasMany } = DS;

export default Landscape.extend({
  timestamp: DS.belongsTo('tutorialtimestamp'),
  events: hasMany('event', {
    inverse: null,
    async: false
  }),

  systems: hasMany('system', {
    inverse: 'parent',
     async: false
  }),

  // list of applicationCommunication for rendering purposes
  totalApplicationCommunications: hasMany('applicationcommunication', {
    inverse: null,
    async: false
  }),
});
