import Component from '@ember/component';
import layout from '../../templates/components/landscape-select/landscapelist';
import {inject as service} from '@ember/service';

export default Component.extend({
  layout,
  store: service(),
  landscapeListener: service("landscape-listener"),
  landscapes: null,
  init(){
    this._super(...arguments);
    this.updateLandscapeList();
  },

  updateLandscapeList(reload) {
    this.set('landscapes', []);
    this.get('store').findAll('tutoriallandscape', { reload })
      .then(landscapes => {
        let landscapeList = landscapes.toArray();
        // sort by id
        landscapeList.sort((landscape1, landscape2) => parseInt(landscape1.id) < parseInt(landscape2.id) ? -1 : 1);
        this.set('landscapes', landscapeList);
      });
  },
});
