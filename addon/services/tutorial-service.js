import Service from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Service.extend(Evented,AlertifyHandler, {
  debug: debugLogger(),
  store: service(),
  landscapeService:service(),
  tutorialList: null,
  activeStep:null,
  steps:[],
  sequences:[],
  initService(model){
    this.set('sequences',model.get('sequences'));
    this.get('sequences').forEach((k)=>{
      k.get('steps').forEach((s)=>{
        this.get('steps').push(s);
      });
    });
  },
  getNextStep(step){
    if(step==undefined){
      return this.get('steps')[0];
    }
    debugger;
    var nextStep=false;
    var step;
    this.get('steps').forEach(function(s){
      if(nextStep==true){
        step=s;
      }
      if(s.get('id')==step.get('id')){
          nextStep=true;

      }
    });
    return step;
  },
  getSequence(step){
    return this.get('store').findAll('tutorial').then((tutorials)=>{
      return new Ember.RSVP.Promise(
        function(resolve){
          tutorials.forEach(function(k1){
            k1.get('sequences').then((sequences)=>{
                sequences.forEach(function(k2){
                  k2.get('steps').forEach(function(k3){
                     if(k3.get('id')==step.get('id')){
                      resolve(k2);
                     }
                  });
              });
            });
          })
        });
      });
  },
  getTutorial(sequence){
    return this.get('store').findAll('tutorial').then((tutorials)=>{
      return new Ember.RSVP.Promise(
        function(resolve){
          tutorials.forEach(function(k1){
            k1.get('sequences').then((sequences)=>{
                sequences.forEach(function(k2){
                  if(k2.get('id')==sequence.get('id')){
                    resolve(k1);
                  }
                });
            });
          })
        });
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
          this.get('landscapeService').loadTutorialLandscape(tutorial);
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
