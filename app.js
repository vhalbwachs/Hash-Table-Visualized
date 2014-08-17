(function(){
  angular.module('hashtable', ['ngAnimate', 'fx.animations'])
  .factory('HashTable', function ($timeout) {
    var ht = {};
    ht.size = 0;
    ht.limit = 2;
    ht.resizing = false;
    ht.storage = Array(ht.limit);
    ht.insert = function (k, v) {
      var i = this.getIndexBelowMaxForKey(k, this.limit);
      var tupleArray = this.storage[i] || [];

      for(var j = 0; j < tupleArray.length; j++){
        var tuple = tupleArray[j];
        if(tuple[0] === k){
          tuple[1] = v;
          return;
        }
      }

      tupleArray.push([k,v]); // only if key is not in tupleArray
      this.size++;
      this.storage[i] = tupleArray;
      if(this.size > this.limit * 0.75){
        this.resize(this.limit*2);
      }
    };
    ht.retrieve = function (k) {
      var i = this.getIndexBelowMaxForKey(k, this.limit);
      var tupleArray = this.storage[i] || [];

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
    ht.remove = function (k) {
      var i = this.getIndexBelowMaxForKey(k, this.limit);
      var tupleArray = this.storage[i] || [];

      for(var j = 0; j < tupleArray.length; j++){
        var tuple = tupleArray[j];
        if(tuple[0] === k){
          tupleArray.splice(j, 1);
          this.size--;
          if(this.size < this.limit * 0.25){
            this.resize(Math.floor(this.limit/2));
          }
        }
      }
    };
    ht.resize = function (newSize) {
      var oldStorage = this.storage;
      var counter = 0;
      var resolved = 0;
      var _this = this;
      this.storage = Array(newSize);
      this.limit = newSize;
      this.resizing = this.size !== 0; //handle case of removing last item and storage resizes to empty
      this.size = 0;
      oldStorage.forEach(function (tupleArray) {
        if(!tupleArray){ return; }
        tupleArray.forEach(function (tuple, j) {
            $timeout(function(){
              _this.insert(tuple[0], tuple[1])
              _this.resizing = ++resolved !== counter;
            }, 500 * ++counter);
        })
      });
    };
    ht.getIndexBelowMaxForKey = function (str, max) {
      if (!str) {return false;}
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = (hash<<5) + hash + str.charCodeAt(i);
        hash = hash & hash;
        hash = Math.abs(hash);
      }
      return hash % max;
    };
    return ht;
  })
  .controller('hashControl', function ($scope, HashTable, $timeout) {
    $scope.hashTable = HashTable;
  });
})();