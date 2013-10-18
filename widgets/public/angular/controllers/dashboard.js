'use strict';

angular.module('app').controller('DashboardCtrl', function($scope){

    $scope.widgets=[
        {
            id:1,
            type: 'chat',
            w: 100,
            h: 100
        },
        {
            id:2,
            type: 'sprint',
            w: 200,
            h: 200
        },
        {
            id:3,
            type: 'sprint',
            w: 200,
            h: 200
        }

    ];

    $scope.getTemplateUrl = function(widget){
        return 'partials/dashboard/widgets/'+widget.type+'.html';
    }
});
