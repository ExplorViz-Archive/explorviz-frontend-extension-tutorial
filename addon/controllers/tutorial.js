import Controller from '@ember/controller';
import { inject as service } from "@ember/service";

export default Controller.extend({
  store: service(),
  renderingService: service(),

   updateModel() {
     // update your entity and then call
     this.get('renderingService').redrawScene();
   },

  tutorials: null,

  
  init() {
    this._super(...arguments);
    this.updateTutorialList(true);
  },
updateTutorialList(reload) {
  this.set('tutorials', []);
  this.get('store').findAll('tutorial', { reload })
    .then(tutorials => {
      let tutorialList = tutorials.toArray();
      // sort by id
      tutorialList.sort((tutorial1, tutorial2) => parseInt(tutorial1.id) < parseInt(tutorial2.id) ? -1 : 1);
      this.set('tutorials', tutorialList);
    });
},
saveTutorialChanges() {
  const tutorialData = this.getProperties('tutorial_id_change', 'tutorial_title_change');

  const tutorial = this.get('tutorials').find( tutorial => tutorial.get('id') == tutorialData.tutorial_id_change);

  if(tutorial) {
    // check for valid input
    if(!tutorialData.tutorial_title_change || tutorialData.tutorial_title_change.length === 0) {
      this.showAlertifyMessage('Title cannot be empty.');
      return;
    }

    if(tutorial.get('title') !== tutorialData.tutorial_title_change)
    tutorial.set('title', tutorialData.tutorial_title_change);

    tutorial.save()
    .then(()=> {
      const message = `Tutorial updated.`;
      this.showAlertifyMessage(message);
      this.setProperties({
        tutorial_id_change: "",
        tutorial_title_change: ""
      });
      this.actions.openMainPage.bind(this)();
    }, (reason) => {
      this.showReasonErrorAlert(reason);
    });
  } else {
    this.showAlertifyMessage(`Tutorial not found.`);
  }
},
actions: {
  // body
  selectedSingleFile(){


  },
  addTutorial(){

  }
}

});
