var item = angular.module('item', []);
item.controller('itemCtrl', buscaObj);
function buscaObj($scope, $http) {

  $scope.Apagaritem = function () {
    if (typeof $scope.codbar != "undefined" && $scope.codbar != null && $scope.codbar != "") {
      var objAtt = {
        codbarra: $scope.codbar,
        obs: $scope.obs
      };
      $http.post('/apagarItem', objAtt)
        .then(function (response) {
          if (response.data.failed)
            console.log("Erro na execução da query.");
          else {
            alert("Item deletado com sucesso!");
          }
        },
          function (data) {
            console.log('Error: ' + data);
          });
    } else alert("Localize um item digitando o código de barras!")
  };

  $scope.buscaObj = function () {
    if (typeof $scope.codbar != "undefined" && $scope.codbar != null && $scope.codbar != "") {
      var isNum = /^\d+$/.test($scope.codbar);
      if (isNum) {
        var data = {
          codbarra: $scope.codbar
        };
        $http.post('/buscaItem', data)
          .then(function (response) {
            if (response.data.failed) {
              alert("Item inexistente");
              $scope.codbar = "";
              $scope.item = "";
              $scope.obs = "";
            }
            else {
              $scope.item = response.data[0].nm_nome;
            }
          },
            function (data) {
              console.log('Error: ' + data);
            });
      } else {
        alert("O Código de barras deve conter apenas números!");
        $scope.codbar = "";
        $scope.item = "";
      }
    }
  }
};