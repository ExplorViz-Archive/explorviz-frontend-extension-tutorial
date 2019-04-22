import Component from '@ember/component';
import layout from '../../templates/components/landscape-select/landscapelist';
import {inject as service} from '@ember/service';

export default Component.extend({
  layout,
  store: service(),
  landscapeListener: service(),
  landscapeService: service(),
});
