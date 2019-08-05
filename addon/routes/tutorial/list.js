import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
    model() {
        return RSVP.hash({
            tutorials: this.get('store').findAll('tutorial')
        });
    },
    actions: {
        resetRoute() {
            //const routeName = this.get('tutorial');
        }
    }
});