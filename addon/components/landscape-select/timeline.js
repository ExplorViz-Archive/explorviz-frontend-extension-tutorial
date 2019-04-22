import Component from '@ember/component';
import layout from '../../templates/components/landscape-select/timeline';
import Timeline from 'explorviz-frontend/components/visualization/page-setup/timeline/timeline';

export default Timeline.extend({
    layout,
    chartClickHandler(evt) {
       this._super(...arguments);
       var tutorialActivePoint = this.get('timelineChart').getElementAtEvent(evt)[0];
       this.get('landscapeListener').set('pauseVisualizationReload',true);
       this.get('landscapeListener').set("landscapeTimestamp",tutorialActivePoint._chart.data.datasets[tutorialActivePoint._datasetIndex].data[tutorialActivePoint._index].x);
       this.get('landscapeService').selectLandscape(this.get('landscapeListener').get("landscapeTimestamp"));
       //this.await.clearRender();
    }
});
