import Router from "explorviz-frontend/router";

export function initialize(appInstance) {

  const service = appInstance.lookup("service:page-setup");

  if(service){
    service.get("navbarRoutes").push("tutorial");
  }

  Router.map(function() {
    this.route("tutorial", function(){
       this.route("list", function(){
         this.route('tutorial');
         this.route('sequence');
         this.route('step');
        });
        this.route("edit", function(){
          this.route('tutorial', { path: '/tutorial/:tutorial_id' });
          this.route('tutorial.target', { path: '/tutorial/:tutorial_id/target' });
          this.route('tutorial.landscape', { path: '/tutorial/:tutorial_id/landscape' });
          this.route('sequence', { path: '/sequence/:sequence_id' });
          this.route('step', { path: '/step/:step_id' });
          this.route('step.target', { path: '/step/:step_id/target' });

        });
        this.route("create", function(){
          this.route('tutorial', { path: '/tutorial' });
          this.route('sequence', { path: '/sequence/for/:tutorial_id' });
          this.route('step', { path: '/step/for/:sequence_id' });
        });
        this.route('run', { path: '/run/tutorial/:tutorial_id' });
    });
  });
}

export default {
  name: 'explorviz-frontend-extension-tutorial',
  initialize: initialize
};
