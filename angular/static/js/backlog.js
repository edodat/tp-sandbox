function BacklogCtrl ($scope) {
	
	$scope.tasks = [{title:'Template list'},
	                {title:'Create template from scratch'}];
	
	$scope.addTask = function(){
		 $scope.tasks.push({title:$scope.formTaskTitle});
		 $scope.formTaskTitle = '';
	};
	
    $('#backlog').sortable({
    	opacity: 0.6,
    	cursor: 'move',
    	axis: 'y',
        start: function(e, ui) {
            ui.item.data('start', ui.item.index());
        },
        update: function(e, ui) {
            var start = ui.item.data('start');
            var end = ui.item.index();
            $scope.tasks.splice(end, 0, $scope.tasks.splice(start, 1)[0]);
            $scope.$apply();
        }
    });
    
    $('#backlog').droppable();
}

function ProjectCtrl ($scope) {
	
	$scope.tasks = [{title:'Create template from feed'},
	                {title:'Create feed from template'}];
	
	$scope.addTask = function(){
		 $scope.tasks.push({title:$scope.formTaskTitle});
		 $scope.formTaskTitle = '';
	};
	
//    $('#project').sortable({
//    	opacity: 0.6,
//    	cursor: 'move',
//    	axis: 'y',
//        start: function(e, ui) {
//            ui.item.data('start', ui.item.index());
//        },
//        update: function(e, ui) {
//            var start = ui.item.data('start');
//            var end = ui.item.index();
//            $scope.tasks.splice(end, 0, $scope.tasks.splice(start, 1)[0]);
//            $scope.$apply();
//        }
//    });
    
    $('#project').find('.task').draggable({
		helper : 'clone',
		revert : 'invalid',
		cursor : 'move'
	});	
}