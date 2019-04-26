import Timeline from 'explorviz-frontend/components/visualization/page-setup/timeline/timeline';
import layout from 'explorviz-frontend/templates/components/visualization/page-setup/timeline/timeline'
import {inject as service} from '@ember/service';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Timeline.extend(AlertifyHandler,{
    layout,
    landscapeService: service(),
    chartClickHandler(evt) {
      this._super(...arguments);
       var tutorialActivePoint = this.get('timelineChart').getElementAtEvent(evt)[0];
       if (tutorialActivePoint) {
        this.get('landscapeListener').set('pauseVisualizationReload',true);
        this.get('landscapeService').importLandscape(tutorialActivePoint._chart.data.datasets[tutorialActivePoint._datasetIndex].data[tutorialActivePoint._index].x);
       }
    }
});
