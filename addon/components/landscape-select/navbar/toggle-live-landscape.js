import Component from '@ember/component';
import layout from '../../../templates/components/landscape-select/navbar/toggle-live-landscape';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import {inject as service} from '@ember/service';

export default Component.extend(AlertifyHandler,{
  layout,
  tagName:'li',
  landscapeListener: service(),
  landscapeService: service(),
  actions:{
    toggleVisualizationReload() {
      this.get('landscapeListener').toggleVisualizationReload();
      if(this.get('landscapeListener').pauseVisualizationReload){
        this.get('landscapeService').set('selected',null);
      }
      this.handleMessageForUser(this.get('landscapeListener').pauseVisualizationReload);
    }
  },
  handleMessageForUser(pauseReload) {
    if(pauseReload){
      this.showAlertifyMessage("Visualization paused! Tutorial landscapes are shown.");
    }
    else {
      this.showAlertifyMessage("Visualization resumed! Live landscapes will be shown and can be selected.");
    }
  }
});
