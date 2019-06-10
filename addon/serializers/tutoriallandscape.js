import LandscapeSerializer from "explorviz-frontend/serializers/landscape"
import SaveRelationshipsMixin from 'ember-data-save-relationships';




export default LandscapeSerializer.extend(SaveRelationshipsMixin,{
  attrs: {
    systems:{serialize:true},
    totalApplicationCommunications:{serialize:true}
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
      if(nextSnapshot.record.threeJSModel!=undefined){
          nextSnapshot.record.set('threeJSModel', null);
      }
      if(this.serializedTypes.indexOf(key)==-1){
        this.serializedTypes.push(key);
        nextSnapshot.serializeRecordForIncluded=this.serializeRecordForIncluded;
        if(nextSnapshot.record.get('id')!=undefined){
          this.included.push(nextSnapshot.record.serialize({includeId:true}).data);
        }
        nextSnapshot.eachRelationship(this.serializeRecordForIncluded,nextSnapshot)
        this.included.concat(nextSnapshot.included);
      }
    }else if (relationship.kind === 'hasMany') {
      var self=this;
      var nkey=key;
      var hasmany=this.hasMany(nkey);
      hasmany.forEach(function(v){
        if(v.record.threeJSModel!=undefined){
            v.record.set('threeJSModel', null);
        }
        if(self.included==undefined){
          self.included=[];
        }
        if(v.record.get('id')!=undefined){
          self.included.push(v.record.serialize({includeId:true}).data);
          hasmany.forEach(function(value){
              value.serializedTypes=self.serializedTypes;
              value.included=self.included;
              if(self.serializedTypes.indexOf(nkey)==-1){
                self.serializedTypes.push(nkey);
              }
              value.serializeRecordForIncluded=self.serializeRecordForIncluded;
              value.eachRelationship(self.serializeRecordForIncluded,value);
              self.included.concat(value.included);
          });
        }
      });
    }
  },
  serialize(snapshot) {
    let json = this._super(...arguments);

    snapshot.serializeRecordForIncluded=this.serializeRecordForIncluded;
    snapshot.serializedTypes=[];
    snapshot.included=[];
    snapshot.eachRelationship(this.serializeRecordForIncluded,snapshot);

    snapshot.hasMany('systems').forEach(function(v,k){
      delete json.data.relationships.systems.data[k].attributes.threeJSModel;
    });

    snapshot.hasMany('totalApplicationCommunications').forEach(function(v,k){
      delete json.data.relationships.totalApplicationCommunications.data[k].attributes.threeJSModel;
    });

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
    return newjson;
  },
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    var json = {};
    if(Array.isArray(payload.data) ){
      json = {data:[]};
     payload.data.forEach(function(v,k){
       json.data[k]=JSON.parse(v.attributes.landscape).data;
       json.data[k].relationships.timestamp=v.relationships.timestamp;
     });
    }else{
      json = JSON.parse(payload.data.attributes.landscape);
      json.data.relationships.timestamp=payload.data.relationships.timestamp;
    }
    if(Array.isArray(json.included)){
      if(Array.isArray(payload.included)){
        json.included=json.included.concat(payload.included);
      }
    }else{
      if(payload.included!=undefined){
        json.included=payload.included;
      }
    }
  // if(requestType=="queryRecord"){
  //   json.data=json.data[0];
  //   return this._super(store, primaryModelClass, json, id, requestType);
  // }
    return this._super(store, primaryModelClass, json, id, requestType);
  }
});
