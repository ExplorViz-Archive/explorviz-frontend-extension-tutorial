import Component from '@ember/component';
import layout from '../templates/components/tutorial-form';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler,{
  layout,
  tutorialService: service(),
  landscapeService: service(),
  tagName: "",
  actions:{
    saveTutorialChanges(tutorial){
      this.get('tutorialService').saveTutorialChanges(tutorial);
    },
    toggleSetLandscape(){
      this.set('landscapeService.selectLandscape',!this.get('landscapeService.selectLandscape'));
    },
  
  }
});
