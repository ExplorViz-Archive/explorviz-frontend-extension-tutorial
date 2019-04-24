import LandscapeSerializer from "explorviz-frontend/serializers/landscape"

export default LandscapeSerializer.extend({
  serialize(snapshot, options) {
    let json = this._super(...arguments);
    json.data.attributes.landscape=JSON.stringify(json);
    debugger;
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
    return this._super(store, primaryModelClass, json, id, requestType);
  }
});
