import Service from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { inject as service } from "@ember/service";

export default Service.extend(Evented, {
    debug: debugLogger(),
    store: service(),
    landscape: null,
    persisted: null,
    selected: null,
    landscapeList: null,
    updateLandscapeList(reload) {
      this.set('landscapeList', []);
      this.get('store').findAll('tutoriallandscape', { reload })
        .then(landscapes => {
          let landscapeList = landscapes.toArray();
          // sort by id
          landscapeList.sort((landscape1, landscape2) => parseInt(landscape1.id) < parseInt(landscape2.id) ? -1 : 1);
          this.set('landscapeList', landscapeList);
        });
    },
    selectLandscape(landscapeTimestamp){
      this.get('store').queryRecord('tutoriallandscape', { timestamp: landscapeTimestamp}).then((landscape) => {
        this.set('selected',landscape);
        this.set('persisted',true);
      },()=>{
        landscape = this.get('store').queryRecord('landscape', { timestamp: tutorial.landscapeTimestamp }).then((landscape) => {
          this.set('selected',landscape);
          this.set('persisted',false);
      });
    })},
    loadTutorialLandscape(tutorial) {
        if (this.get('landscape') !== null) {
          if (this.get('landscape').get('timestamp').get('timestamp')!= tutorial.landscapeTimestamp ){
            this.get('store').unloadRecord(this.get('landscape'));
          }else{
            return;
          }
        }
        this.importTutorialLandscape(tutorial);
    },
    importTutorialLandscape(tutorial){
      var record = this.get('store').queryRecord('tutoriallandscape', { timestamp: tutorial.landscapeTimestamp }).then((landscape) => {
        this.set('landscape',landscape);
        this.set('persisted',true);
      }, (e) => {
          var landscape = this.get('store').queryRecord('landscape', { timestamp: tutorial.landscapeTimestamp }).then((landscape) => {
            var tutorialtimestamp = this.get('store').createRecord("tutorialtimestamp",
            {
              id:landscape.get('timestamp').get('id'),
              timestamp:landscape.get('timestamp').get('timestamp'),
              totalRequests:landscape.get('timestamp').get('totalRequests'),
              name:"unnamed timestamp",
            });
            tutorialtimestamp.save().then(()=>{
              var tutoriallandscape = this.get('store').createRecord("tutoriallandscape",
              {
                id: landscape.get('id'),
                events: landscape.get('events'),
                systems: landscape.get('systems'),
                totalApplicationCommunications: landscape.get('totalApplicationCommunications'),
                timestamp: tutorialtimestamp ,
              });
              tutoriallandscape.save();
              this.set('persisted',true);
              this.set('landscape',tutoriallandscape);
            });
          });
      });
    }
})
