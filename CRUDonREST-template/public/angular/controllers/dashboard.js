'use strict';

angular.module('app').controller('ItemsCtrl', function($scope, $modal, Restangular){
    $scope.Items = Restangular.all('items');
    $scope.Items.getList().then(function(items) {
        $scope.items = items;
    });

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
                item.put().then(function(){
                    $scope.items[_.findIndex($scope.items, { '_id': item._id })] = item;
                });
            } else {
                // create new one
                $scope.Items.post(item).then(function(item){
                    $scope.items.push(item);
                });
            }
        });
    }

    $scope.addItem = function(){
        openModal();
    };

    $scope.editItem = function(item){
        openModal(item);
    };

    $scope.removeItem = function(item){
        item.remove().then(function(){
            _.remove($scope.items, { '_id': item._id });
        });
    };

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