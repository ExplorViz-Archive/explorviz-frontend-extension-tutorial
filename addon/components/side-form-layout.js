import Component from '@ember/component';
import layout from '../templates/components/side-form-layout';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';

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
    if(this.get('model.constructor.modelName')=="tutorial" || this.get('model.constructor.modelName')=="sequence"){
      return !this.get('landscapeService.landscape');
    }
    return false;
  }),
  liveMode: computed('landscapeService.livelandscapes','selectMode', function() {
    if(this.get('model.constructor.modelName')=="tutorial" || this.get('model.constructor.modelName')=="sequence"){
      return this.get('selectMode') && this.get('landscapeService.livelandscapes');
    }
    return false;
  }),
  init(){
    this._super(...arguments);
    this.get('landscapeService').updateLandscapeList(true);
    this.get('landscapeListener').initSSE();
    this.get('landscapeListener').set('pauseVisualizationReload',true);
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
