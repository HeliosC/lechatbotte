var app = angular.module('myApp', [])

app.controller('myController', ['$scope', function(scope){
    scope.myData = "Some data here"
}])

