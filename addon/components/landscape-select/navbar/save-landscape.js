import Component from '@ember/component';
import layout from '../../../templates/components/landscape-select/navbar/save-landscape';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import {inject as service} from '@ember/service';

export default Component.extend(AlertifyHandler,{
  tagName:'li',
  store: service(),
  landscapeListener: service("landscape-listener"),
  toggle:null,
  layout,
  actions:{
    saveLandscape(){
    },
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
