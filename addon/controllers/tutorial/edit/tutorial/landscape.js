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
  renderingService: service("rendering-service"),
  landscapeRepo: service("repos/landscape-repository"),
  landscapeListener: service("landscape-listener"),
   init(){
     this.get('landscapeListener').initSSE();
     this.get('landscapeListener').pauseVisualizationReload=true;
   },

  actions:{
    saveLandscape(model,timestamp){
        this.get("model").set("landscapeTimestamp",timestamp);
        this.get("model").save();
        this.get("store").queryRecord('tutoriallandscape', {timestamp: timestamp}).then(() =>{
            model.set('landscapeTimestamp',timestamp);
            model.save().then(()=>{
              const message = "Landscape for Tutorial <b>" + tutorialData.title + "</b> was saved.";
              this.showAlertifyMessage(message);
            });
      },()=>{
        this.get("store").queryRecord('landscape', {timestamp: timestamp}).then((landscape) => {
          const tutorialLandscape = this.get("store").createRecord("tutoriallandscape",landscape);
          tutorialLandscape.save().then(() =>{
            const message = "Landscape for Tutorial <b>" + tutorialData.title + "</b> was imported and saved.";
            this.showAlertifyMessage(message);
          });
        });
      });
    },
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
