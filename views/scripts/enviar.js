var item = angular.module('item', []);
item.controller('itemCtrl', enviaObj);
var nomeobj;
function enviaObj($scope, $http, $window) {

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
    if (typeof $scope.codbar != "undefined" && $scope.codbar != null && $scope.codbar != ""
      && typeof $scope.idlocalidade != "undefined" && $scope.idlocalidade != null) {
      var sendData = {
        codbarra: $scope.codbar,
        local: $scope.idlocalidade,
        obs: $scope.obs
      }
      $http.post('/enviarItem', sendData)
        .then(function (response) {
          console.log(response);
          if (response.data.failed) {
            alert("item inexistente");
            $scope.item = "";
            $scope.codbar = "";
          }
          else {
            alert('item enviado com sucesso!')
          }
        },
          function (data) {
            console.log('Error: ' + data);
          });
    } else if (typeof $scope.codbar === "undefined" || $scope.codbar === null || $scope.codbar === "")
      alert('Localize um item para envio digitando um código de barras!');
    else if (typeof $scope.idlocalidade === "undefined" || $scope.idlocalidade === null) {
      alert('Seleciona uma localidade para enviar o item!');
    }


  }

  $scope.buscarObj = function () {
    console.log("executa buscarObj");
    if (typeof $scope.codbar != "undefined" && $scope.codbar != null && $scope.codbar != "") {
      var data = {
        codbarra: $scope.codbar
      };
      var isNum = /^\d+$/.test($scope.codbar);
      if (isNum) {
        $http.post('/buscaItem', data)
          .then(function (response) {
            console.log(response);
            if (response.data.failed) {
              alert("Item inexistente");
              $scope.item = "";
              $scope.codbar = "";
            }
            else {
              //console.log(response.data);
              $scope.item = response.data[0].nm_nome;
              nomeobj = response.data[0].nm_nome;
            }
          },
            function (data) {
              console.log('Error: ' + data);
            });
      } else alert("O Código de barras deve conter apenas números!")
    };
  }
  $scope.painel = function () {
    $window.location.href = '/';
  }
  $scope.deslogar = function () {
    $window.location.href = '/logout';
  }
};
