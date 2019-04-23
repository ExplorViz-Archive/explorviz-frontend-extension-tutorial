import Service from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Service.extend(Evented,AlertifyHandler, {
  debug: debugLogger(),
  store: service(),
  landscapeService:service(),
  tutorialList: null,

  updateTutorialList(reload) {
    this.set('tutorialList', []);
    this.get('store').findAll('tutorial', { reload })
      .then(tutorials => {
        let tutorialList = tutorials.toArray();
        // sort by id
        tutorialList.sort((tutorial1, tutorial2) => parseInt(tutorial1.id) < parseInt(tutorial2.id) ? -1 : 1);
        this.set('tutorialList', tutorialList);
      });
  },
  saveTutorialChanges(tutorial) {
      if(tutorial) {
        // check for valid input
        if(!tutorial.get('title') || tutorial.get('title').length === 0) {
          this.showAlertifyMessage('Title cannot be empty.');
          return;
        }
        tutorial.save()
        .then(()=> {
          const message = `Tutorial updated.`;
          this.get('landscapeService').loadTutorialLandscape(tutorial);
          this.showAlertifyMessage(message);
        }, (reason) => {
          this.showReasonErrorAlert(reason);
        });
      } else {
        this.showAlertifyMessage(`Tutorial not found.`);
      }
    },
});
