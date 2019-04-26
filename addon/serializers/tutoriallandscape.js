// import LandscapeSerializer from "explorviz-frontend/serializers/landscape"
import SaveRelationshipsMixin from 'ember-data-save-relationships';
import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend(SaveRelationshipsMixin,{

  attrs: {
    events: { serialize: true },
    //systems: { serialize: true },
     totalApplicationCommunications: { serialize: true }
  },
  payloadKeyFromModelName(model){
    return model;
  },
  serialize(snapshot, options) {
    let json = this._super(...arguments);
    //debugger;
    json.data.attributes.landscape=JSON.stringify(json);
    json.data.relationships={};
    json.data.relationships.tutorialtimestamp={data:{type:'tutorialtimestamp',id:snapshot.record.get('timestamp').get('id')}};
    json.included=[{
      type:"tutorialtimestamp",
      id:snapshot.record.get('timestamp').get('id'),
      attributes: {
        name:snapshot.record.get('timestamp').get('name'),
        timestamp:snapshot.record.get('timestamp').get('timestamp')
      }
    }];
    return json;
  },
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    if(Array.isArray(payload.data)){
      var json = {data:[]};
     payload.data.forEach(function(v,k){
       json.data[k]=JSON.parse(v.attributes.landscape).data;
     });
    }else{
      var json = JSON.parse(payload.data.attributes.landscape);
    }
    if(Array.isArray(json.included)){
      if(Array.isArray(payload.included)){
        json.included=json.included+payload.included;
      }
    }else{
      if(payload.included!=undefined){
        json.included=payload.included;
      }
    }
    return this._super(store, primaryModelClass, json, id, requestType);
  }
});
