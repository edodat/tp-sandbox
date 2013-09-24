'use strict';

angular.module('app').controller('ItemsCtrl', function($scope, $modal, Restangular){
    $scope.Items = Restangular.all('items');

    function load () {
        $scope.items = $scope.Items.getList();
    }

    function openModal (item) {
        var modalInstance = $modal.open({
            templateUrl: 'editItem.html',
            controller: 'EditItemCtrl',
            resolve: {
                item: function () {
                    return item ? Restangular.copy(item) : {};
                }
            }
        });
        modalInstance.result.then(function (item) {
            if (item._id){
                // update existing one
                return item.put();
            } else {
                // create new one
                return $scope.Items.post(item);
            }
        }).then(load);
    }

    $scope.addItem = function(){
        openModal();
    };

    $scope.editItem = function(item){
        openModal(item);
    };

    $scope.removeItem = function(item){
        item.remove().then(load);
    };

    load();
});

angular.module('app').controller('EditItemCtrl', function ($scope, $modalInstance, item) {
    $scope.item = item;
    $scope.save = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});