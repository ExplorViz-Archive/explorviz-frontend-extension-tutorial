import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  model(params) {
        return this.get('store').findRecord('sequence', params.sequence_id);
  },
  setupController(controller, model) {
    this._super(...arguments);
    controller.set('landscapeService.liveMode',false);
    controller.get('landscapeService').updateLandscapeList(true);
    if(model.get('landscapeTimestamp')!=undefined){
     controller.get('landscapeService').loadLandscape(model);
    }else{
     controller.get('tutorialService').getTutorial(model).then((tutorial)=>{
         controller.get('landscapeService').loadLandscape(tutorial);
     });
   }
    //controller.get('landscapeService').loadLandscape(model.get('tutorial'));
  },
  actions: {
    // @Override BaseRoute
    resetRoute() {
      //const routeName = this.get('tutorial');
   },
  }

});
