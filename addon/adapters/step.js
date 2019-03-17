import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';

export default JSONAPIAdapter.extend(DataAdapterMixin,{

  host: ENV.APP.API_ROOT,

  init() {

    this.set('headers', {
      "Accept": "application/vnd.api+json"
    });

  },

  urlForUpdateRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/tutorials/steps/${id}`;
  },

  urlForDeleteRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/tutorials/steps/${id}`;
  },

  urlForFindAll() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/tutorials/steps/`;
  },
  // @Override
  urlForQueryRecord() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/tutorials/steps`;
  },
  urlForFindRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/tutorials/steps/${id}`;
  },

  // @Override
  // Overrides URL for model.save()
  urlForCreateRecord() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/tutorials/steps/`;
  },


  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  }

});
