import Component from '@ember/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler,{
  sequence:null,
  store:service(),
  showReasonErrorAlert(reason) {
    const {title, detail} = reason.errors[0];
    this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
  },
  actions:{
    createStep(sequence){
      const stepData = this.getProperties('title');
      // check for valid input
      if(!stepData.title || stepData.title.length === 0) {
        this.showAlertifyMessage('Title cannot be empty.');
        return;
      }
      const stepRecord = this.get('store').createRecord('step', {
        title: stepData.title,
        sequence: sequence
      });
      sequence.get("steps").pushObject(stepRecord);
      sequence.save().then(() => {
            const message = "Step <b>" + stepRecord.title + "</b> was created and added to Sequence <b>" + sequence.title + "</b>.";
            this.showAlertifyMessage(message);
            this.setProperties({
              title: "",
            });
        }, (reason) => {
          this.showReasonErrorAlert(reason);
          stepRecord.deleteRecord();
        });
    },
    createSequence(tutorial){
      const stepData = this.getProperties('title');
      // check for valid input
      if(!stepData.title || stepData.title.length === 0) {
        this.showAlertifyMessage('Title cannot be empty.');
        return;
      }
      const sequenceRecord = this.get('store').createRecord('sequence', {
        title: stepData.title,
        tutorial: tutorial
      });
      tutorial.get("sequences").pushObject(sequenceRecord);
      tutorial.save().then(() => {
            const message = "Sequence <b>" + sequenceRecord.title + "</b> was created and added to Tutorial <b>" + tutorial.title + "</b>.";
            this.showAlertifyMessage(message);
            this.setProperties({
              title: "",
            });
        }, (reason) => {
          this.showReasonErrorAlert(reason);
          stepRecord.deleteRecord();
        });
    },
    createTutorial(){

    }
  }

});
