import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  model(params) {
    var val = this.get('store').findRecord('tutorial', params.tutorial_id);
    return val;
  },
  setupController(controller, model) {
    this._super(...arguments);
    controller.get('tutorialService').initService(model);
    controller.get('landscapeService').updateLandscapeList(true);
    controller.get('landscapeService').loadTutorialLandscape(model);
    controller.set('landscapeService.liveMode',false);
  },
  actions: {
    // @Override BaseRoute
    resetRoute() {
      //const routeName = this.get('tutorial');
   },
  }
});
