import Router from "explorviz-frontend/router";

export function initialize(appInstance) {

  const service = appInstance.lookup("service:page-setup");

  if(service){
    service.get("navbarRoutes").push("tutorial");
  }

  Router.map(function() {
    this.route("tutorial");
  });
}

export default {
  name: 'explorviz-frontend-extension-tutorial',
  initialize: initialize
};
