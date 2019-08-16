import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default BaseRoute.extend(AuthenticatedRouteMixin, {

  setupController(controller, model) {
    this._super(...arguments);
    controller.get('landscapeService').updateLandscapeList(true);
    controller.set('landscapeService.landscape', null);
    controller.set('landscapeService.application', null);

    controller.get('landscapeService').loadLandscape(model);
    controller.set('landscapeService.liveMode', false);

    if (controller.get('currentUser.user.isAdmin')) {
      controller.set('runmode', false);
    }
  },

  actions: {
    // @Override BaseRoute
    resetRoute() {
      //const routeName = this.get('tutorial');
    },
  }

});
