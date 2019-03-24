import Component from '@ember/component';
import layout from '../templates/components/edit-form';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler,{
  layout,
  actions:{
    saveTutorialChanges(tutorial) {
      if(tutorial) {
        // check for valid input
        if(!tutorial.get('title') || tutorial.get('title').length === 0) {
          this.showAlertifyMessage('Title cannot be empty.');
          return;
        }

        tutorial.save()
        .then(()=> {
          const message = `Tutorial updated.`;
          this.showAlertifyMessage(message);
        }, (reason) => {
          this.showReasonErrorAlert(reason);
        });
      } else {
        this.showAlertifyMessage(`Tutorial not found.`);
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
        this.showAlertifyMessage(`Sequence not found.`);
      }
    },

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
