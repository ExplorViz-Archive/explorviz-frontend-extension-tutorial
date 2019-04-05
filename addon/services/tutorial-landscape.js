import Service from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';

export default Service.extend(Evented, {
    debug: debugLogger(),
    tutorialLandscape: null,
    loadTutorialLandscape(tutorial){
           if(this.tutorialLandscape!==null){
                this.get('store').unloadRecord(this.tutorialLandscape);
           }
           this.set('tutorialLandscape',this.get('store').queryRecord('tutoriallandscape', {timestamp: tutorial.landscapeTimestamp }).then(landscape => {
                if(landcape===null){
                    landscape = this.get('store').queryRecord('landscape', {timestamp: tutorial.landscapeTimestamp }).then(landscape => {
                        landscape=this.get('store').createRecord("tutoriallandscape",landcape);
                        landscape.save();
                        return landscape;
                    });
                }
                return landscape;
            })
        );
    },
})