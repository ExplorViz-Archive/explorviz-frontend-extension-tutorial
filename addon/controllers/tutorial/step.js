import Controller from '@ember/controller';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { inject as service } from "@ember/service";

export default Controller.extend(AlertifyHandler,{
  tutorialService:service(),
  landscapeService:service(),
  actions:{
  saveStepChanges(step) {
    if(step) {
      // check for valid input
      if(!step.get('title') || step.get('title').length === 0) {
        this.showAlertifyMessage('Title cannot be empty.');
        return;
      }

      step.save()
      .then(()=> {
        const message = `Step updated.`;
        this.showAlertifyMessage(message);
      }, (reason) => {
        this.showReasonErrorAlert(reason);
      });
    } else {
      this.showAlertifyMessage(`Step not found.`);
    }
  },
},
showReasonErrorAlert(reason) {
  const {title, detail} = reason.errors[0];
  this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
},
});
