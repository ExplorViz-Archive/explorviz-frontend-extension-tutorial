import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { getOwner } from '@ember/application';
import { inject as service } from "@ember/service";

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  setupController(controller, model) {
    // Call _super for default behavior


  },
  actions: {
    // @Override BaseRoute
    resetRoute() {
      const routeName = this.get('tutorial');
   },

  }

});
