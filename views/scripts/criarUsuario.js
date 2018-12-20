var user = angular.module('user', []);
user.controller('userCtrl', enviaObj);
var nomeobj;
function enviaObj($scope, $http, $window, $document) {


  $document.ready(function () {
    $http.get('/isAdmin')
      .then(function (response) {
        if (response.data[0].isAdmin != 1)
          $window.location.href = '/home';
      },
        function (response) {
          console.log('Error: ' + response);
        })
  }
  );

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
  $scope.isAdmin = false;

  $scope.postData = function () {
    console.log("executa postData");
    if (typeof $scope.nome != "undefined" && $scope.nome != null && $scope.nome != ""
      && typeof $scope.login != "undefined" && $scope.login != null && $scope.login != ""
      && typeof $scope.senha != "undefined" && $scope.senha != null && $scope.senha != ""
      && typeof $scope.confSenha != "undefined" && $scope.confSenha != null && $scope.confSenha != ""
      && typeof $scope.idlocalidade != "undefined" && $scope.idlocalidade != null
      && $scope.senha === $scope.confSenha) {
      var sendData = {
        nome: $scope.nome,
        login: $scope.login,
        senha: $scope.senha,
        isAdmin: $scope.isAdmin,
        local: $scope.idlocalidade
      }
      $http.post('/criarUsuario', sendData)
        .then(function (response) {
          if (response.data.code === "EREQUEST")
            alert("ERRO: Usuário já existe!");
          else {
            console.log(response);
            alert("Usuário criado com sucesso!");
          }
        },
          function (data) {
            console.log('Error: ' + data);
          });
    } else if (typeof $scope.nome === "undefined" || $scope.nome === null || $scope.nome === "")
      alert('Preencha um nome para prosseguir!')
    else if (typeof $scope.login === "undefined" || $scope.login === null || $scope.login === "")
      alert('Preencha um login para prosseguir!');
    else if (typeof $scope.idlocalidade === "undefined" || $scope.idlocalidade === null)
      alert('Defina a localidade do usuário para prosseguir!');
    else if (typeof $scope.senha === "undefined" || $scope.senha === null || $scope.senha === "")
      alert("Digite uma senha para prosseguir!");
    else if (typeof $scope.confSenha === "undefined" || $scope.confSenha === null || $scope.confSenha === "")
      alert("Preencha o campo de confirmação de senha para prosseguir!")
    else if ($scope.confSenha != $scope.senha)
      alert("As senhas não são iguais!")
  }
};
