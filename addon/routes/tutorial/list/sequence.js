import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
    model() {
        return RSVP.hash({
            sequences: this.get('store').findAll('sequence')
        });
    },
    actions: {
        resetRoute() {
          //const routeName = this.get('tutorial');
       },
      }
});
