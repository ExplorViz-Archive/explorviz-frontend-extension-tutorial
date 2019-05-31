import Component from '@ember/component';
import layout from '../templates/components/sequence-form';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler,{
  layout,
  tutorialService: service(),
  landscapeService: service(),
  actions:{
    resetLandscape(){
      if(this.get('landscapeService.landscape')!=null){
        this.set('landscapeService.landscape',null);
      }
    },
    saveSequenceChanges(sequence) {
      if(sequence) {
        // check for valid input
        if(!sequence.get('title') || sequence.get('title').length === 0) {
          this.showAlertifyMessage('Title cannot be empty.');
          return;
        }
        sequence.save()
        .then(()=> {
          const message = `Sequence updated.`;
          this.showAlertifyMessage(message);
        }, (reason) => {
          this.showReasonErrorAlert(reason);
        });
      } else {
        console.log(sequence);
        this.showAlertifyMessage(`Sequence not found.`);
      }
    },
  }
});
