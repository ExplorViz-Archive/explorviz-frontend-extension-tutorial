import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';

export default Controller.extend({
  store: service(),

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
        userList.sort((tutorial1, tutorial2) => parseInt(tutorial1.id) < parseInt(tutorial2.id) ? -1 : 1);
        this.set('tutorials', userList);
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
