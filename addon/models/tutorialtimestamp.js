import Timestamp from "explorviz-frontend/models/timestamp"
import DS from 'ember-data';

export default Timestamp.extend({
    landscape: DS.belongsTo('tutoriallandscape'),
    name: DS.attr('String')
});
