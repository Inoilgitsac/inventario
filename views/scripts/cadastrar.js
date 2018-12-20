var item = angular.module('item', []);
item.controller('itemCtrl', buscaLocal);
function buscaLocal($scope, $http) {

  $scope.validaCodbar = function() {
    if (typeof $scope.codbar != "undefined" && $scope.codbar != "" && $scope.codbar != null) {
      var isNum = /^\d+$/.test($scope.codbar);
      if (isNum) {}
      else {
        alert("O Código de barras deve conter apenas números!")
        $scope.codbar = "";
      }
    };
  }

  $http.get("/localidades")
    .then(function (response) {
      if (response.data.return)
        console.log("Erro na execução da query.");
      else {
        $scope.localidade = response.data;
      }
    },
      function (data) {
        console.log('Error: ' + data);
      });
  $scope.postData = function () {
    var data = {
      nome: $scope.item,
      codbarra: $scope.codbar,
      obs: $scope.obs,
      local: $scope.idlocalidade,
    };
    $http.post('/cadastrarItem', data)
      .then(function (response) {
        if (typeof $scope.codbar === "undefined" || $scope.codbar === "" || $scope.codbar === null) {
          alert("Por favor preencha o código de barras do item.")
        };
        if (response.data[0].nm_nome === 0) {
          alert('ERRO: Um item com este código de barras já existe.');
        } else {
          if (response.data[0].nm_nome === 1) {
            alert('ERRO: Um item com este nome já existe');
          } else {
            alert('Item cadastrado com sucesso!');
          }
        }
      },
        function (response) {
          console.log(response);
        })
  }
};