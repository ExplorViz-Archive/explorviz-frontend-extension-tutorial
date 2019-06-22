import Service from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { Promise } from 'rsvp';
import { computed } from '@ember/object';
export default Service.extend(Evented,AlertifyHandler, {
  debug: debugLogger(),
  store: service(),
  landscapeService:service(),
  tutorialList: null,
  activeStep:null,
  steps:null,
  sequences:null,
  skipButton: computed('activeStep', function() {
      if(this.get('activeStep.targetId')!=="" && this.get('activeStep.targetType')!=="" && this.get('activeStep.actionType')!==""){
        return false;
      }
    return true;
  }),
  initService(model){
    this.set('sequences',[]);
    this.set('steps',[]);
    this.set('sequences',model.get('sequences'));
    this.get('sequences').forEach((k)=>{
      k.get('steps').forEach((s)=>{
        this.get('steps').push(s);
      });
    });
  },
  getNextStep(prevstep){
    if(prevstep==undefined){
      return this.get('steps')[0];
    }
    var nextStep=false;
    var step;
    this.get('steps').forEach(function(s){
      if(nextStep==true){
        step=s;
        nextStep=false;
      }
      if(s.get('id')==prevstep.get('id')){
          nextStep=true;
      }
    });
    if(step==undefined && nextStep==true){
      return false;
    }
    return step;
  },
  getSequence(step){
    return this.get('store').findAll('tutorial').then((tutorials)=>{
      var returnSequence;
        tutorials.forEach(function(tutorial){
            tutorial.get('sequences').forEach(function(sequence){
                sequence.get('steps').forEach(function(stepcompare){
                   if(stepcompare.get('id')==step.get('id')){
                      returnSequence=sequence;
                   }
                });
          });
      });
      return returnSequence;
  });
},
  getTutorial(sequence){
    return this.get('store').findAll('tutorial').then((tutorials)=>{
      var returnTutorial;
      tutorials.forEach(function(tutorial){
          tutorial.get('sequences').forEach(function(sequencecompare){
                   if(sequencecompare.get('id')==sequence.get('id')){
                     returnTutorial=tutorial;
                   }
          });
      });
      return returnTutorial;
    });

  },
  updateTutorialList(reload) {
    this.set('tutorialList', []);
    this.get('store').findAll('tutorial', { reload })
      .then(tutorials => {
        let tutorialList = tutorials.toArray();
        // sort by id
        tutorialList.sort((tutorial1, tutorial2) => parseInt(tutorial1.id) < parseInt(tutorial2.id) ? -1 : 1);
        this.set('tutorialList', tutorialList);
      });
  },
  saveTutorialChanges(tutorial) {
      if(tutorial) {
        // check for valid input
        if(!tutorial.get('title') || tutorial.get('title').length === 0) {
          this.showAlertifyMessage('Title cannot be empty.');
          return;
        }
        tutorial.save()
        .then((tutorial)=> {
          const message = `Tutorial updated.`;
          this.get('landscapeService').loadLandscape(tutorial);
          this.showAlertifyMessage(message);
        }, (reason) => {
          this.showReasonErrorAlert(reason);
        });
      } else {
        this.showAlertifyMessage(`Tutorial not found.`);
      }
    },
    showReasonErrorAlert(reason) {
        const {title, detail} = reason.errors[0];
        this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
    },
});
