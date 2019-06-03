import Component from '@ember/component';
import layout from '../templates/components/tutorial-form';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler,{
  layout,
  tutorialService: service(),
  landscapeService: service(),
  actions:{
    saveTutorialChanges(tutorial){
      this.get('tutorialService').saveTutorialChanges(tutorial);
    },
    resetLandscape(){
      if(this.get('landscapeService.landscape')!=null){
        this.set('landscapeService.landscape',null);
      }
    },
    addNewTutorial(){
      let newTutorial = this.get('store').createRecord("tutorial",{
         title: "new tutorial"
       })
       newTutorial.save();
     },
    addNewSequence(tutorial){
     let newSequence = this.get('store').createRecord("sequence",{
        title: "new sequence"
      })
      tutorial.get('sequences').push(newSequence);
      tutorial.save();
    },
    addNewStep(sequence){
      let newStep = this.get('store').createRecord("step",{
         title: "new step"
       })
       sequence.get('steps').push(newSequence);
       sequence.save();
    },
  }
});
