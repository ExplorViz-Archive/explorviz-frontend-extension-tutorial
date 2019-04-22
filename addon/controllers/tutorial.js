import Controller from '@ember/controller';
import { inject as service } from "@ember/service";

export default Controller.extend({
  store: service(),
  renderingService: service("rendering-service"),
  updateModel() {
     // update your entity and then call
     this.get('renderingService').redrawScene();
   },
});
