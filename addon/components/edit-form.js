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
          this.actions.openMainPage.bind(this)();
        }, (reason) => {
          this.showReasonErrorAlert(reason);
        });
      } else {
        this.showAlertifyMessage(`Tutorial not found.`);
      }
    },
  }
});
