import DS from 'ember-data';
import Landscape from "explorviz-frontend/models/landscape"
const { belongsTo, hasMany } = DS;

export default Landscape.extend({
  timestamp: DS.belongsTo('tutorialtimestamp',{inverse:'landscape'}),

});
