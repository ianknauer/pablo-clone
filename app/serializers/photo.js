import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  // This is necessary because the search returns everything nested under results
  
  normalizeQueryResponse: function(store, primaryModelClass, payload, id, requestType) {
    if(payload.results) {
      payload = payload.results;
    }
    return this._super(store, primaryModelClass, payload, id, requestType);
  },
  
  // normalizeArray and normalizeSingle are both used to pull the urls out of their nesting and bring them into the main object. 
  // Ember Data uses the JSONApi Spec, which is pretty specific on how things should be set up. It didn't like the default nesting 
  // for how unsplash returned the content. 

  normalizeArrayResponse: function(store, primaryModelClass, payload, id, requestType) {
    for (var i=0; i < payload.length; i++) {  
      payload[i].thumb_url = payload[i].urls.thumb;
      payload[i].regular_url = payload[i].urls.regular;
      payload[i].postcard_id = 1;
    }
    return this._super(store, primaryModelClass, payload, id, requestType);
  },

  normalizeSingleResponse: function(store, primaryModelClass, payload, id, requestType) {
    payload.thumb_url = payload.urls.thumb;
    payload.regular_url = payload.urls.regular;
    payload.postcard_id = 1;

    return this._super(store, primaryModelClass, payload, id, requestType);
 }
});
