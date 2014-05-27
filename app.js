(function () {
  var app = angular.module('hashTable', ['ngAnimate', 'fx.animations']);
  app.controller('hashControl', function ($scope) {

    $scope.HashTable = function () {
      this._size = 0;
      this._limit = 4;
      this._storage = $scope.makeLimitedArray(this._limit);
    };

    $scope.HashTable.prototype.insert = function (k, v) {
      var i = $scope.getIndexBelowMaxForKey(k, this._limit);
      var tupleArray = this._storage.get(i) || [];

      for(var j = 0; j < tupleArray.length; j++){
        var tuple = tupleArray[j];
        if(tuple[0] === k){
          tuple[1] = v;
          return;
        }
      }

      tupleArray.push([k,v]); // only if key is not in tupleArray
      this._size++;
      this._storage.set(i, tupleArray);

      if(this._size > this._limit * 0.75){
        this.resize(this._limit*2);
      }

    };

    $scope.HashTable.prototype.retrieve = function (k) {
      var i = $scope.getIndexBelowMaxForKey(k, this._limit);
      var tupleArray = this._storage.get(i) || [];

      for(var j = 0; j < tupleArray.length; j++){
        var tuple = tupleArray[j];
        if(tuple[0] === k){
          alert('Value: ' + tuple[1]);
          return null;
        }
      }
      alert('Value not found.');
      return null;
    };

    $scope.HashTable.prototype.remove = function (k) {
      var i = $scope.getIndexBelowMaxForKey(k, this._limit);
      var tupleArray = this._storage.get(i) || [];

      for(var j = 0; j < tupleArray.length; j++){
        var tuple = tupleArray[j];
        if(tuple[0] === k){
          tupleArray.splice(j, 1);
          this._size--;
          if(this._size < this._limit * 0.25){
            this.resize(Math.floor(this._limit/2));
          }
        }
      }
    };

    $scope.HashTable.prototype.resize = function (newSize) {
      var oldStorage = this._storage;
      this._storage = $scope.makeLimitedArray(newSize);
      this._limit = newSize;
      this._size = 0;

      var self = this;

      oldStorage.each(function (tupleArray) {
        if(!tupleArray){ return; }
        for(var i = 0; i < tupleArray.length; i++){
          var tuple = tupleArray[i];
          self.insert(tuple[0], tuple[1])
        }
      });
    };

    $scope.makeLimitedArray = function (limit) {
      var limitedArray = {};
      limitedArray.storage = [];
      for (var i = 0; i < limit; i++) {
        limitedArray.storage[i] = "";
      };
      limitedArray.get = function (index) {
        checkLimit(index);
        return this.storage[index];
      };
      limitedArray.set = function (index, value) {
        checkLimit(index);
        this.storage[index] = value;
      };
      limitedArray.each = function (callback) {
        for(var i = 0; i < this.storage.length; i++){
          callback(this.storage[i], i, this.storage);
        }
      };

      var checkLimit = function (index) {
        if(typeof index !== 'number') { throw new Error('setter requires a numeric index for its first argument'); }
        if(limit <= index) { throw new Error('Error trying to access an over-the-limit index'); }
      };

      return limitedArray;
    };

    $scope.getIndexBelowMaxForKey = function (str, max) {
      if (!str) {return false;}
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = (hash<<5) + hash + str.charCodeAt(i);
        hash = hash & hash;
        hash = Math.abs(hash);
      }
      return hash % max;
    };
    $scope.evalRowClass = function (val, index, limit) {
      if (this.getIndexBelowMaxForKey(val, limit) === index) {
        return "list-group-item-info"
      }
    };
    $scope.ht = new $scope.HashTable();
  });
})();