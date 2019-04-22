import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import LandscapeInteraction from
    'explorviz-frontend/utils/landscape-rendering/interaction';
import { getOwner } from '@ember/application';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  model(params) {
        return this.store.findRecord('tutorial', params.tutorial_id);
  },
  setupController(controller, model) {
    this._super(...arguments);
    controller.get('landscapeService').updateLandscapeList();
    controller.get('landscapeService').loadTutorialLandscape(model);
  },

  actions: {
    // @Override BaseRoute
    resetRoute() {
      //const routeName = this.get('tutorial');
   },
 }
});
