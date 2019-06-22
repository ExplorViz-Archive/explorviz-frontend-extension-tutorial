import Timestamp from "explorviz-frontend/models/timestamp"
import DS from 'ember-data';

export default Timestamp.extend({
    name: DS.attr('String'),
    timestamp: DS.attr('String')
});
