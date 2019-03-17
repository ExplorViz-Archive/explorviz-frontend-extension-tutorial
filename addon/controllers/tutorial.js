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

actions: {
  // body
  selectedSingleFile(){


  },
  addTutorial(){

  }
}

});
