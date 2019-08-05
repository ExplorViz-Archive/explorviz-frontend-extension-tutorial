import layout from '../templates/components/landscape-visualization';
import LandscapeRendering from 'explorviz-frontend/components/visualization/rendering/landscape-rendering'
import { inject as service } from '@ember/service';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default LandscapeRendering.extend(AlertifyHandler, {
  layout,
  landscapeService: service(),
  tutorialService: service(),
  interactionModel: null,
  setSelectTarget(value) {
    this.set('interaction,selectTarget', value);
  },
  initInteraction() {
    this._super(...arguments);
    //const self = this;

    if (this.get('runmode')) {
      this.set('interaction.model', this.get('tutorialService.activeStep'));
    } else {
      this.set('interaction.model', this.get('interactionModel'));
    }
    this.set('interaction.completed', this.get('completed'));
    this.set('interaction.runmode', this.get('runmode'));

    this.get('interaction').on('showApplication', function (emberModel) {
      this.set('landscapeService.application', emberModel);
      // this.trigger('doubleClick', emberModel);
    });

    this.get('interaction').on('singleClick', this.clickListenerSingle);
    this.get('interaction').on('doubleClick', this.clickListenerDouble);
  },

  cleanup() {
    this._super(...arguments);
    this.get('interaction').off('singleClick', this, this.clickListenerSingle);
    this.get('interaction').off('doubleClick', this, this.clickListenerDouble);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.get('interaction').off('singleClick', this, this.clickListenerSingle);
    this.get('interaction').off('doubleClick', this, this.clickListenerDouble);
  },

  clickListenerSingle(emberModel) {
    if (emberModel != undefined) {
      if (this.get('selectTarget')) {
        this.set("model.targetType", emberModel.get('constructor.modelName'));
        this.set("model.targetId", emberModel.get("id"));
        this.set("model.actionType", "singleClick");
        this.set('selectTarget', false);
        this.showAlertifyMessage(`Target selected 'single click' on '` + emberModel.get('constructor.modelName') + "' with name '" + emberModel.get('name') + "'");
      } else {
        if (this.get("model.targetType") == emberModel.get('constructor.modelName') && this.get("model.targetId") == emberModel.get("id") && this.get('model.actionType') == "singleClick") {
          if (this.get("runmode")) {
            this.completed(this.get('model'));
          }
        }
      }
    }
  },

  clickListenerDouble(emberModel) {
    if (emberModel != undefined) {
      if (this.get('selectTarget')) {
        this.set("model.targetType", emberModel.get('constructor.modelName'));
        this.set("model.targetId", emberModel.get("id"));
        this.set("model.actionType", "doubleClick");
        this.set('selectTarget', false);
        this.showAlertifyMessage(`Target selected 'double click' on '` + emberModel.get('constructor.modelName') + "'");
      } else {
        if (this.get("model.targetType") == emberModel.get('constructor.modelName') && this.get("model.targetId") == emberModel.get("id") && this.get('model.actionType') == "doubleClick") {
          if (this.get("runmode")) {
            this.completed(this.get('model'));
          }
        }
      }
    }
  },

  getLandscape() {
    if (this.get('landscapeService.livelandscapes')) {
      return this.get('landscapeRepo.latestLandscape');
    } else {
      return this.get('landscapeService.landscape');
    }
  },

  completed(laststep) {
    if (this.get('runmode')) {
      var step = this.get('tutorialService').getNextStep(laststep);
      if (step) {
        this.get('tutorialService').getSequence(step).then((sequence) => {
          if (sequence.get('landscapeTimestamp') != undefined) {
            this.get('landscapeService').loadLandscape(sequence);
          } else {
            this.get('tutorialService').getTutorial(sequence).then((tutorial) => {
              if (tutorial.get('landscapeTimestamp') != undefined) {
                this.get('landscapeService').loadLandscape(tutorial);
              } else {
                this.showAlertifyMessage("no landscape defined");
              }
            });
          }
        });
        this.get('tutorialService').set('activeStep', step);
        this.set('model', step);
      } else {
        this.showAlertifyMessage(`Last step completed.`);
      }
    }
  }
});
