import Component from '@ember/component';
import layout from '../templates/components/side-form-layout';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {
  layout,
  tagName: "",

  store: service(),
  tutorialService: service(),
  landscapeService: service(),
  renderingService: service(),
  landscapeRepo: service("repos/landscape-repository"),
  timestampRepo: service("repos/timestamp-repository"),
  reloadHandler: service(),
  landscapeListener: service(),
  currentUser: service(),

  showLandscape: computed('landscapeService.application', function () {
    return !this.get('landscapeService.application');
  }),

  selectMode: computed('landscapeService.selectLandscape', function () {
    if (this.get('model.constructor.modelName') == "tutorial" || this.get('model.constructor.modelName') == "sequence") {
      return this.get('landscapeService.selectLandscape');
    }
    return false;
  }),

  liveMode: computed('landscapeService.livelandscapes', 'selectMode', function () {
    if (this.get('model.constructor.modelName') == "tutorial" || this.get('model.constructor.modelName') == "sequence") {
      return this.get('selectMode') && this.get('landscapeService.livelandscapes');
    }
    return false;
  }),

  actions: {

    resetView() {
      this.get('renderingService').reSetupScene();
    },

    openLandscapeView() {
      this.set('landscapeService.application', null);
    },

    toggleTimeline() {
      this.get('renderingService').toggleTimeline();
    },

    showLiveLandscapes() {
      this.set("landscapeService.livelandscapes", true);
      this.get('landscapeListener').set('pauseVisualizationReload', false);
    },

    hideLiveLandscapes() {
      this.set('landscapeService.livelandscapes', false);
      this.get('landscapeListener').set('pauseVisualizationReload', true);
    },

    toggleSelectTarget(interaction, model) {
      interaction.set('model', model);
      interaction.set('selectTarget', !interaction.get('selectTarget'));
    },

    timelineClicked(timestampInMillisecondsArray) {
      this.get('reloadHandler').loadReplayLandscapeByTimestamp(timestampInMillisecondsArray[0]);

      this.get('landscapeListener').set('pauseVisualizationReload', true);
      this.get('landscapeService').importLandscape(timestampInMillisecondsArray[0], this.get('landscapeName'));
      this.set('model.landscapeTimestamp', timestampInMillisecondsArray[0]);
      this.get('landscapeService').set('livelandscapes', false);

      if (this.get('landscapeService.mockBackend')) {
        this.get('landscapeService').set('selectLandscape', false);
        this.showAlertifyMessage("Mock landscape is active. Saved landscapes cannot be selected.");
        this.showAlertifyMessage("Please click 'Save it' to persist the selected Landscape.");
      }
    }
  },

  init() {
    this._super(...arguments);
    this.get('landscapeService').updateLandscapeList(true);
    this.get('landscapeListener').initSSE();
    this.get('landscapeListener').set('pauseVisualizationReload', true);
  },
  showTimeline() {
    this.set('renderingService.showTimeline', true);
  },

  hideVersionbar() {
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
