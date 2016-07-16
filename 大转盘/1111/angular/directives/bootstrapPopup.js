app.directive('bootStrapPopup', function(webData){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope: {
		 	status:"=",
		 	modelname:"@",
		 	savetag:"@"
		 }, // {} = isolate, true = child, false/undefined = no change

		 controller: function($scope, $element, $attrs, $transclude) {

	

		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'ECMA', // E = Element, A = Attribute, C = Class, M = Comment
		 template:`
				<div class="modal fade" id="{{modelname}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
				  <div class="modal-dialog" role="document">
				    <div class="modal-content">
				      <div class="modal-header">
				        <button type="button" class="close"  aria-label="Close" ng-click="closePopupHandler()"><span aria-hidden="true">&times;</span></button>
				        <h4 class="modal-title" id="myModalLabel">hero Apps</h4>
				      </div>
				      <div class="modal-body" ng-transclude style="max-height:400px;overflow-y:auto;">
				      </div>
				      <div class="modal-footer">
				        <button type="button" class="btn btn-default" ng-click="closePopupHandler()">Close</button>
				        <button type="button" class="btn btn-primary" ng-click="saveHandler()">Save changes</button>
				      </div>
				    </div>
				  </div>
				</div>

		 `,
		// templateUrl: '',
		 replace: true,
		 transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
		
			$scope.$watch("status",function(newvalue,oldvlaue,scope){
		 		if(newvalue){
		 			$('#'+$scope.modelname).modal('show');
		 			$scope.$broadcast('SHOW_POPUP_EVENT');

		 		}else{

		 			$('#'+$scope.modelname).modal('hide');
		 		}
		 	})

		 	$scope.saveHandler=function(){

		 		$scope.status=false;
		 		$scope.$emit('SELECT_COMPLETE_EVENT',{target:$scope.savetag})
		 		$scope.$broadcast('POPUP_SUBMIT_EVENT',{target:$scope.savetag})
		 	}

		 	$scope.closePopupHandler=function(){
		 		$scope.status=false;
		 		$scope.$broadcast('CANCEL_POPUP_EVENT')
		 	}

		}
	};
});