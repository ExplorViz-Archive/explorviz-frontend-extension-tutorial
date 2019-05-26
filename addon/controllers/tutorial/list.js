import Controller from '@ember/controller';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { inject as service } from "@ember/service";

export default Controller.extend(AlertifyHandler,{
 tutorialService: service(),
  actions: {
    toggleTutorial(tutorial){
        tutorial.set('expanded',!tutorial.get('expanded'));
              //this.get('tutorialService').expandTutorial(tutorial);
    },
    toggleSequence(sequence){
        sequence.set('expanded',!sequence.get('expanded'));
        //this.get('tutorialService').expandTutorial(tutorial);
    }
  }
});
