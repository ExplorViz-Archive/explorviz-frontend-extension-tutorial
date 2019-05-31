import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';


export default Controller.extend({
  tutorialService:service(),
  landscapeService:service(),
  activateNextStep(laststep){
    var step = this.get('tutorialService').getNextStep(laststep);
    if(step){
      this.get('tutorialService').getSequence(step).then((sequence)=>{
        if(sequence.get('landscapeTimestamp')!=undefined){
          this.get('landscapeService').loadLandscape(sequence);
        }else{
          this.get('landscapeService').loadLandscape(model);
        }
      });
      this.get('tutorialService').set('activeStep',step);
      this.set('model',step);
    }else{
      this.showAlertifyMessage(`Last step completed.`);
    }
  }
});
