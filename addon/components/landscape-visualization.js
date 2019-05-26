 import layout from '../templates/components/landscape-visualization';
 import { getOwner } from '@ember/application';
//import layout from 'explorviz-frontend/templates/components/visualization/rendering/landscape-rendering'
//import LandscapeInteraction from '../components/landscape-interaction';
import LandscapeInteraction from 'explorviz-frontend/utils/landscape-rendering/interaction'
import LandscapeRendering from 'explorviz-frontend/components/visualization/rendering/landscape-rendering'
import { inject as service } from '@ember/service';
export default LandscapeRendering.extend({
    layout,
    renderingService: service(),
});
