(function(){var e={}.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define("views/IconView",["views/ProtoView","models/IconModel","underscore","jquery","helpers"],function(e,n,r,i,s){var o,u;return o=function(e){function r(){return u=r.__super__.constructor.apply(this,arguments),u}return t(r,e),r.prototype.model=n,r.prototype.template="#icon-view-template",r.prototype.className="icon-with-text-b",r.prototype.events={click:"toggleSelected"},r.prototype.initialize=function(e){return this.o=e!=null?e:{},this.bindModelEvents(),r.__super__.initialize.apply(this,arguments),this},r.prototype.bindModelEvents=function(){return this.model.on("change",this.render)},r.prototype.render=function(){return r.__super__.render.apply(this,arguments),this.$el.toggleClass("is-check",this.model.get("isSelected")),this.$el.toggleClass("h-gm",this.model.get("isFiltered")),this},r.prototype.toggleSelected=function(){return this.model.toggleSelected(),App.iconsSelected=s.toggleArray(App.iconsSelected,""+this.model.collection.parentModel.get("name")+":"+this.model.get("hash"))},r}(e),o})}).call(this);