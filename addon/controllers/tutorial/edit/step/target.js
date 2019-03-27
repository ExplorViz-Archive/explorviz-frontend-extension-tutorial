import Controller from '@ember/controller';
import LandscapeInteraction from
    'explorviz-frontend/utils/landscape-rendering/interaction';
import { inject as service } from "@ember/service";
import { getOwner } from '@ember/application';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';


export default Controller.extend(AlertifyHandler,{
  tagName: '',
  store: service(),
  targetType: null,
  targetId:null,
   init(){
     const landscapeInteraction = LandscapeInteraction.create(getOwner(this).ownerInjection());
     this.set('landscapeInteraction', landscapeInteraction);
     this.get('landscapeInteraction').on('singleClick', function(emberModel) {
       if(emberModel!=undefined){
         this.set("targetType",emberModel.constructor.modelName);
         this.set("targetId",emberModel.get("id"));
        // console.log("Set Target:"+  Ember.get("targetType")+" "+targetId);
       }
     }); 
   },
  actions:{
    saveTarget(model,targetType,targetId){
        this.get("model").set("targetType",targetType);
        this.get("model").set("targetId",targetId);
        this.get("model").save();
        this.transitionToRoute("tutorial.edit.step", model);
    }
  }
});
