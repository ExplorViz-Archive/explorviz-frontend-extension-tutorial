import Controller from '@ember/controller';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';
import { inject as service } from "@ember/service";

export default Controller.extend(AlertifyHandler, FileSaverMixin, {
  tutorialService: service(),
  currentUser: service(),
  fileLoader: service(),

  actions: {
    toggleTutorial(tutorial) {
      tutorial.set('expanded', !tutorial.get('expanded'));
      //this.get('tutorialService').expandTutorial(tutorial);
    },

    toggleSequence(sequence) {
      sequence.set('expanded', !sequence.get('expanded'));
      //this.get('tutorialService').expandTutorial(tutorial);
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
    },

    // necessary for hidded input box to select a file for uploading
    triggerSelectBox() {
      document.querySelector("#selectBox").click();
    },

    // upload a tutorial to the backend
    uploadTutorial(evt) {
      // upload file to the backend
      this.get('fileLoader').uploadTutorial(evt);
    },

    // download a tutorial from the backend
    downloadTutorial(tutorial) {
      const tutorialId = tutorial.get('id');
      this.get('fileLoader').downloadTutorial(tutorialId);
    }
  }
});
