import Service from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { inject as service } from "@ember/service";

export default Service.extend(Evented, {
    debug: debugLogger(),
    store: service(),
    tutorialLandscape: null,
    tutorialTimestamp: null,
    loadTutorialLandscape(tutorial) {
        if (this.tutorialLandscape !== null) {
            this.get('store').unloadRecord(this.tutorialLandscape);
        }
        this.set('tutorialTimestamp',tutorial.landscapeTimestamp);
            var record = this.get('store').queryRecord('tutoriallandscape', { timestamp: tutorial.landscapeTimestamp }).then((landscape) => {
              debugger;
              this.set('tutorialLandscape',landscape);
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
                    debugger;
                    tutoriallandscape.save();
                    this.set('tutorialLandscape',tutoriallandscape);
                  });
                });
            });
    },
})
