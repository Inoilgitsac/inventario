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
        var sendData = {
            codbarra: $scope.codbar,
            nome: $scope.item,
            local: $scope.idlocalidade
        }
        $http.post('/localizarItem', sendData)
            .then(function (response) {
                console.log(response);
                if (response.data.failed)
                    alert("Nenhum rastreio localizado.");
                else {
                    console.log(response.data);
                    $scope.rastreio = response.data;
                }
            },
                function (data) {
                    console.log('Error: ' + data);
                });
    }

    $scope.excel = function () {
        var sendData = {
            codbarra: $scope.codbar,
            nome: $scope.item,
            local: $scope.idlocalidade
        }
        $http({
            url: '/localizarItemExcel',
            method: "POST",
            data: sendData,
            headers: {
                'Content-type': 'application/json'
            },
            responseType: 'arraybuffer'
        }).success(function (data, status, headers, config) {
            var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            var objectUrl = URL.createObjectURL(blob);
            window.open(objectUrl);
        }).error(function (data, status, headers, config) {
            console.log('Error: ' + data);
        });

    }
    $scope.painel = function () {
        $window.location.href = '/';
    }
    $scope.deslogar = function () {
        $window.location.href = '/logout';
    }
};