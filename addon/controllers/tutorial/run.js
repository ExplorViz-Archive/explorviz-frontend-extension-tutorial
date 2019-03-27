import Controller from '@ember/controller';
import LandscapeInteraction from
    'explorviz-frontend/utils/landscape-rendering/interaction';
import { inject as service } from "@ember/service";
import { getOwner } from '@ember/application';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';


export default Controller.extend(AlertifyHandler,{
  tagName: '',
  store: service(),
  currentTutorial:null,
  currentSequence: null,
  currentStep: null,
  init(){
    const landscapeInteraction = LandscapeInteraction.create(getOwner(this).ownerInjection());
    this.set('landscapeInteraction', landscapeInteraction);
    this.get('landscapeInteraction').on('singleClick', function(emberModel) {
      if(emberModel!=undefined){
        this.set("targetType",emberModel.constructor.modelName);
        this.set("targetId",emberModel.get("id"));
        if(this.get('targetType')===this.get('step').targetType && this.get('targetId')===this.get('step').targetId){

        }
      }
      console.log(this);
    });
  },
  actions:{


  }
});
