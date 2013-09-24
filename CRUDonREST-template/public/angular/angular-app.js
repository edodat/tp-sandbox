'use strict';

angular.module('app', ['ui.bootstrap', 'restangular'])
    .config(function($routeProvider, RestangularProvider) {
        $routeProvider.
            when("/",  { templateUrl: 'partials/dashboard/' });

        // Use Mongo "_id" instead of "id"
        RestangularProvider.setRestangularFields({
            id: "_id"
        });
    })
;