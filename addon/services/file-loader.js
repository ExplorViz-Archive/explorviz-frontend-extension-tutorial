import Service from '@ember/service';
import ENV from 'explorviz-frontend/config/environment';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { inject as service } from "@ember/service";
import debugLogger from 'ember-debug-logger';

export default Service.extend(FileSaverMixin, AlertifyHandler, {

  debug: debugLogger(),

  store: service(),
  tutorialService: service(),
  session: service(),
  ajax: service('ajax'),

  fileExtension: ".json",

  //downloads a tutorial from the backend
  downloadTutorial(tutorialId) {

    const self = this;

    const { access_token } = this.get('session.data.authenticated');

    //const urlPath = `/v1/tutorials/${tutorialId}`;
    const urlPath = `/v1/tutorials/${tutorialId}/download`;
    const savedFileName = tutorialId + this.get('fileExtension');
    const url = `${ENV.APP.API_ROOT}${urlPath}`

    this.get('ajax').raw(url, {
      'id': this,
      headers: { 'Authorization': `Basic ${access_token}` },
      dataType: 'text',
      options: {
        arraybuffer: true
      }
    }
    ).then((content) => {
      // this.saveFileAs(savedFileName, content.payload, 'application/vnd.api+json');
      this.saveFileAs(savedFileName, content.payload, 'application/json');
      self.showAlertifySuccess("Tutorial with id [" + tutorialId + "] downloaded!");
      this.debug("Tutorial with id [" + tutorialId + "] downloaded!");
    }).catch((error) => {
      self.showAlertifyError(error.text);
      this.debug("Could not download tutorial with id [" + tutorialId + "]", error.text);
      throw new Error("Could not download tutorial with id [" + tutorialId + "]. Enable debugging in console");
    });
  },

  // uploads a tutorial from the client to the backend and pushes the response into the store
  uploadTutorial(evt) {

    const self = this;

    let { access_token } = this.get('session.data.authenticated');

    const urlPath = `/v1/tutorials/upload`;
    const url = `${ENV.APP.API_ROOT}${urlPath}`;

    const file = evt.target.files[0];

    const fd = new FormData();
    fd.append('file', file);

    // use dataType: "text" since Ember-Ajax expects a JSON
    // response by default and a simple HTTP 200 response would throw
    // an error
    this.get('ajax').raw(url, {
      method: 'POST',
      data: fd,
      processData: false,
      contentType: false,
      headers: { 'Authorization': `Basic ${access_token}` },
      dataType: "text"
    }).then((payload) => {
      const jsonTutorial = payload.jqXHR.responseText;
      const parsedTutorial = JSON.parse(jsonTutorial);
      self.get('store').push(parsedTutorial);

      self.showAlertifySuccess("Tutorial sucessfully uploaded!");
      this.debug("Tutorial sucessfully uploaded!");
    }).catch((error) => {
      self.showAlertifyError(error.payload.errors[0].detail);
      this.debug("Could not upload tutorial.", error.payload.errors[0].detail);
      throw new Error("Could not upload tutorial. Enable debugging in console");
    });
  },

});