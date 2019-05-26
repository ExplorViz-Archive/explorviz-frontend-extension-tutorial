import Component from '@ember/component';
import layout from '../templates/components/side-form-layout';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';
import LandscapeInteraction from 'explorviz-frontend/utils/landscape-rendering/interaction'
import { getOwner } from '@ember/application';

export default Component.extend({
  layout,
  store: service(),
  tutorialService: service(),
  landscapeService: service(),
  renderingService: service(),
  landscapeRepo: service("repos/landscape-repository"),
  landscapeListener: service(),
  showLandscape: computed('landscapeRepo.latestApplication', function() {
    return !this.get('landscapeRepo.latestApplication');
  }),
  selectMode: computed('landscapeService.landscape',function(){
    if(this.get('model.constructor.modelName')=="tutorial"){
      return !this.get('landscapeService.landscape');
    }
    return false;
  }),
  liveMode: computed('landscapeService.livelandscapes','selectMode', function() {
    if(this.get('model.constructor.modelName')=="tutorial"){
      return this.get('selectMode') && this.get('landscapeService.livelandscapes');
    }
    return false;
  }),
  completeStep(laststep){
    var step = this.get('tutorialService').getNextStep(laststep);
    console.log(step);
    this.set('model',step);
  },
  init(){
    this._super(...arguments);
    this.get('landscapeService').updateLandscapeList(true);
    this.get('landscapeListener').initSSE();
    this.get('landscapeListener').set('pauseVisualizationReload',true);


    const landscapeInteraction = LandscapeInteraction.create(getOwner(this).ownerInjection());
    if(this.get('runmode')){
      var step = this.get('tutorialService').getNextStep();
      this.set('activeStep',step);
      landscapeInteraction.set('model',step);
      landscapeInteraction.set('runMode',true);
      landscapeInteraction.set('tutorialService',this.get('tutorialService'));
      landscapeInteraction.set('completed',this.completeStep);
    }
    this.set('interaction', landscapeInteraction);
    this.get('interaction').on('singleClick', function(emberModel) {
      if(emberModel!=undefined){
          if(this.get('selectTarget')){
            this.set("model.targetType",emberModel.constructor.modelName);
            this.set("model.targetId",emberModel.get("id"));
            this.set("model.actionType","singleClick");
            this.set('selectTarget',false);
          }else{
            if(this.get("model.targetType")==emberModel.get('constructor.modelName') && this.get("model.targetId")==emberModel.get("id")&& this.get('model.actionType')=="singleClick"){
              console.log("Right action!");
              if(this.get("runMode")){
                this.completed(this.get('model'));
              }
            }else{
              console.log("Wrong Action: Single Click: "+emberModel.get("id")+" "+emberModel.get('constructor.modelName'));
              console.log("Expected: "+this.get("model.targetId")+" "+this.get("model.targetType")+" "+this.get("model.actionType"));
            }
          }
      }
    });
    this.get('interaction').on('doubleClick', function(emberModel) {
      if(emberModel!=undefined){
          if(this.get('selectTarget')){
            this.set("model.targetType",emberModel.constructor.modelName);
            this.set("model.targetId",emberModel.get("id"));
            this.set("model.actionType","doubleClick");
            this.set('selectTarget',false);
          }else{
            if(this.get("model.targetType")==emberModel.get('constructor.modelName') && this.get("model.targetId")==emberModel.get("id") && this.get('model.actionType')=="doubleClick"){
              console.log("Right action!");
            }else{
              console.log("Wrong Action DoubleClick:"+emberModel.get("id")+" "+emberModel.get('constructor.modelName'));
            }
          }
      }
    });
},
  actions: {
    resetView() {
      this.get('renderingService').reSetupScene();
    },
    openLandscapeView() {
      this.set('landscapeRepo.latestApplication', null);
      this.set('landscapeRepo.replayApplication', null);
    },
    toggleTimeline() {
      this.get('renderingService').toggleTimeline();
    },
    showLiveLandscapes(){
      this.set("landscapeService.livelandscapes",true);
      this.get('landscapeListener').set('pauseVisualizationReload',false);
    },
    hideLiveLandscapes(){
      this.set('landscapeService.livelandscapes',false);
      this.get('landscapeListener').set('pauseVisualizationReload',true);
    },
    toggleSelectTarget(interaction,model){
      interaction.set('model',model);
      interaction.set('selectTarget',!interaction.get('selectTarget'));
    }
  },
  showTimeline() {
    this.set('renderingService.showTimeline', true);
  },

  hideVersionbar(){
    this.set('renderingService.showVersionbar', false);
  },

  initRendering() {
    this.get('landscapeListener').initSSE();
    this.get('additionalData').on('showWindow', this, this.onShowWindow);
  },

  onShowWindow() {
    this.get('renderingService').resizeCanvas();
  },

  // @Override
  cleanup() {
    this._super(...arguments);
    this.get('additionalData').off('showWindow', this, this.onShowWindow);
  },
});
;
