import Component from '@ember/component';
import layout from '../../../templates/components/landscape-select/navbar/toggle-live-landscape';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import {inject as service} from '@ember/service';

export default Component.extend(AlertifyHandler,{
  tagName:'li',
  landscapeListener: service("landscape-listener"),
  toggle:null,
  layout,
  actions:{
    toggleVisualizationReload() {
      this.set('toggle',!this.get('toggle'));
      const pauseReload = this.get('landscapeListener').pauseVisualizationReload;
      this.handleMessageForUser(pauseReload);
      this.get('landscapeListener').toggleVisualizationReload();
    }
  },
  handleMessageForUser(pauseReload) {
    if(!pauseReload){
      this.showAlertifyMessage("Visualization paused! Tutorial landscapes are shown.");
    }
    else {
      this.showAlertifyMessage("Visualization resumed! Live landscapes will be shown and can be selected.");
    }
  }
});
