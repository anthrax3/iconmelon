(function(){var e=this,t={}.hasOwnProperty,n=function(e,n){function i(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return i.prototype=n.prototype,e.prototype=new i,e.__super__=n.prototype,e};define("collections/FiltersCollection",["backbone","models/FilterModel"],function(e,t){var r,i;return r=function(e){function r(){return i=r.__super__.constructor.apply(this,arguments),i}return n(r,e),r.prototype.model=t,r.prototype.url="filters",r}(e.Collection),r})}).call(this);