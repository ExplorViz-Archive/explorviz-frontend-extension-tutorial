import Service from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { inject as service } from "@ember/service";
import LandscapeInteraction from 'explorviz-frontend/utils/landscape-rendering/interaction'
import { getOwner } from '@ember/application';

export default Service.extend(Evented, {
    debug: debugLogger(),
    store: service(),
    landscapeService: service(),
    landscape: null,
    livelandscapes: false,
    landscapeList: null,

    updateLandscapeList(reload) {
      this.set('landscapeList', []);
      this.get('store').findAll('tutoriallandscape', { reload })
        .then(landscapes => {
          let landscapeList = landscapes.toArray();
          // sort by id
          landscapeList.sort((landscape1, landscape2) => parseInt(landscape1.id) < parseInt(landscape2.id) ? -1 : 1);
          this.set('landscapeList', landscapeList);
        });
    },
    loadLandscape(model) {
        if (this.get('landscape') !== null) {
          this.get('store').queryRecord('tutoriallandscape',{ timestamp: model.get('landscapeTimestamp') }).then((landscape)=>{
            if (this.get('landscape.id')!= landscape.get('id')){
              this.get('store').unloadRecord(this.get('landscape'));
            }else{
              return;
            }
          });
        }
        if(model.get('landscapeTimestamp')!=undefined && model.get('landscapeTimestamp')!=""){
          this.importLandscape(model.get('landscapeTimestamp'),"");
        }
    },
    importLandscape(landscapeTimestamp,name){

      this.get('store').queryRecord('tutoriallandscape', { timestamp: landscapeTimestamp }).then((tutlandscape) => {
        this.set('landscape',tutlandscape);
      }, () => {
            this.get('store').queryRecord('landscape', { timestamp: landscapeTimestamp }).then((landscape) => {
              if(!this.get('store').hasRecordForId('tutoriallandscape',landscape.get('id'))){
                if(name=="" ||name == undefined){
                  name="new landscape";
                }
              var timestamprecord=this.get('store').createRecord("tutorialtimestamp",{
                id:landscape.get('timestamp.id'),
                timestamp:landscape.get('timestamp.timestamp'),
                totalRequests:landscape.get('timestamp.totalRequests'),
                name:name,
              });
              var landscaperecord = this.get('store').createRecord("tutoriallandscape",{
                id:landscape.get('id'),
                systems:landscape.get('systems'),
                events:landscape.get('events'),
                totalApplicationCommunications:landscape.get('totalApplicationCommunications'),
                timestamp:timestamprecord
              });
              timestamprecord.save();
              landscaperecord.save();
              this.set('landscape',landscaperecord);

            }else{
              this.get('store').set('tutoriallandscape',landscape);
              this.set('landscape',landscape);

            }
            });
      });
    },
    clickListenerSingle(emberModel){
      if(emberModel!=undefined){
          if(this.get('selectTarget')){
            this.set("model.targetType",emberModel.constructor.modelName);
            this.set("model.targetId",emberModel.get("id"));
            this.set("model.actionType","singleClick");
            this.set('selectTarget',false);
          }else{
            if(this.get("model.targetType")==emberModel.get('constructor.modelName') && this.get("model.targetId")==emberModel.get("id")&& this.get('model.actionType')=="singleClick"){
              if(this.get("runMode")){
                this.completed(this.get('model'));
              }
            }
          }
      }
    },
    clickListenerDouble(emberModel){
      if(emberModel!=undefined){
          if(this.get('selectTarget')){
            this.set("model.targetType",emberModel.constructor.modelName);
            this.set("model.targetId",emberModel.get("id"));
            this.set("model.actionType","singleClick");
            this.set('selectTarget',false);
          }else{
            if(this.get("model.targetType")==emberModel.get('constructor.modelName') && this.get("model.targetId")==emberModel.get("id")&& this.get('model.actionType')=="doubleclick"){
              if(this.get("runMode")){
                this.completed(this.get('model'));
              }
            }
          }
      }
    },
    initListeners(){
        const landscapeInteraction = LandscapeInteraction.create(getOwner(this).ownerInjection());
        this.set('interaction', landscapeInteraction);
        this.get('interaction').on('singleClick', this.clickListenerSingle);
        this.get('interaction').on('doubleClick', this.clickListenerDouble);
      }

})
