import Service from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { inject as service } from "@ember/service";
import LandscapeInteraction from '../components/landscape-interaction';
import ApplicationInteraction from '../components/application-interaction';
import { getOwner } from '@ember/application';

export default Service.extend(Evented, {
  mockBackend: true, // default value: true  

  debug: debugLogger(),

  store: service(),
  renderingService: service(),
  timestampRepository: service("repos/timestamp-repository"),

  landscape: null,
  selectLandscape: false,
  application: null,
  livelandscapes: false,
  landscapeList: null,

  landscapeinteraction: null,
  applicationinteraction: null,

  init() {
    this._super(...arguments);
    const landscapeInteraction = LandscapeInteraction.create(getOwner(this).ownerInjection());
    const applicationInteraction = ApplicationInteraction.create(getOwner(this).ownerInjection());
    this.set('landscapeinteraction', landscapeInteraction);
    this.set('applicationinteraction', applicationInteraction);
  },

  setInteractionModel(model) {
    this.set('landscapeinteraction.model', model);
    this.set('applicationinteraction.model', model);
  },

  updateLandscapeList(reload) {
    // update the list of available replay timestamps for tutorials
    this.get('timestampRepository').fetchReplayTimestamps();

    if (this.get('mockBackend')) {
      this.set('landscapeList', []);
      this.set('landscapeList', this.get('store').peekAll('tutoriallandscape'));
    } else {
      this.set('landscapeList', []);
      this.get('store').findAll('tutoriallandscape', { reload })
        .then(landscapes => {
          let landscapeList = landscapes.toArray();
          // sort by id
          landscapeList.sort((landscape1, landscape2) => parseInt(landscape1.id) < parseInt(landscape2.id) ? -1 : 1);
          this.set('landscapeList', landscapeList);
        });
    }
  },

  /**
   * Load replay landscape
   * @param {*} model 
   */
  loadLandscape(model) {
    if (this.get('landscape') !== null) {
      if (!this.get('mockBackend')) {
        this.get('store').queryRecord('tutoriallandscape', { timestamp: model.get('landscapeTimestamp') }).then((landscape) => {
          if (this.get('landscape.id') != landscape.get('id')) {
            this.get('store').unloadRecord(this.get('landscape'));
          } else {
            return;
          }
        });
      }
    }
    if (model.get('landscapeTimestamp') != undefined && model.get('landscapeTimestamp') != "") {
      if (model.get('landscapeTimestamp') != this.get('landscape.timestamp.timestamp')) {
        this.importLandscape(model.get('landscapeTimestamp'), "");
      }
    }

  },

  importLandscape(landscapeTimestamp, name) {
    if (this.get('mockBackend')) {
      this.get('store').queryRecord('landscape', { timestamp: landscapeTimestamp }).then((landscape) => {
        this.set('landscape', landscape);
        this.get('renderingService').reSetupScene();
      });
    } else {
      this.get('store').queryRecord('tutoriallandscape', { timestamp: landscapeTimestamp }).then((tutlandscape) => {
        this.set('landscape', tutlandscape);
        this.get('renderingService').reSetupScene();
      }, () => {
        this.get('store').queryRecord('landscape', { timestamp: landscapeTimestamp }).then((landscape) => {
          if (!this.get('store').hasRecordForId('tutoriallandscape', landscape.get('id'))) {
            if (name == "" || name == undefined) {
              name = "new landscape";
            }
            var timestamprecord = this.get('store').createRecord("tutorialtimestamp", {
              id: landscape.get('timestamp.id'),
              timestamp: landscape.get('timestamp.timestamp'),
              totalRequests: landscape.get('timestamp.totalRequests'),
              name: name,
            });
            var landscaperecord = this.get('store').createRecord("tutoriallandscape", {
              id: landscape.get('id'),
              systems: landscape.get('systems'),
              events: landscape.get('events'),
              totalApplicationCommunications: landscape.get('totalApplicationCommunications'),
              timestamp: timestamprecord
            });
            timestamprecord.save();
            landscaperecord.save();
            this.set('landscape', landscaperecord);
            this.get('renderingService').reSetupScene();
          } else {
            this.set('landscape', landscape);
            this.get('renderingService').reSetupScene();
          }
        });
      });
    }
  }

})
