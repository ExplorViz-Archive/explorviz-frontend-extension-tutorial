import DS from 'ember-data';

export default DS.Model.extend({
  timestamp: DS.attr('String'),
  //landscape: DS.attr('String'),
  landscape: DS.belongsTo('landscape',{inverse: null}),
});
