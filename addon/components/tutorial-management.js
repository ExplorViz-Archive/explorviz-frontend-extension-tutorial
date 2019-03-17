import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { getOwner } from '@ember/application';
import LandscapeInteraction from
    'explorviz-frontend/utils/landscape-rendering/interaction';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler,{
  tagName: '',
  store: service(),
  tutorials: null,
  page: null,
  currentTutorial:null,
  currentSequence:null,
  currentStep:null,

selectedTarget:null,
landscapeListener: service("landscape-listener"),
landscapeRepo: service("repos/landscape-repository"),
  didInsertElement() {
    this._super(...arguments);
    this.set('page', 'main');
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
    openMainPage() {
      this.set('page', 'main');
    },
    openEditTutorialPage(tutorial){
      this.set('page', 'editTutorial');
      this.set('currentTutorial', tutorial);
      this.setProperties({
        tutorial_id_change: tutorial.id,
        tutorial_title_change: tutorial.title,
      });
    },
    openEditSequencePage(tutorial,sequence){
      this.set('page', 'editSequence');
      this.set('currentTutorial', tutorial);
      this.set('currentSequence', sequence);
      this.setProperties({
        sequence_id_change: sequence.id,
        sequence_title_change: sequence.title,
      });
    },
    openEditStepPage(tutorial,sequence,step){
      this.set('page', 'editStep');
      this.set('currentTutorial', tutorial);
      this.set('currentSequence', sequence);
      this.set('currentStep', step);
      this.setProperties({
        step_id_change: step.id,
        step_title_change: step.title,
        step_target_change: step.target,
        step_target_type_change:step.targetType,
        step_target_id_change:step.targetId
      });
    },
    openCreateTutorialPage() {
      this.set('page', 'createTutorial');
    },
    openCreateSequencePage() {
      this.set('page', 'createSequence');
    },
    openCreateStepPage() {
      this.set('page', 'createStep');
    },
    setTarget(tutorial,sequence,step,target){
        step.set("targetType",target.constructor.modelName);
        step.set("targetId",target.get("id"));
        step.save()
        .then(()=> {
          const message = `Step updated.`;
          this.showAlertifyMessage(message);
          this.actions.openEditStepPage.bind(this)(this.currentTutorial,this.currentSequence,this.currentStep,this.selectedTarget);
        }, (reason) => {
          this.showReasonErrorAlert(reason);
        });
    },
    openSelectTarget(){
      this.set('page', 'selectTarget');
      this.get('landscapeListener').initSSE();
      const landscapeInteraction = LandscapeInteraction.create(getOwner(this).ownerInjection());
      this.set('landscapeInteraction', landscapeInteraction);
      this.get('landscapeInteraction').on('singleClick', function(emberModel) {
        this.set('selectedTarget',emberModel);
      });
    },
    saveTutorial() {
      const tutorialData = this.getProperties('title');
      // check for valid input
      if(!tutorialData.title || tutorialData.title.length === 0) {
        this.showAlertifyMessage('Title cannot be empty.');
        return;
      }

      const tutorialRecord = this.get('store').createRecord('tutorial', {
        title: tutorialData.title,
      });

      tutorialRecord.save().then(() => { // success
        const message = "Tutorial <b>" + tutorialData.title + "</b> was created.";
        this.showAlertifyMessage(message);
        this.updateTutorialList(false);
        this.actions.openMainPage.bind(this)();
        this.setProperties({
          title: "",
        });
        this.openMainPage();
      }, (reason) => { // failure
        this.showReasonErrorAlert(reason);
        tutorialRecord.deleteRecord();
        this.updateTutorialList(false);
      });


    },
    saveSequence() {
      const sequenceData = this.getProperties('title');

      // check for valid input
      if(!sequenceData.title || sequenceData.title.length === 0) {
        this.showAlertifyMessage('Title cannot be empty.');
        return;
      }

      const sequenceRecord = this.get('store').createRecord('sequence', {
        title: sequenceData.title,
      });
      sequenceRecord.save().then(() => { // success
        this.currentTutorial.sequences.pushObject(sequenceRecord);
        this.currentTutorial.save().then(() => {
          const message = "Sequence <b>" + sequenceData.title + "</b> was created and added to Tutorial <b>"+this.currentTutorial.title+"</b>.";
          this.showAlertifyMessage(message);
          this.updateTutorialList(true);
          this.setProperties({
            title: "",
          });
          this.actions.openMainPage.bind(this)();
          this.actions.openEditTutorialPage.bind(this)(this.currentTutorial);
        }, (reason) => { // failure
        this.showReasonErrorAlert(reason);
        sequenceRecord.deleteRecord();
        this.updateTutorialList(false);
      });
    }, (reason) => { // failure
      this.showReasonErrorAlert(reason);
      sequenceRecord.deleteRecord();
      this.updateTutorialList(false);
    });
    },
    saveStep() {
      const stepData = this.getProperties('title','target');

      // check for valid input
      if(!stepData.title || stepData.title.length === 0) {
        this.showAlertifyMessage('Title cannot be empty.');
        return;
      }

      const stepRecord = this.get('store').createRecord('step', {
        title: stepData.title,
        target: this.selectedTarget,

      });
      stepRecord.save().then(() => {
        this.currentSequence.steps.pushObject(stepRecord);
        this.currentSequence.save().then(() => {
          const message = "Step <b>" + stepRecord.title + "</b> was created and added to Sequence <b>" + this.currentSequence.title + "</b>.";
          this.showAlertifyMessage(message);
          this.updateTutorialList(true);
          this.setProperties({
            title: "",
            action: ""
          });
          this.actions.openMainPage.bind(this)();
          this.actions.openEditSequencePage.bind(this)(this.currentTutorial,this.currentSequence);
        }, (reason) => {
          this.showReasonErrorAlert(reason);
          stepRecord.deleteRecord();
          this.updateTutorialList(false);
        });
      }, (reason) => { // failure
        this.showReasonErrorAlert(reason);
        stepRecord.deleteRecord();
        this.updateTutorialList(false);
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
    saveSequenceChanges(){
      const sequenceData = this.getProperties('sequence_id_change', 'sequence_title_change');
      const sequence = this.currentTutorial.sequences.find( sequence => sequence.get('id') == sequenceData.sequence_id_change);
      if(sequence) {
        // check for valid input
        if(!sequenceData.sequence_title_change || sequenceData.sequence_title_change.length === 0) {
          this.showAlertifyMessage('Title cannot be empty.');
          return;
        }

        if(sequence.get('title') !== sequenceData.sequence_title_change)
        sequence.set('title', sequenceData.sequence_title_change);

        sequence.save()
        .then(()=> {
          const message = `Sequence updated.`;
          this.showAlertifyMessage(message);
          this.actions.openEditSequencePage.bind(this)(this.currentTutorial,this.currentSequence);
        }, (reason) => {
          this.showReasonErrorAlert(reason);
        });
      } else {
        this.showAlertifyMessage(`Sequence not found.`);
      }
    },
    saveStepChanges(){
      const stepData = this.getProperties('step_id_change', 'step_title_change','step_target_change');
      const step = this.currentSequence.steps.find( step => step.get('id') == stepData.step_id_change);
      if(step) {
        // check for valid input
        if(!stepData.step_title_change || stepData.step_title_change.length === 0) {
          this.showAlertifyMessage('Title cannot be empty.');
          return;
        }

        if(step.get('title') !== stepData.step_title_change)
        step.set('title', stepData.step_title_change);
        step.set('target',this.selectedTarget);
        step.save()
        .then(()=> {
          const message = `Step updated.`;
          this.showAlertifyMessage(message);
          this.actions.openEditStepPage.bind(this)(this.currentTutorial,this.currentSequence,this.currentStep,this.selectedTarget);
        }, (reason) => {
          this.showReasonErrorAlert(reason);
        });
      } else {
        this.showAlertifyMessage(`Step not found.`);
      }

    },
    deleteTutorial(tutorial) {
      tutorial.destroyRecord()
      .then(() => { // success
        const message = `Tutorial <b>${tutorial.title}</b> deleted.`;
        this.showAlertifyMessage(message);
        this.updateTutorialList(false);
      }, (reason) => { // failure
        this.showReasonErrorAlert(reason);
        this.updateTutorialList(true);
      }
    );
  },
    deleteSequence(sequence) {
      sequence.destroyRecord()
      .then(() => { // success
        const message = `Sequence <b>${sequence.title}</b> deleted.`;
        this.showAlertifyMessage(message);
        this.updateTutorialList(false);
      }, (reason) => { // failure
        this.showReasonErrorAlert(reason);
        this.updateTutorialList(true);
      }
    );
  },
    deleteStep(step) {
      step.destroyRecord()
      .then(() => { // success
        const message = `Step <b>${step.title}</b> deleted.`;
        this.showAlertifyMessage(message);
        this.updateTutorialList(false);
      }, (reason) => { // failure
        this.showReasonErrorAlert(reason);
        this.updateTutorialList(true);
      }
    );
  },

},
showReasonErrorAlert(reason) {
  const {title, detail} = reason.errors[0];
  this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
},
});
