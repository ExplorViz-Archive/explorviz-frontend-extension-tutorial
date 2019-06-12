import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  model(params) {
        return this.get('store').findRecord('step',params.step_id);
  },
  setupController(controller, model) {
    controller.set('landscapeService.liveMode',false);
    controller.get('landscapeService').updateLandscapeList(true);
    controller.get('landscapeService.landscape',null);

    controller.get('tutorialService').getSequence(model).then((sequence)=>{
      if(sequence.get('landscapeTimestamp')!=undefined){
        controller.get('landscapeService').loadLandscape(sequence);
      }else{
        controller.get('tutorialService').getTutorial(sequence).then((tutorial)=>{
          controller.get('landscapeService').loadLandscape(tutorial);
        });
      }
    });
    
    if(controller.get('currentUser.user.isAdmin')){
      controller.set('runmode',false);
    }
    this._super(...arguments);

  },
  actions: {
    // @Override BaseRoute
    resetRoute() {
      //const routeName = this.get('tutorial');
   },
  }

});
