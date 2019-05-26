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
          this.get('store').queryRecord('tutoriallandscape',{ timestamp: tutorial.get('landscapeTimestamp') }).then((landscape)=>{
            if (this.get('landscape.id')!= landscape.get('id')){
              this.get('store').unloadRecord(this.get('landscape'));
            }else{
              return;
            }
          });
        }
        if(tutorial.get('landscapeTimestamp')!=""){
          this.importLandscape(tutorial.get('landscapeTimestamp'));
        }
    },
    importLandscape(landscapeTimestamp){
      this.get('store').queryRecord('tutoriallandscape', { timestamp: landscapeTimestamp }).then((tutlandscape) => {
        this.set('landscape',tutlandscape);
      }, (e) => {
            this.get('store').queryRecord('landscape', { timestamp: landscapeTimestamp }).then((landscape) => {
              if(!this.get('store').hasRecordForId('tutoriallandscape',landscape.get('id'))){
              var timestamprecord=this.get('store').createRecord("tutorialtimestamp",{
                id:landscape.get('timestamp.id'),
                timestamp:landscape.get('timestamp.timestamp'),
                totalRequests:landscape.get('timestamp.totalRequests'),
                name:"new timestamp",
              });
              var landscaperecord = this.get('store').createRecord("tutoriallandscape",{
                id:landscape.get('id'),
                systems:landscape.get('systems'),
                events:landscape.get('events'),
                totalApplicationCommunications:landscape.get('totalApplicationCommunications'),
                timestamp:timestamprecord
              });
              timestamprecord.save();
              landscaperecord.save();
              this.set('landscape',landscaperecord);
            }else{
              this.get('store').set('landscape',landscape);
            }
            });
      });
    }
})
