import LandscapeSerializer from "explorviz-frontend/serializers/landscape"
import SaveRelationshipsMixin from 'ember-data-save-relationships';
import JSONAPISerializer from 'ember-data/serializers/json-api';
import { inject as service } from "@ember/service";




export default LandscapeSerializer.extend(SaveRelationshipsMixin,{
  attrs: {
    systems: { serialize: true},
    totalApplicationCommunications: { serialize: true }
  },
  payloadKeyFromModelName(model){
    return model;
  },
  serializeRecordForIncluded(key,relationship){
    if(this.serializedTypes.indexOf(key)!==-1){
      return;
    }
    if (relationship.kind === 'belongsTo') {
      var nextSnapshot = this.belongsTo(key);
      nextSnapshot.serializedTypes=this.serializedTypes;
      nextSnapshot.included=this.included;
      this.serializedTypes.push(key);
      nextSnapshot.serializeRecordForIncluded=this.serializeRecordForIncluded;
      this.included.push(nextSnapshot.record.serialize({includeId:true}));
      nextSnapshot.eachRelationship(this.serializeRecordForIncluded,nextSnapshot)
      this.included.concat(nextSnapshot.included);
    }else if (relationship.kind === 'hasMany') {
      var self=this;
      var key=key;
      var hasmany=this.hasMany(key);
      hasmany.forEach(function(v){
          self.included.push(v.record.serialize({includeId:true}));
          hasmany.forEach(function(value){
            value.serializedTypes=self.serializedTypes;
            value.included=self.included;
            self.serializedTypes.push(key);
            value.serializeRecordForIncluded=self.serializeRecordForIncluded;
            value.eachRelationship(self.serializeRecordForIncluded,value);
            self.included.concat(value.included);
          });
      });
    }
  },
  serialize(snapshot, options) {
    let json = this._super(...arguments);
    var included=[];
    //json.included=[];
    // snapshot.hasMany('events').forEach(function(v,k){
    //   json.included.push(v.serialize());
    // });       

    snapshot.serializeRecordForIncluded=this.serializeRecordForIncluded;
    snapshot.serializedTypes=[];
    snapshot.included=[];
    snapshot.eachRelationship(this.serializeRecordForIncluded,snapshot);

    snapshot.hasMany('systems').forEach(function(v,k){
      delete json.data.relationships.systems.data[k].attributes.threeJSModel;
    });
    //snapshot.hasMany('events').forEach(function(v,k){
     // delete json.data.relationships.events.data[k].attributes.threeJSModel;
    //});
    snapshot.hasMany('totalApplicationCommunications').forEach(function(v,k){
      delete json.data.relationships.totalApplicationCommunications.data[k].attributes.threeJSModel;
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
json.included=snapshot.included;
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
    included:[
        {id: snapshot.record.get('timestamp').get('id'),
         type: "tutorialtimestamp",
         attributes:{
           timestamp:snapshot.record.get('timestamp').get('timestamp'),
           name:snapshot.record.get('timestamp').get('name')
          }
        }
    ]
 };
 debugger;
 debugger;
 debugger;
 debugger;


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
