import Controller from '@ember/controller';

export default Controller.extend({
  actions:{
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
  }
});
