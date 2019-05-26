import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';


export default Controller.extend({
  tutorialService:service(),
  landscapeService:service(),
  activeStep:null,
  steps:[],
  sequences:[],
  activateNextStep(){
    // if(this.get('activeStep')){
    //   this.get('tutorialService').getSequence(this.get('activeStep')).then((sequence)=>{
    //       sequence.get('steps').forEach(function(v){
    //         console.log(v);
    //       });
    //   })
    // }
  }


});
