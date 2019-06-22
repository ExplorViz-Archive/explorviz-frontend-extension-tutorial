import Controller from '@ember/controller';
import { inject as service } from "@ember/service";

export default Controller.extend({
  store: service(),
  renderingService: service("rendering-service"),
    setupController(controller, model) {
     this._super(controller, model);
     controller.initRendering();

   },
   actions: {
     resetRoute() {
       //const routeName = this.get('tutorial');
    }
  }
});
