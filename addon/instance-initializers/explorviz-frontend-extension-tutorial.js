import Router from "explorviz-frontend/router";

export function initialize(appInstance) {

  const service = appInstance.lookup("service:page-setup");

  if(service){
    service.get("navbarRoutes").push("tutorial");
  }

  Router.map(function() {
    this.route("tutorial", function(){
          this.route("list", { path: '/list' });
          this.route('tutorial', { path: '/:tutorial_id' });
          this.route('sequence', { path: '/sequence/:sequence_id' });
          this.route('step', { path: '/step/:step_id' });
          this.route('run', { path: '/run/:tutorial_id' });
    });
  });
}

export default {
  name: 'explorviz-frontend-extension-tutorial',
  initialize: initialize
};
