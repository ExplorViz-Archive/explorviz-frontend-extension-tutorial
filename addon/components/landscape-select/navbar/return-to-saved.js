import Component from '@ember/component';
import layout from '../../../templates/components/landscape-select/navbar/return-to-saved';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import {inject as service} from '@ember/service';

export default Component.extend(AlertifyHandler,{
  tagName:'li',
  landscapeListener: service("landscape-listener"),
  toggle:null,
  layout,
  actions:{
    returnToSaved() {
      this.set('toggle',false);
      this.get('landscapeListener').set('pauseVisualizationReload',true);
      this.handleMessageForUser();
    }
  },
  handleMessageForUser() {
      this.showAlertifyMessage("Visualization paused! Tutorial landscapes are shown.");
  }
});
