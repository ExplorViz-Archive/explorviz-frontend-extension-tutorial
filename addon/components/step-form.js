import Component from '@ember/component';
import layout from '../templates/components/step-form';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';

export default Component.extend(AlertifyHandler,{
  layout,
  tagName: "",
  tutorialService: service(),
  landscapeService: service(),
  store: service(),
  nextStepAvailable: computed("model",function(){
    return this.get('tutorialService').getNextStep(this.get('model'));
  }),
  targetName: computed("model.targetId","model.targetType",function(){
    if(this.get("model.targetType")==undefined ||this.get("model.targetId")==undefined){
      return "";
    }
    let object = this.get('store').peekRecord(this.get("model.targetType"),this.get("model.targetId"));
    if(object!=undefined){
      return object.get('name');
    }
     return "";
  }),
  actions:{
    skipStep(){
      var step = this.get('tutorialService').getNextStep(this.get('model'));
      if(step){
        this.get('tutorialService').getSequence(step).then((sequence)=>{
          if(sequence.get('landscapeTimestamp')!=undefined){
            this.get('landscapeService').loadLandscape(sequence);
          }else{
            this.get('tutorialService').getTutorial(sequence).then((tutorial)=>{
              if(tutorial.get('landscapeTimestamp')!=undefined){
                this.get('landscapeService').loadLandscape(tutorial);
              }else{
                console.log("no landscape defined");
              }
            });
          }
        });
        this.get('tutorialService').set('activeStep',step);
        this.get('landscapeService').setInteractionModel(step);
      }else{
        this.showAlertifyMessage(`Last step completed.`);
      }
    },
    saveStepChanges(step) {
      if(step) {
        // check for valid input
        if(!step.get('title') || step.get('title').length === 0) {
          this.showAlertifyMessage('Title cannot be empty.');
          return;
        }
        step.save()
        .then(()=> {
          const message = `Step updated.`;
          this.showAlertifyMessage(message);
        }, (reason) => {
          this.showReasonErrorAlert(reason);
        });
      } else {
        this.showAlertifyMessage(`Step not found.`);
      }
    },
    toggleSelectTarget(){
      if(this.get('landscapeService.application')){
        this.set('landscapeService.applicationinteraction.selectTarget',!this.get('landscapeService.applicationinteraction.selectTarget'));
        this.set('')
      }else{
        this.set('landscapeService.landscapeinteraction.selectTarget',!this.get('landscapeService.landscapeinteraction.selectTarget'));
      }
    },
    removeTarget(){
      this.set('model.targetType',"");
      this.set('model.targetId',"");
      this.set('model.actionType',"");
    }
},
showReasonErrorAlert(reason) {
  const {title, detail} = reason.errors[0];
  this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
},
});
