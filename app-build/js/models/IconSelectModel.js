(function(){var e={}.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define("models/IconSelectModel",["models/ProtoModel"],function(e){var n,r;return n=function(e){function n(){return r=n.__super__.constructor.apply(this,arguments),r}return t(n,e),n.prototype.defaults={selectedCounter:0},n.prototype.initialize=function(){return App.vent.on("icon:select",_.bind(this.refreshCounter,this)),n.__super__.initialize.apply(this,arguments),this},n.prototype.refreshCounter=function(){var e;return e=0,this.sectionsView.collection.each(function(t){return e+=t.iconsCollectionView.collection.selectedCnt||0}),this.set("selectedCounter",e+App.filtersSelected.length)},n}(e),n})}).call(this);