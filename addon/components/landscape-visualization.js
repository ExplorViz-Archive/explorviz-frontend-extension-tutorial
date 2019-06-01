import layout from '../templates/components/landscape-visualization';
import LandscapeRendering from 'explorviz-frontend/components/visualization/rendering/landscape-rendering'
import { inject as service } from '@ember/service';
export default LandscapeRendering.extend({
    layout,
    renderingService: service(),
});
