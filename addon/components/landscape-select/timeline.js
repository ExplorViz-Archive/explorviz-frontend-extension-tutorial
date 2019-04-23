import Component from '@ember/component';
import layout from '../../templates/components/landscape-select/timeline';
import Timeline from 'explorviz-frontend/components/visualization/page-setup/timeline/timeline';
import {inject as service} from '@ember/service';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Timeline.extend(AlertifyHandler,{
    layout,
    landscapeService: service(),
    chartClickHandler(evt) {
       this._super(...arguments);
       var tutorialActivePoint = this.get('timelineChart').getElementAtEvent(evt)[0];
       this.get('landscapeListener').set('pauseVisualizationReload',true);
       this.get('landscapeListener').set("landscapeTimestamp",tutorialActivePoint._chart.data.datasets[tutorialActivePoint._datasetIndex].data[tutorialActivePoint._index].x);
       this.get('landscapeService').importLandscape(this.get('landscapeListener.landscapeTimestamp'));
       this.get('landscapeService').selectLandscape(this.get('landscapeListener.landscapeTimestamp'));
       //this.await.clearRender();
    }
});
