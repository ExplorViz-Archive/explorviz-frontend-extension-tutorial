import Controller from '@ember/controller';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';
import { inject as service } from "@ember/service";

export default Controller.extend(AlertifyHandler, FileSaverMixin, {
  tutorialService: service(),
  currentUser: service(),

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

    importTutorial() {
      console.log("trying to import a tutorial...");
    },

    exportTutorial(tutorial) {
      const fileName = tutorial.get('id') + ".json";
      console.log("trying to export tutorial as " + fileName);


      var tutorialSerialized = tutorial.serialize({includeId: true}.data);
      // console.log(tutorialSerialized);
      let tutorialSerializedJSON = JSON.stringify(tutorialSerialized);
      // console.log(tutorialSerializedJSON);
      

      // text/plain;charset=utf-8
      // application/json
      // application/vnd.api+json
      var tutorialBlob = new Blob([tutorialSerializedJSON], {type: "application/json"});
      this.saveFileAs(fileName, tutorialBlob);
    }
  }
});
