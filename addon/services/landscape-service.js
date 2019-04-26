import Service from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { inject as service } from "@ember/service";

export default Service.extend(Evented, {
    debug: debugLogger(),
    store: service(),
    landscape: null,
    livelandscapes: false,
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
     loadTutorialLandscape(tutorial) {
        if (this.get('landscape') !== null) {
          if (this.get('landscape.timestamp.timestamp')!=tutorial.get('landscapeTimestamp') ){
            this.get('store').unloadRecord(this.get('landscape'));
          }else{
            return;
          }
        }
    },
    importLandscape(landscapeTimestamp){
      debugger;
      this.get('store').queryRecord('tutoriallandscape', { timestamp: landscapeTimestamp }).then((tutlandscape) => {
        this.set('landscape',tutlandscape);
      }, (e) => {
          this.get('store').queryRecord('landscape', { timestamp: landscapeTimestamp }).then((landscape) => {
            var timestamp=this.get('store').createRecord("tutorialtimestamp",{
              id:landscape.get('timestamp').get('id'),
              timestamp:landscape.get('timestamp').get('timestamp'),
              totalRequests:landscape.get('timestamp').get('totalRequests'),
              name:"new timestamp"
            });
              var tutoriallandscape = this.get('store').createRecord("tutoriallandscape",{
                id: landscape.get('id'),
                events: landscape.get('events'),
                systems: landscape.get('systems'),
                totalApplicationCommunications: landscape.get('totalApplicationCommunications'),
                timestamp:timestamp
               });
              tutoriallandscape.save();
              this.set('landscape',tutoriallandscape);
            },(e)=>{});
      });
    }
})
