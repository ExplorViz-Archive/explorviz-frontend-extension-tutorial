import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  beforeModel(/* transition */) {
     //this.transitionTo('tutorial.list.tutorial'); // Implicitly aborts the on-going transition.
   },
   actions: {
     resetRoute() {
       //const routeName = this.get('tutorial');
    },
   }
});
