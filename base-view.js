module.exports = window.Backbone.View.extend({ attachView: attachView, getViewByModel: getViewByModel, remove: remove })

/*
 * Attach a child view to this view. Stores it for lookup by viewId
 * of the id of the model that it represents (if it has one).
 */
function attachView(view) {
  if (!this.views) this.views = { viewIds: {}, modelIds: {} }
  this.views.viewIds[view.cid] = view
  if (view.model) {
    this.views.modelIds[view.model[getIdProperty(view.model)]] = view
  }
}

/*
 * Get the view for a given model.
 */
function getViewByModel(model) {
  return this.views.modelIds[model[getIdProperty(model)]]
}

/*
 * Remove this view and all subviews.
 */
function remove() {

  // Dispose of any sub-views
  if (this.views) {
    Object.keys(this.views.viewIds).forEach(function (key) {
      this.views.viewIds[key].remove()
    }.bind(this))
  }

  // Alert listeners that this view is about to be removed
  this.trigger('remove')

  // finally, call Backbone's default remove method to remove the view from the DOM
  window.Backbone.View.prototype.remove.call(this)

}

function getIdProperty(model) {
  return (typeof model.id !== 'undefined' && model.id !== null) ? 'id' : 'cid'
}