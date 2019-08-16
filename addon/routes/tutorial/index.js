import BaseRoute from 'explorviz-frontend/routes/base-route';

export default BaseRoute.extend({
  beforeModel: function() {
    this.transitionTo("tutorial.list");
  },
  actions: {
    resetRoute() {
      //const routeName = this.get('tutorial');
   },
  }
});
