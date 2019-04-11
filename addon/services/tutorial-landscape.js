import Service from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { inject as service } from "@ember/service";

export default Service.extend(Evented, {
    debug: debugLogger(),
    store: service(),
    tutorialLandscape: null,
    loadTutorialLandscape(tutorial) {
        if (this.tutorialLandscape !== null) {
            this.get('store').unloadRecord(this.tutorialLandscape);
        }
        this.set(
            'tutorialLandscape',
            this.get('store').queryRecord('tutoriallandscape', { timestamp: tutorial.landscapeTimestamp }).then((landscape) => {
                return landscape;
            }, () => {
                var landscape = this.get('store').queryRecord('landscape', { timestamp: tutorial.landscapeTimestamp }).then((landscape) => {
                    var tutoriallandscape = this.get('store').createRecord("tutoriallandscape", {
                        timestamp: tutorial.landscapeTimestamp,
                        landscape: landscape 
                    });
                    tutoriallandscape.save();
                    return tutoriallandscape;
                });
                return landscape;
            })
        );
    },
})