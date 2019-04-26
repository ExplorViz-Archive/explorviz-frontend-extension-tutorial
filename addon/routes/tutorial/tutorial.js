import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  model(params) {
        return this.get('store').findRecord('tutorial', params.tutorial_id);
  },
  setupController(controller, model) {
    this._super(...arguments);
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
