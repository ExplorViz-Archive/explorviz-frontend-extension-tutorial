import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  model(params) {
        return this.get('store').findRecord('step', params.step_id);
  },
  setupController(controller, model) {
    this._super(...arguments);
    controller.set('landscapeService.liveMode',false);
    controller.get('landscapeService').updateLandscapeList(true);
    debugger;
    controller.get('landscapeService').loadTutorialLandscape(model.get('sequence').get('tutorial'));
  },
  actions: {
    // @Override BaseRoute
    resetRoute() {
      //const routeName = this.get('tutorial');
   },
  }

});
