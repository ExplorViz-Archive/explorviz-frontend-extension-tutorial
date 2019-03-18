import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  model(params) {
        return this.store.findRecord('tutorial', params.tutorial_id);
  },
  actions: {
    // @Override BaseRoute
    resetRoute() {
      //const routeName = this.get('tutorial');
   },
   saveTutorialChanges() {
    const tutorialData = this.getProperties('tutorial_id_change', 'tutorial_title_change');

    const tutorial = this.get('tutorials').find( tutorial => tutorial.get('id') == tutorialData.tutorial_id_change);

    if(tutorial) {
      // check for valid input
      if(!tutorialData.tutorial_title_change || tutorialData.tutorial_title_change.length === 0) {
        this.showAlertifyMessage('Title cannot be empty.');
        return;
      }

      if(tutorial.get('title') !== tutorialData.tutorial_title_change)
      tutorial.set('title', tutorialData.tutorial_title_change);

      tutorial.save()
      .then(()=> {
        const message = `Tutorial updated.`;
        this.showAlertifyMessage(message);
        this.setProperties({
          tutorial_id_change: "",
          tutorial_title_change: ""
        });
        this.actions.openMainPage.bind(this)();
      }, (reason) => {
        this.showReasonErrorAlert(reason);
      });
    } else {
      this.showAlertifyMessage(`Tutorial not found.`);
    }
  },
  }

});