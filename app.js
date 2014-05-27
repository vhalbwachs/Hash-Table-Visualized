(function() {
  var app = angular.module('hashTable', []);
  app.controller('hashControl', function ($scope) {

    $scope.HashTable = function(){
      this._size = 0;
      this._limit = 8;
      this._storage = $scope.makeLimitedArray(this._limit);
      console.log(this._storage);
    };

    $scope.HashTable.prototype.insert = function(k, v){
      var i = $scope.getIndexBelowMaxForKey(k, this._limit);
      var tupleArray = this._storage.get(i) || [];

      for( var j = 0; j < tupleArray.length; j++ ){
        var tuple = tupleArray[j];
        if( tuple[0] === k ){
          tuple[1] = v;
          return;
        }
      }

      tupleArray.push([k,v]); // only if key is not in tupleArray
      this._size++;
      if( this._size > this._limit * 0.75 ){
        this.resize(this._limit*2);
      }

      this._storage.set(i, tupleArray);
    };

    $scope.HashTable.prototype.retrieve = function(k){
      var i = getIndexBelowMaxForKey(k, this._limit);
      var tupleArray = this._storage.get(i) || [];

      for( var j = 0; j < tupleArray.length; j++ ){
        var tuple = tupleArray[j];
        if( tuple[0] === k ){
          return tuple[1];
        }
      }

      return null;
    };

    $scope.HashTable.prototype.remove = function(k){
      var i = getIndexBelowMaxForKey(k, this._limit);
      var tupleArray = this._storage.get(i) || [];

      for( var j = 0; j < tupleArray.length; j++ ){
        var tuple = tupleArray[j];
        if( tuple[0] === k ){
          tupleArray.splice(j, 1);
          this._size--;
          if( this._size < this._limit * 0.25 ){
            this.resize(Math.floor(this._limit/2));
          }
          return tuple[1];
        }
      }
    };

    $scope.HashTable.prototype.resize = function(newSize){
      var oldStorage = this._storage;
      this._storage = $scope.makeLimitedArray(newSize);
      this._limit = newSize;
      this._size = 0;

      var self = this;

      oldStorage.each(function(tupleArray){
        if( !tupleArray ){ return; }
        for( var i = 0; i < tupleArray.length; i++ ){
          var tuple = tupleArray[i];
          self.insert(tuple[0], tuple[1])
        }
      });
    };

    $scope.makeLimitedArray = function(limit){

      var limitedArray = {};
      limitedArray.storage = [];
      for (var i = 0; i < limit; i++) {
        limitedArray.storage[i] = "";
      };
      limitedArray.get = function(index){
        checkLimit(index);
        return this.storage[index];
      };
      limitedArray.set = function(index, value){
        checkLimit(index);
        this.storage[index] = value;
      };
      limitedArray.each = function(callback){
        for(var i = 0; i < this.storage.length; i++){
          callback(this.storage[i], i, this.storage);
        }
      };

      var checkLimit = function(index){
        if(typeof index !== 'number'){ throw new Error('setter requires a numeric index for its first argument'); }
        if(limit <= index){ throw new Error('Error trying to access an over-the-limit index'); }
      };

      return limitedArray;
    };

    // This is a "hashing function". You don't need to worry about it, just use it
    // to turn any string into an integer that is well-distributed between the
    // numbers 0 and `max`
    $scope.getIndexBelowMaxForKey = function(str, max){
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = (hash<<5) + hash + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
        hash = Math.abs(hash);
      }
      return hash % max;
    };
    $scope.newValue;
    $scope.newKey;

    $scope.ht = new $scope.HashTable();  
  });
})();