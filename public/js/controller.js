var ngapp = angular.module('todo-app', []);
ngapp.controller('todo-controller', function($scope) {
  $scope.logout = () => {
    window.location = "http://localhost:8080/logout";
  }
  $scope.ngsavetodo = () => {
      alert("ng-logout");
  }
  $scope.nggettodo = () => {
    alert("yay");
  }
});
