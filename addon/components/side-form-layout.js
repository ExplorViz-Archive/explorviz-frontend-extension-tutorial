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
  currentUser: service(),


  showLandscape: computed('landscapeService.application', function() {
    return !this.get('landscapeService.application');
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
    //this.get('landscapeService').updateLandscapeList(true);
    this.get('landscapeListener').initSSE();
    this.get('landscapeListener').set('pauseVisualizationReload',true);
  },
  actions: {
    addNewTutorial(){
      let newTutorial = this.get('store').createRecord("tutorial",{
         title: "new tutorial"
       })
       this.set("newSequence",newTutorial)
     },
    addNewSequence(tutorial){
     let newSequence = this.get('store').createRecord("sequence",{
        title: "new sequence"
      })
      tutorial.get('sequences').push(newSequence);
      this.set("newSequence",newSequence)
    },
    addNewStep(sequence){
      let newStep = this.get('store').createRecord("tutorial",{
         title: "new tutorial"
       })
       sequence.get('steps').push(newSequence);
       this.set("newStep",newStep)
    },
    resetView() {
      this.get('renderingService').reSetupScene();
    },
    openLandscapeView() {
      this.set('landscapeService.application', null);
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
    this.get('landscapeListener').set('pauseVisualizationReload',false);
    this.get('additionalData').off('showWindow', this, this.onShowWindow);
  },
});
