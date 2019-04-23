import Component from '@ember/component';
import layout from '../../templates/components/landscape-select/landscapelist';
import {inject as service} from '@ember/service';

export default Component.extend({
  layout,
  store: service(),
  landscapeListener: service(),
  landscapeService: service(),
  tutorialService: service(),
  actions:{
      setTutorialTimestamp(tutorial,timestamp){
        tutorial.set('landscapeTimestamp',timestamp);
      },
      showLiveLandscapes(){
        this.set("landscapeService.livelandscapes",true);
        this.get('landscapeListener').set('pauseVisualizationReload',false);
      },
      hideLiveLandscapes(){
        this.set("landscapeService.livelandscapes",false);
        this.get('landscapeListener').set('pauseVisualizationReload',true);

      }
  }
});
