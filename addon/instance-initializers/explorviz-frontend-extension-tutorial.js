import Router from "explorviz-frontend/router";

export function initialize(appInstance) {

  const service = appInstance.lookup("service:page-setup");

  if(service){
    service.get("navbarRoutes").push("tutorial");
  }

  Router.map(function() {
    this.route("tutorial", function(){
      this.route('create');
      this.route('list');
      this.route('edit', { path: '/edit/:tutorial_id' });
    });
  });
}

export default {
  name: 'explorviz-frontend-extension-tutorial',
  initialize: initialize
};
