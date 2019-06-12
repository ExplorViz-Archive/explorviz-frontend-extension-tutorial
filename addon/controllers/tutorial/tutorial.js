import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Controller.extend(AlertifyHandler,{
  tutorialService:service(),
  landscapeService:service(),
});
