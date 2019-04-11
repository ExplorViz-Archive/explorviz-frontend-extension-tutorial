import JSONAPISerializer from 'ember-data/serializers/json-api';
import SaveRelationshipsMixin from 'ember-data-save-relationships';
 
export default JSONAPISerializer.extend(SaveRelationshipsMixin, {
  attrs: {
    landscape: { serialize: true }
  },
  serialize(snapshot, options) {
    let json = this._super(...arguments);
    json.data.attributes.landscape=JSON.stringify(json.data.relationships.landscape);
    delete json.data.relationships.landscape;
    return json;
  },
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    payload.data.relationships={};
    payload.data.relationships.landscape=JSON.parse(payload.data.attributes.landscape);
    console.log(payload);
    delete payload.data.attributes.landscape;
    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});