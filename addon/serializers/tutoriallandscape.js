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

    json.included=[];
    // snapshot.hasMany('events').forEach(function(v,k){
    //   json.included.push(v.serialize());
    // });
    snapshot.hasMany('systems').forEach(function(v,k){
      debugger;
      json.included.push(v.serialize());
    });
    // snapshot.hasMany('totalApplicationCommunications').forEach(function(v,k){
    //   json.included.push(v.serialize());
    // });
// json.included.push({type:"tutorialtimestamp",
//     id:snapshot.record.get('timestamp').get('id'),
//     attributes: {
//       name:snapshot.record.get('timestamp').get('name'),
//       timestamp:snapshot.record.get('timestamp').get('timestamp')
//     }});
// json.data.relationships.timestamp={
//   type:"tutorialtimestamp",
//   id:snapshot.record.get('timestamp').get('id')
// };
    var newjson={
      data:{
        id: snapshot.record.get('id'),
        type: "tutoriallandscape",
        attributes:{
          landscape:JSON.stringify(json),
        },
        relationships:{
          timestamp:{
            data:{
              type:'tutorialtimestamp',
              id:snapshot.record.get('timestamp').get('id')
            }
          }
        }
    },
    included:[{
      type:"tutorialtimestamp",
      id:snapshot.record.get('timestamp').get('id'),
      attributes: {
        name:snapshot.record.get('timestamp').get('name'),
        timestamp:snapshot.record.get('timestamp').get('timestamp')
      }
    }]
 };
    return newjson;
  },
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    if(Array.isArray(payload.data)){
      var json = {data:[]};
     payload.data.forEach(function(v,k){
       json.data[k]=JSON.parse(v.attributes.landscape).data;
       json.data[k].relationships.timestamp=v.relationships.timestamp;
     });
    }else{
      var json = JSON.parse(payload.data.attributes.landscape);
      json.data.relationships.timestamp=payload.data.relationships.timestamp;
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
