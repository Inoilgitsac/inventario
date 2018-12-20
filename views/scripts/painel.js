var Item = angular.module('Item', []);
Item.controller('ItemCtrl', buscaObj);
var nomeobj;
function buscaObj($scope, $http, $window) {

  $http.get('/isAdmin')
    .then(function (response) {
      if (response.data[0].isAdmin === 1)
        $scope.isAdmin = true;
      else $scope.isAdmin = false;
    },
      function (response) {
        console.log('Error: ' + response);
      });

  $scope.isAdmin = false;

  $scope.painel = function () {
    $window.location.href = '/';
  }

  $scope.deslogar = function () {
    $window.location.href = '/logout';
  }

  $scope.registrarChegada = function () {
    $window.location.href = '/registrarChegada';
  }

  $scope.enviarItem = function () {
    $window.location.href = '/enviarItem';
  }

  $scope.localizarItem = function () {
    $window.location.href = '/localizarItem';
  }

  $scope.cadastrarItem = function () {
    $window.location.href = '/cadastrarItem';
  }

  $scope.editarItem = function () {
    $window.location.href = '/editarItem';
  }

  $scope.apagarItem = function () {
    $window.location.href = '/apagarItem';
  }

  $scope.criarUsuario = function () {
    $window.location.href = '/criarUsuario';
  }

};