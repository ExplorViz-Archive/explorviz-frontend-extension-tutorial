import Controller from '@ember/controller';

export default Controller.extend({
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
},
showReasonErrorAlert(reason) {
  const {title, detail} = reason.errors[0];
  this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
},
});
