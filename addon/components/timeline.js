import Timeline from 'explorviz-frontend/components/visualization/page-setup/timeline/timeline';
import layout from 'explorviz-frontend/templates/components/visualization/page-setup/timeline/timeline'
import {inject as service} from '@ember/service';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Timeline.extend(AlertifyHandler,{
    layout,
    landscapeService: service(),
    chartClickHandler(evt) {
      this._super(...arguments);
      this.set('importLandscape',true);
      this.set('tutorialActivePoint',this.get('timelineChart').getElementAtEvent(evt)[0]);
    },
    actions:{
       submit(){
        if ( this.get('tutorialActivePoint')) {
        this.get('landscapeListener').set('pauseVisualizationReload',true);
        this.get('landscapeService').importLandscape(this.get('tutorialActivePoint')._chart.data.datasets[this.get('tutorialActivePoint')._datasetIndex].data[this.get('tutorialActivePoint')._index].x,this.get('landscapeName'));
        }
      }
    }
});
