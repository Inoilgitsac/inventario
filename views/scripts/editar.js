var item = angular.module('item', []);
item.controller('itemCtrl', buscaObj);
var nomeobj;
function buscaObj($scope, $http) {

  $scope.salvarNome = function () {
    if (($scope.item != "" && nomeobj != $scope.item) || $scope.obs != observacao) {
      var objAtt = {
        codbarra: $scope.codbar,
        nome: $scope.item,
        obs: $scope.obs
      };

      $http.post('/editarItem', objAtt)
        .then(function (response) {
          if (response.data.failed)
            alert("ERRO: Não foi possível encontrar o item.")
          else if (response.data.code === "EREQUEST")
            alert("ERRO: um item com esse nome já existe")
          else if (response.data[0].att === 1)
            alert("Item editado com sucesso.")
        },
          function (response) {
            console.log('Error: ' + response);
          })
        .catch(err => console.log(err));
    } else {
      alert("Não foi detectada nenhuma alteração a ser realizada.")
    };
  }

  $scope.postData = function () {
    if (typeof $scope.codbar != "undefined" && $scope.codbar != null && $scope.codbar != "") {
      var data = {
        codbarra: $scope.codbar
      };
      var isNum = /^\d+$/.test($scope.codbar);
            if (isNum) {
      $http.post('/buscaItem', data)
        .then(function (response) {
          if (response.data.failed) {
            alert("Item inexistente");
            $scope.item = "";
            $scope.obs = "";
            $scope.codbar = "";
          } else {
            $scope.item = response.data[0].nm_nome;
            $scope.obs = response.data[0].ds_obs;
            nomeobj = response.data[0].nm_nome;
            observacao = response.data[0].ds_obs
          }
        },
          function (data) {
            console.log('Error: ' + data);
          });
        } else alert("O Código de barras deve conter apenas números!")
    }
  }
};