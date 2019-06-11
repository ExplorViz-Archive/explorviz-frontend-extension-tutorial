import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  model(params) {
    var val = this.get('store').findRecord('tutorial', params.tutorial_id);
    return val;
  },
  setupController(controller, model) {
    this._super(...arguments);
    controller.get('tutorialService').initService(model);
    controller.get('landscapeService').updateLandscapeList(true);
    controller.set('landscapeService.liveMode',false);
    var step = controller.get('tutorialService').getNextStep();
    controller.set('tutorialService.activeStep',step);
    controller.get('tutorialService').getSequence(step).then((sequence)=>{
      if(sequence!=undefined && sequence.get('landscapeTimestamp')!=undefined){
        controller.get('landscapeService').loadLandscape(sequence);
      }else{
        controller.get('landscapeService').loadLandscape(model);
      }
    });
  },
  actions: {
    // @Override BaseRoute
    resetRoute() {
      //const routeName = this.get('tutorial');
   },
  }
});
