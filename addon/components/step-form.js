import Component from '@ember/component';
import layout from '../templates/components/step-form';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler,{
  layout,
  actions:{
    saveStepChanges(step) {
      if(step) {
        // check for valid input
        if(!step.get('title') || step.get('title').length === 0) {
          this.showAlertifyMessage('Title cannot be empty.');
          return;
        }
        step.save()
        .then((stepy)=> {
          console.log(stepy);
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
