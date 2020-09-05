var app = angular.module('myApp', [])

var client = redis.createClient("redis://h:p8c68d0e7f47095a44f5b697ca26701acbd511ff4868cadae2edec441649dac5f@ec2-52-30-112-189.eu-west-1.compute.amazonaws.com:11209");
// redis.on('connect', function () {
//     console.log('redis connected');
// });

app.controller('myController', ['$scope', function(scope){
    scope.myData = "Some data here"
}])

