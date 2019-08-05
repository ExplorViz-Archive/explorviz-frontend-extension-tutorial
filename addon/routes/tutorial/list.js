import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
     
    model() {
        return this.get('store').findAll('tutorial');
    },

    actions: {
        resetRoute() {
            //const routeName = this.get('tutorial');
        },
    }
});