import DS from 'ember-data';
import Landscape from "explorviz-frontend/model/landscape"

export default Landscape.extend({
  timestamp: DS.belongsTo('tutorialtimestamp'),
});
