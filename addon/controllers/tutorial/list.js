import Controller from '@ember/controller';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { inject as service } from "@ember/service";

export default Controller.extend(AlertifyHandler, {
  currentUser: service(),
  fileLoader: service(),

  actions: {
    toggleTutorial(tutorial) {
      tutorial.set('expanded', !tutorial.get('expanded'));
      // also expand the sequences
      tutorial.get('sequences').forEach(function (seq) {
        seq.set('expanded', !seq.get('expanded'));
      });
    },

    toggleSequence(sequence) {
      sequence.set('expanded', !sequence.get('expanded'));
    },

    addNewTutorial() {
      let newTutorial = this.get('store').createRecord("tutorial", {
        title: "new tutorial"
      })
      newTutorial.save();
    },

    addNewSequence(tutorial) {
      let newSequence = this.get('store').createRecord("sequence", {
        title: "new sequence"
      })
      tutorial.set('expanded', true);
      tutorial.get('sequences').pushObject(newSequence);
      newSequence.save().then(function () {
        tutorial.save();
      });
    },

    addNewStep(sequence) {
      let newStep = this.get('store').createRecord("step", {
        title: "new step"
      })
      sequence.set('expanded', true);
      sequence.get('steps').pushObject(newStep);
      newStep.save().then(function () {
        sequence.save();
      });
    },

    deleteStep(step) {
      step.destroyRecord();
    },

    deleteSequence(sequence) {
      sequence.destroyRecord();
    },

    deleteTutorial(tutorial) {
      tutorial.destroyRecord();
      // still need to remove the tutorial from the store manually
      // https://github.com/emberjs/data/issues/5014
      this.store._removeFromIdMap(tutorial._internalModel)
    },

    // necessary for hidded input box to select a file for uploading
    triggerSelectBox() {
      document.querySelector("#selectBox").click();
    },

    // upload a tutorial to the backend
    uploadTutorial(evt) {
      this.get('fileLoader').uploadTutorial(evt);
    },

    // download a tutorial from the backend
    downloadTutorial(tutorial) {
      const tutorialId = tutorial.get('id');
      this.get('fileLoader').downloadTutorial(tutorialId);
    }
  }
});