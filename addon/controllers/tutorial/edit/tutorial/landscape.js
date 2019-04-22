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
  renderingService: service("rendering-service"),
  landscapeRepo: service("repos/landscape-repository"),
  landscapeListener: service("landscape-listener"),
   init(){
     this.get('landscapeListener').initSSE();
     this.get('landscapeListener').set('pauseVisualizationReload',true);
   },
  actions:{
      resetView() {
        this.get('renderingService').reSetupScene();
      },

      openLandscapeView() {
        this.set('landscapeRepo.latestApplication', null);
        this.set('landscapeRepo.replayApplication', null);
      },

      toggleTimeline() {
        this.get('renderingService').toggleTimeline();
      }
  }
});
