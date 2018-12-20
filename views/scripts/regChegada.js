var Item = angular.module('Item', []);
Item.controller('ItemCtrl', enviaObj);
var nomeobj;
function enviaObj($scope, $http, $window) {

    $http.get("/localidades")
        .then(function (response) {
            if (response.data.return)
                console.log("Erro na execução da query.");
            else {
                $scope.localidade = response.data;
                $scope.idlocalidade = response.data[0];
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
            $http.post('/registrarChegada', sendData)
                .then(function (response) {
                    if (typeof $scope.Item === "undefined" || $scope.Item === "" || $scope.Item === null)
                        if (confirm('Item inexistente. Deseja cadastrar um novo Item?')) {
                            $window.location.href = '/cadastrarItem';
                        } else {

                        }
                    else
                        alert('Item registrado sucesso!')
                },
                    function (data) {
                        console.log('Error: ' + data);
                    });
        } else if (typeof $scope.codbar === "undefined" || $scope.codbar === null || $scope.codbar === "")
            alert('Localize um Item para registro digitando um código de barras!');
        else if (typeof $scope.idlocalidade === "undefined" || $scope.idlocalidade === null) {
            alert('Seleciona uma localidade para registrar a chegada do Item!');
        }
    }

    $scope.buscarObj = function () {
        var data = {
            codbarra: $scope.codbar
        };
        if (typeof $scope.codbar != "undefined" && $scope.codbar != "" && $scope.codbar != null) {
            var isNum = /^\d+$/.test($scope.codbar);
            if (isNum) {
                $http.post('/buscaItem', data)
                .then(function (response) {
                    if (response.data.failed) {
                        $scope.Item = "";
                        $scope.obs = "";
                        if (confirm('Item inexistente. Deseja cadastrar um novo Item?')) {
                            $window.location.href = '/cadastrarItem';
                        } else {

                        }
                    } else {
                        $scope.Item = response.data[0].nm_nome;
                    }
                },
                    function (data) {
                        console.log('Error: ' + data);
                    });
            }
            else {
                alert("O Código de barras deve conter apenas números!")
                $scope.codbar = "";
                $scope.Item = "";
                $scope.obs = "";
            }
        }
    }
};
