// MarionetteJS (Backbone.Marionette)
// ----------------------------------
// v1.1.0
//
// Copyright (c)2013 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://marionettejs.com

/*!
 * Includes BabySitter
 * https://github.com/marionettejs/backbone.babysitter/
 *
 * Includes Wreqr
 * https://github.com/marionettejs/backbone.wreqr/
 */

(function(e,t){if(typeof exports=="object"){var n=require("underscore"),r=require("backbone"),i=require("backbone.wreqr"),s=require("backbone.babysitter");module.exports=t(n,r,i,s)}else typeof define=="function"&&define.amd&&define(["underscore","backbone","backbone.wreqr","backbone.babysitter"],t)})(this,function(e,t){var n=function(e,t,n){function s(e){return i.call(e)}function o(e,t){var n=new Error(e);throw n.name=t||"Error",n}var r={};t.Marionette=r,r.$=t.$;var i=Array.prototype.slice;return r.extend=t.Model.extend,r.getOption=function(e,t){if(!e||!t)return;var n;return e.options&&t in e.options&&e.options[t]!==undefined?n=e.options[t]:n=e[t],n},r.triggerMethod=function(){function t(e,t,n){return n.toUpperCase()}var e=/(^|:)(\w)/gi,r=function(r){var i="on"+r.replace(e,t),s=this[i];n.isFunction(this.trigger)&&this.trigger.apply(this,arguments);if(n.isFunction(s))return s.apply(this,n.tail(arguments))};return r}(),r.MonitorDOMRefresh=function(){function e(e){e._isShown=!0,r(e)}function t(e){e._isRendered=!0,r(e)}function r(e){e._isShown&&e._isRendered&&n.isFunction(e.triggerMethod)&&e.triggerMethod("dom:refresh")}return function(n){n.listenTo(n,"show",function(){e(n)}),n.listenTo(n,"render",function(){t(n)})}}(),function(e){function t(e,t,r,i){var s=i.split(/\s+/);n.each(s,function(n){var i=e[n];i||o("Method '"+n+"' was configured as an event handler, but does not exist."),e.listenTo(t,r,i,e)})}function r(e,t,n,r){e.listenTo(t,n,r,e)}function i(e,t,r,i){var s=i.split(/\s+/);n.each(s,function(n){var i=e[n];e.stopListening(t,r,i,e)})}function s(e,t,n,r){e.stopListening(t,n,r,e)}function u(e,t,r,i,s){if(!t||!r)return;n.isFunction(r)&&(r=r.call(e)),n.each(r,function(r,o){n.isFunction(r)?i(e,t,o,r):s(e,t,o,r)})}e.bindEntityEvents=function(e,n,i){u(e,n,i,r,t)},e.unbindEntityEvents=function(e,t,n){u(e,t,n,s,i)}}(r),r.Callbacks=function(){this._deferred=r.$.Deferred(),this._callbacks=[]},n.extend(r.Callbacks.prototype,{add:function(e,t){this._callbacks.push({cb:e,ctx:t}),this._deferred.done(function(n,r){t&&(n=t),e.call(n,r)})},run:function(e,t){this._deferred.resolve(t,e)},reset:function(){var e=this._callbacks;this._deferred=r.$.Deferred(),this._callbacks=[],n.each(e,function(e){this.add(e.cb,e.ctx)},this)}}),r.Controller=function(e){this.triggerMethod=r.triggerMethod,this.options=e||{},n.isFunction(this.initialize)&&this.initialize(this.options)},r.Controller.extend=r.extend,n.extend(r.Controller.prototype,t.Events,{close:function(){this.stopListening(),this.triggerMethod("close"),this.unbind()}}),r.Region=function(e){this.options=e||{},this.el=r.getOption(this,"el");if(!this.el){var t=new Error("An 'el' must be specified for a region.");throw t.name="NoElError",t}if(this.initialize){var n=Array.prototype.slice.apply(arguments);this.initialize.apply(this,n)}},n.extend(r.Region,{buildRegion:function(e,t){var r=typeof e=="string",i=typeof e.selector=="string",s=typeof e.regionType=="undefined",o=typeof e=="function";if(!o&&!r&&!i)throw new Error("Region must be specified as a Region type, a selector string or an object with selector property");var u,a;r&&(u=e),e.selector&&(u=e.selector),o&&(a=e),!o&&s&&(a=t),e.regionType&&(a=e.regionType);var f=new a({el:u});return e.parentEl&&(f.getEl=function(t){var r=e.parentEl;return n.isFunction(r)&&(r=r()),r.find(t)}),f}}),n.extend(r.Region.prototype,t.Events,{show:function(e){this.ensureEl();var t=e.isClosed||n.isUndefined(e.$el),i=e!==this.currentView;i&&this.close(),e.render(),(i||t)&&this.open(e),this.currentView=e,r.triggerMethod.call(this,"show",e),r.triggerMethod.call(e,"show")},ensureEl:function(){if(!this.$el||this.$el.length===0)this.$el=this.getEl(this.el)},getEl:function(e){return r.$(e)},open:function(e){this.$el.empty().append(e.el)},close:function(){var e=this.currentView;if(!e||e.isClosed)return;e.close?e.close():e.remove&&e.remove(),r.triggerMethod.call(this,"close"),delete this.currentView},attachView:function(e){this.currentView=e},reset:function(){this.close(),delete this.$el}}),r.Region.extend=r.extend,r.RegionManager=function(e){var t=e.Controller.extend({constructor:function(t){this._regions={},e.Controller.prototype.constructor.call(this,t)},addRegions:function(e,t){var r={};return n.each(e,function(e,i){typeof e=="string"&&(e={selector:e}),e.selector&&(e=n.defaults({},e,t));var s=this.addRegion(i,e);r[i]=s},this),r},addRegion:function(t,r){var i,s=n.isObject(r),o=n.isString(r),u=!!r.selector;return o||s&&u?i=e.Region.buildRegion(r,e.Region):n.isFunction(r)?i=e.Region.buildRegion(r,e.Region):i=r,this._store(t,i),this.triggerMethod("region:add",t,i),i},get:function(e){return this._regions[e]},removeRegion:function(e){var t=this._regions[e];this._remove(e,t)},removeRegions:function(){n.each(this._regions,function(e,t){this._remove(t,e)},this)},closeRegions:function(){n.each(this._regions,function(e,t){e.close()},this)},close:function(){this.removeRegions();var t=Array.prototype.slice.call(arguments);e.Controller.prototype.close.apply(this,t)},_store:function(e,t){this._regions[e]=t,this._setLength()},_remove:function(e,t){t.close(),delete this._regions[e],this._setLength(),this.triggerMethod("region:remove",e,t)},_setLength:function(){this.length=n.size(this._regions)}}),r=["forEach","each","map","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","toArray","first","initial","rest","last","without","isEmpty","pluck"];return n.each(r,function(e){t.prototype[e]=function(){var t=n.values(this._regions),r=[t].concat(n.toArray(arguments));return n[e].apply(n,r)}}),t}(r),r.TemplateCache=function(e){this.templateId=e},n.extend(r.TemplateCache,{templateCaches:{},get:function(e){var t=this.templateCaches[e];return t||(t=new r.TemplateCache(e),this.templateCaches[e]=t),t.load()},clear:function(){var e,t=s(arguments),n=t.length;if(n>0)for(e=0;e<n;e++)delete this.templateCaches[t[e]];else this.templateCaches={}}}),n.extend(r.TemplateCache.prototype,{load:function(){if(this.compiledTemplate)return this.compiledTemplate;var e=this.loadTemplate(this.templateId);return this.compiledTemplate=this.compileTemplate(e),this.compiledTemplate},loadTemplate:function(e){var t=window.App.helpers.unescape(r.$(e).html());return(!t||t.length===0)&&o("Could not find template: '"+e+"'","NoTemplateError"),t},compileTemplate:function(e){return n.template(e)}}),r.Renderer={render:function(e,t){if(!e){var n=new Error("Cannot render the template since it's false, null or undefined.");throw n.name="TemplateNotFoundError",n}var i;return typeof e=="function"?i=e:i=r.TemplateCache.get(e),i(t)}},r.View=t.View.extend({constructor:function(){n.bindAll(this,"render");var e=Array.prototype.slice.apply(arguments);t.View.prototype.constructor.apply(this,e),r.MonitorDOMRefresh(this),this.listenTo(this,"show",this.onShowCalled,this)},triggerMethod:r.triggerMethod,getTemplate:function(){return r.getOption(this,"template")},mixinTemplateHelpers:function(e){e=e||{};var t=r.getOption(this,"templateHelpers");return n.isFunction(t)&&(t=t.call(this)),n.extend(e,t)},configureTriggers:function(){if(!this.triggers)return;var e={},t=n.result(this,"triggers");return n.each(t,function(t,n){e[n]=function(e){e&&e.preventDefault&&e.preventDefault(),e&&e.stopPropagation&&e.stopPropagation();var n={view:this,model:this.model,collection:this.collection};this.triggerMethod(t,n)}},this),e},delegateEvents:function(e){this._delegateDOMEvents(e),r.bindEntityEvents(this,this.model,r.getOption(this,"modelEvents")),r.bindEntityEvents(this,this.collection,r.getOption(this,"collectionEvents"))},_delegateDOMEvents:function(e){e=e||this.events,n.isFunction(e)&&(e=e.call(this));var r={},i=this.configureTriggers();n.extend(r,e,i),t.View.prototype.delegateEvents.call(this,r)},undelegateEvents:function(){var e=Array.prototype.slice.call(arguments);t.View.prototype.undelegateEvents.apply(this,e),r.unbindEntityEvents(this,this.model,r.getOption(this,"modelEvents")),r.unbindEntityEvents(this,this.collection,r.getOption(this,"collectionEvents"))},onShowCalled:function(){},close:function(){if(this.isClosed)return;var e=this.triggerMethod("before:close");if(e===!1)return;this.isClosed=!0,this.triggerMethod("close"),this.unbindUIElements(),this.remove()},bindUIElements:function(){if(!this.ui)return;this._uiBindings||(this._uiBindings=this.ui);var e=n.result(this,"_uiBindings");this.ui={},n.each(n.keys(e),function(t){var n=e[t];this.ui[t]=this.$(n)},this)},unbindUIElements:function(){if(!this.ui||!this._uiBindings)return;n.each(this.ui,function(e,t){delete this.ui[t]},this),this.ui=this._uiBindings,delete this._uiBindings}}),r.ItemView=r.View.extend({constructor:function(){r.View.prototype.constructor.apply(this,s(arguments))},serializeData:function(){var e={};return this.model?e=this.model.toJSON():this.collection&&(e={items:this.collection.toJSON()}),e},render:function(){this.isClosed=!1,this.triggerMethod("before:render",this),this.triggerMethod("item:before:render",this);var e=this.serializeData();e=this.mixinTemplateHelpers(e);var t=this.getTemplate(),n=r.Renderer.render(t,e);return this.$el.html(n),this.bindUIElements(),this.triggerMethod("render",this),this.triggerMethod("item:rendered",this),this},close:function(){if(this.isClosed)return;this.triggerMethod("item:before:close"),r.View.prototype.close.apply(this,s(arguments)),this.triggerMethod("item:closed")}}),r.CollectionView=r.View.extend({itemViewEventPrefix:"itemview",constructor:function(e){this._initChildViewStorage(),r.View.prototype.constructor.apply(this,s(arguments)),this._initialEvents()},_initialEvents:function(){this.collection&&(this.listenTo(this.collection,"add",this.addChildView,this),this.listenTo(this.collection,"remove",this.removeItemView,this),this.listenTo(this.collection,"reset",this.render,this))},addChildView:function(e,t,n){this.closeEmptyView();var r=this.getItemView(e),i=this.collection.indexOf(e);this.addItemView(e,r,i)},onShowCalled:function(){this.children.each(function(e){r.triggerMethod.call(e,"show")})},triggerBeforeRender:function(){this.triggerMethod("before:render",this),this.triggerMethod("collection:before:render",this)},triggerRendered:function(){this.triggerMethod("render",this),this.triggerMethod("collection:rendered",this)},render:function(){return this.isClosed=!1,this.triggerBeforeRender(),this._renderChildren(),this.triggerRendered(),this},_renderChildren:function(){this.closeEmptyView(),this.closeChildren(),this.collection&&this.collection.length>0?this.showCollection():this.showEmptyView()},showCollection:function(){var e;this.collection.each(function(t,n){e=this.getItemView(t),this.addItemView(t,e,n)},this)},showEmptyView:function(){var e=r.getOption(this,"emptyView");if(e&&!this._showingEmptyView){this._showingEmptyView=!0;var n=new t.Model;this.addItemView(n,e,0)}},closeEmptyView:function(){this._showingEmptyView&&(this.closeChildren(),delete this._showingEmptyView)},getItemView:function(e){var t=r.getOption(this,"itemView");return t||o("An `itemView` must be specified","NoItemViewError"),t},addItemView:function(e,t,i){var s=r.getOption(this,"itemViewOptions");n.isFunction(s)&&(s=s.call(this,e,i));var o=this.buildItemView(e,t,s);this.addChildViewEventForwarding(o),this.triggerMethod("before:item:added",o),this.children.add(o),this.renderItemView(o,i),this._isShown&&r.triggerMethod.call(o,"show"),this.triggerMethod("after:item:added",o)},addChildViewEventForwarding:function(e){var t=r.getOption(this,"itemViewEventPrefix");this.listenTo(e,"all",function(){var n=s(arguments);n[0]=t+":"+n[0],n.splice(1,0,e),r.triggerMethod.apply(this,n)},this)},renderItemView:function(e,t){e.render(),this.appendHtml(this,e,t)},buildItemView:function(e,t,r){var i=n.extend({model:e},r);return new t(i)},removeItemView:function(e){var t=this.children.findByModel(e);this.removeChildView(t),this.checkEmpty()},removeChildView:function(e){e&&(this.stopListening(e),e.close?e.close():e.remove&&e.remove(),this.children.remove(e)),this.triggerMethod("item:removed",e)},checkEmpty:function(){(!this.collection||this.collection.length===0)&&this.showEmptyView()},appendHtml:function(e,t,n){e.$el.append(t.el)},_initChildViewStorage:function(){this.children=new t.ChildViewContainer},close:function(){if(this.isClosed)return;this.triggerMethod("collection:before:close"),this.closeChildren(),this.triggerMethod("collection:closed"),r.View.prototype.close.apply(this,s(arguments))},closeChildren:function(){this.children.each(function(e){this.removeChildView(e)},this),this.checkEmpty()}}),r.CompositeView=r.CollectionView.extend({constructor:function(){r.CollectionView.prototype.constructor.apply(this,s(arguments))},_initialEvents:function(){this.collection&&(this.listenTo(this.collection,"add",this.addChildView,this),this.listenTo(this.collection,"remove",this.removeItemView,this),this.listenTo(this.collection,"reset",this._renderChildren,this))},getItemView:function(e){var t=r.getOption(this,"itemView")||this.constructor;return t||o("An `itemView` must be specified","NoItemViewError"),t},serializeData:function(){var e={};return this.model&&(e=this.model.toJSON()),e},render:function(){this.isRendered=!0,this.isClosed=!1,this.resetItemViewContainer(),this.triggerBeforeRender();var e=this.renderModel();return this.$el.html(e),this.bindUIElements(),this.triggerMethod("composite:model:rendered"),this._renderChildren(),this.triggerMethod("composite:rendered"),this.triggerRendered(),this},_renderChildren:function(){this.isRendered&&(r.CollectionView.prototype._renderChildren.call(this),this.triggerMethod("composite:collection:rendered"))},renderModel:function(){var e={};e=this.serializeData(),e=this.mixinTemplateHelpers(e);var t=this.getTemplate();return r.Renderer.render(t,e)},appendHtml:function(e,t,n){var r=this.getItemViewContainer(e);r.append(t.el)},getItemViewContainer:function(e){if("$itemViewContainer"in e)return e.$itemViewContainer;var t,i=r.getOption(e,"itemViewContainer");if(i){var s=n.isFunction(i)?i():i;t=e.$(s),t.length<=0&&o("The specified `itemViewContainer` was not found: "+e.itemViewContainer,"ItemViewContainerMissingError")}else t=e.$el;return e.$itemViewContainer=t,t},resetItemViewContainer:function(){this.$itemViewContainer&&delete this.$itemViewContainer}}),r.Layout=r.ItemView.extend({regionType:r.Region,constructor:function(e){e=e||{},this._firstRender=!0,this._initializeRegions(e),r.ItemView.prototype.constructor.call(this,e)},render:function(){this.isClosed&&this._initializeRegions(),this._firstRender?this._firstRender=!1:this.isClosed||this._reInitializeRegions();var e=Array.prototype.slice.apply(arguments),t=r.ItemView.prototype.render.apply(this,e);return t},close:function(){if(this.isClosed)return;this.regionManager.close();var e=Array.prototype.slice.apply(arguments);r.ItemView.prototype.close.apply(this,e)},addRegion:function(e,t){var n={};return n[e]=t,this._buildRegions(n)[e]},addRegions:function(e){return this.regions=n.extend({},this.regions,e),this._buildRegions(e)},removeRegion:function(e){return delete this.regions[e],this.regionManager.removeRegion(e)},_buildRegions:function(e){var t=this,n={regionType:r.getOption(this,"regionType"),parentEl:function(){return t.$el}};return this.regionManager.addRegions(e,n)},_initializeRegions:function(e){var t;this._initRegionManager(),n.isFunction(this.regions)?t=this.regions(e):t=this.regions||{},this.addRegions(t)},_reInitializeRegions:function(){this.regionManager.closeRegions(),this.regionManager.each(function(e){e.reset()})},_initRegionManager:function(){this.regionManager=new r.RegionManager,this.listenTo(this.regionManager,"region:add",function(e,t){this[e]=t,this.trigger("region:add",e,t)}),this.listenTo(this.regionManager,"region:remove",function(e,t){delete this[e],this.trigger("region:remove",e,t)})}}),r.AppRouter=t.Router.extend({constructor:function(e){t.Router.prototype.constructor.apply(this,s(arguments)),this.options=e||{};var n=r.getOption(this,"appRoutes"),i=this._getController();this.processAppRoutes(i,n)},appRoute:function(e,t){var n=this._getController();this._addAppRoute(n,e,t)},processAppRoutes:function(e,t){if(!t)return;var r=n.keys(t).reverse();n.each(r,function(n){this._addAppRoute(e,n,t[n])},this)},_getController:function(){return r.getOption(this,"controller")},_addAppRoute:function(e,t,r){var i=e[r];if(!i)throw new Error("Method '"+r+"' was not found on the controller");this.route(t,r,n.bind(i,e))}}),r.Application=function(e){this._initRegionManager(),this._initCallbacks=new r.Callbacks,this.vent=new t.Wreqr.EventAggregator,this.commands=new t.Wreqr.Commands,this.reqres=new t.Wreqr.RequestResponse,this.submodules={},n.extend(this,e),this.triggerMethod=r.triggerMethod},n.extend(r.Application.prototype,t.Events,{execute:function(){var e=Array.prototype.slice.apply(arguments);this.commands.execute.apply(this.commands,e)},request:function(){var e=Array.prototype.slice.apply(arguments);return this.reqres.request.apply(this.reqres,e)},addInitializer:function(e){this._initCallbacks.add(e)},start:function(e){this.triggerMethod("initialize:before",e),this._initCallbacks.run(e,this),this.triggerMethod("initialize:after",e),this.triggerMethod("start",e)},addRegions:function(e){return this._regionManager.addRegions(e)},closeRegions:function(){this._regionManager.closeRegions()},removeRegion:function(e){this._regionManager.removeRegion(e)},getRegion:function(e){return this._regionManager.get(e)},module:function(e,t){var n=s(arguments);return n.unshift(this),r.Module.create.apply(r.Module,n)},_initRegionManager:function(){this._regionManager=new r.RegionManager,this.listenTo(this._regionManager,"region:add",function(e,t){this[e]=t}),this.listenTo(this._regionManager,"region:remove",function(e,t){delete this[e]})}}),r.Application.extend=r.extend,r.Module=function(e,t){this.moduleName=e,this.submodules={},this._setupInitializersAndFinalizers(),this.app=t,this.startWithParent=!0,this.triggerMethod=r.triggerMethod},n.extend(r.Module.prototype,t.Events,{addInitializer:function(e){this._initializerCallbacks.add(e)},addFinalizer:function(e){this._finalizerCallbacks.add(e)},start:function(e){if(this._isInitialized)return;n.each(this.submodules,function(t){t.startWithParent&&t.start(e)}),this.triggerMethod("before:start",e),this._initializerCallbacks.run(e,this),this._isInitialized=!0,this.triggerMethod("start",e)},stop:function(){if(!this._isInitialized)return;this._isInitialized=!1,r.triggerMethod.call(this,"before:stop"),n.each(this.submodules,function(e){e.stop()}),this._finalizerCallbacks.run(undefined,this),this._initializerCallbacks.reset(),this._finalizerCallbacks.reset(),r.triggerMethod.call(this,"stop")},addDefinition:function(e,t){this._runModuleDefinition(e,t)},_runModuleDefinition:function(e,i){if(!e)return;var s=n.flatten([this,this.app,t,r,r.$,n,i]);e.apply(this,s)},_setupInitializersAndFinalizers:function(){this._initializerCallbacks=new r.Callbacks,this._finalizerCallbacks=new r.Callbacks}}),n.extend(r.Module,{create:function(e,t,r){var i=e,o=s(arguments);o.splice(0,3),t=t.split(".");var u=t.length,a=[];return a[u-1]=r,n.each(t,function(t,n){var r=i;i=this._getModule(r,t,e),this._addModuleDefinition(r,i,a[n],o)},this),i},_getModule:function(e,t,n,i,s){var o=e[t];return o||(o=new r.Module(t,n),e[t]=o,e.submodules[t]=o),o},_addModuleDefinition:function(e,t,r,i){var s,o;n.isFunction(r)?(s=r,o=!0):n.isObject(r)?(s=r.define,o=r.startWithParent):o=!0,s&&t.addDefinition(s,i),t.startWithParent=t.startWithParent&&o,t.startWithParent&&!t.startWithParentIsConfigured&&(t.startWithParentIsConfigured=!0,e.addInitializer(function(e){t.startWithParent&&t.start(e)}))}}),r}(this,t,e);return t.Marionette});