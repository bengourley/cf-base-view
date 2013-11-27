require('./test-env')

var BaseView = require('../')
  , assert = require('assert')

describe('BaseView', function () {

  describe('attachView()', function () {

    it('should create the .views property if it doesn\'t yet exist', function () {
      var view = new BaseView()
        , childView = new window.Backbone.View()
      view.attachView(childView)
      assert(2, view.views.length)
    })

    it('should add the view to the view.viewIds hash', function () {
      var view = new BaseView()
        , childView = new window.Backbone.View()
      view.attachView(childView)
      assert.equal(childView, view.views.viewIds[childView.cid])
    })

    it('should add the view to the view.modelIds hash if it has a model', function () {
      var model = new window.Backbone.Model()
        , view = new BaseView()
        , childView = new window.Backbone.View({ model: model })
      view.attachView(childView)
      assert.equal(childView, view.views.modelIds[model.cid])
    })

    it('should use the model\'s proper id if it has one', function () {
      var model = new window.Backbone.Model({ id: '1234'})
        , view = new BaseView()
        , childView = new window.Backbone.View({ model: model })
      view.attachView(childView)
      assert.equal(childView, view.views.modelIds[model.id])
    })

    it('should add to the views property', function () {
      var model = new window.Backbone.Model({ id: '1234'})
        , view = new BaseView()
        , childView = new window.Backbone.View({ model: model })
      view.attachView(childView)
      view.attachView(new window.Backbone.View())
      assert.equal(2, Object.keys(view.views.viewIds).length)
      assert.equal(1, Object.keys(view.views.modelIds).length)
    })

  })

  describe('getViewByModel()', function () {

    it('should get a model with an id', function () {
      var model = new window.Backbone.Model({ id: '1234'})
        , view = new BaseView()
        , childView = new window.Backbone.View({ model: model })
      view.attachView(childView)
      assert.equal(childView, view.getViewByModel(model))
    })

    it('should get a model without an id', function () {
      var model = new window.Backbone.Model()
        , view = new BaseView()
        , childView = new window.Backbone.View({ model: model })
      view.attachView(childView)
      assert.equal(childView, view.getViewByModel(model))
    })

  })

  describe('remove()', function () {

    it('should call the remove() method of any child views', function (done) {

      var model = new window.Backbone.Model()
        , view = new BaseView()
        , childView = new window.Backbone.View({ model: model })

      childView.remove = function () {
        done()
      }

      view.attachView(childView)
      view.remove()

    })

    it('should be ok if there are no child views', function () {

      var view = new BaseView()
      view.remove()

    })

    it('should emit a remove event', function (done) {
      var view = new BaseView()
      view.on('remove', function () { done() })
      view.remove()
    })

    it('should call the Backbone.View.remove() method on itself', function (done) {
      var view = new BaseView()
      var oldRemove = window.Backbone.View.prototype.remove
      window.Backbone.View.prototype.remove = function () {
        assert.equal(view, this)
        window.Backbone.View.prototype.remove = oldRemove
        done()
      }
      view.remove()
    })

  })

})