import DS from 'ember-data';
import Landscape from "explorviz-frontend/models/landscape"

export default Landscape.extend({
  timestamp: DS.belongsTo('tutorialtimestamp'),
});
