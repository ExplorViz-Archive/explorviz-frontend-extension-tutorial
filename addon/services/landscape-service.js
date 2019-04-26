import Service from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { inject as service } from "@ember/service";

export default Service.extend(Evented, {
    debug: debugLogger(),
    store: service(),
    timestamp: null,
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
        if (this.get('timestamp.landscape') !== null) {
          this.get('store').queryRecord('tutoriallandscape',{ timestamp: tutorial.get('landscapeTimestamp') }).then((landscape)=>{
            if (this.get('timestamp.landscape.id')!= landscape.get('id')){
              this.get('store').unloadRecord(this.get('landscape'));
            }else{
              return;
            }
            this.importLandscape(tutorial.get('landscapeTimestamp'));
          })
        }
    },
    importLandscape(landscapeTimestamp){
      this.get('store').queryRecord('tutoriallandscape', { timestamp: landscapeTimestamp }).then((tutlandscape) => {
        this.set('landscape',tutlandscape);
      }, (e) => {
        this.get('store').queryRecord('landscape', { timestamp: landscapeTimestamp }).then((landscape) => {
          this.get('store').queryRecord('tutoriallandscape', { timestamp: landscapeTimestamp }).then((tutoriallandscape)=>{
             tutoriallandscape.set('systems',landscape.get('systems'));
             tutoriallandscape.set('events',landscape.get('events'));
             tutoriallandscape.set('totalApplicationCommunications',landscape.get('totalApplicationCommunications'));
             tutoriallandscape.save();
           var tsrecord= {
                  id:landscape.get('timestamp.id'),
                  timestamp:landscape.get('timestamp.timestamp'),
                  landscape: tutoriallandscape
              }
              tsrecord= this.get('store').createRecord('tutorialtimestamp',tsrecord);
              tsrecord.save();
  
          });
          },{})
         
      });
    },
    importLandscapeSerialize(landscapeTimestamp){
      this.get('store').queryRecord('tutoriallandscape', { timestamp: landscapeTimestamp }).then((tutlandscape) => {
        this.set('landscape',tutlandscape);
      }, (e) => {
        this.get('store').queryRecord('landscape', { timestamp: landscapeTimestamp }).then((landscape) => {
          var lsrecord= {
            id:landscape.get('id'),
            systems:landscape.get('systems'),
            events: landscape.get('events'),
            totalApplicationCommunications:landscape.get('totalApplicationCommunications') 
        }
        this.get('store').push('tutoriallandscape',lsrecord);

          var tsrecord= {
                id:landscape.get('timestamp.id'),
                timestamp:landscape.get('timestamp.timestamp'),
                landscape: landscape
            }
            this.get('store').push('tutorialtimestamp',tsrecord);

        });
      });
    },
    importLandscapeID(landscapeTimestamp){
      this.get('store').queryRecord('tutoriallandscape', { timestamp: landscapeTimestamp }).then((tutlandscape) => {
        this.set('landscape',tutlandscape);
      }, (e) => {
        if(!this.get('store').hasRecordForId('tutoriallandscape',landscape.get('id'))){
          var tutoriallandscape = this.get('store').createRecord("tutoriallandscape",{
            id: landscape.get('id'),
            events: landscape.get('events'),
            systems: landscape.get('systems'),
            totalApplicationCommunications: landscape.get('totalApplicationCommunications')
          });
          tutoriallandscape.save();
        }else{
            this.get('store').queryRecord('landscape', { timestamp: landscapeTimestamp }).then((landscape) => {
              var timestamp=this.get('store').createRecord("tutorialtimestamp",{
                id:landscape.get('timestamp').get('id'),
                timestamp:landscape.get('timestamp').get('timestamp'),
                totalRequests:landscape.get('timestamp').get('totalRequests'),
                name:"new timestamp",
                landscape: tutoriallandscape
              });
              timestamp.save();
              this.set('timestamp',timestamp);
            });
        }
      });
    }
})
