import Controller from '@ember/controller';

export default Controller.extend({
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
}
});
