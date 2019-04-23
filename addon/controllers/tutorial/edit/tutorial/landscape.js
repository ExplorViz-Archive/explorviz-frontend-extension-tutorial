import Controller from '@ember/controller';
import LandscapeInteraction from
    'explorviz-frontend/utils/landscape-rendering/interaction';
import { inject as service } from "@ember/service";
import { getOwner } from '@ember/application';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';


export default Controller.extend(AlertifyHandler,{
  tagName: '',
  store: service(),
  targetType: null,
  targetId:null,
  landscapeService: service(),
  renderingService: service(),
  landscapeRepo: service("repos/landscape-repository"),
  landscapeListener: service(),
  additionalData: service(),

   init(){
     this.get('landscapeListener').initSSE();
     this.get('landscapeListener').set('pauseVisualizationReload',true);
   },
    didReceiveAttrs() {
      this._super(...arguments);
      this.get('additionalData').openAdditionalData();
    },

     actions:{
      openDataSelection(){
        this.get('additionalData').addComponent("visualization/page-setup/sidebar/side-form");
        this.get('additionalData').openAdditionalData();
      },
      resetView() {
        this.get('renderingService').reSetupScene();
      },
      openLandscapeView(){
        this.set('landscapeRepo.latestApplication', null);
        this.set('landscapeRepo.replayApplication', null);
      },

      toggleTimeline() {
        this.get('renderingService').toggleTimeline();
      }
  }
});
