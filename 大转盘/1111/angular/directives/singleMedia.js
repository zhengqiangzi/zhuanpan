app.directive('singleMedia', function(webData){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope: {
		 	data:"=",
		 	closestatus:"@"//不要删除按钮
		 }, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs, $transclude) {


		 	$scope.closeCateGroy=function(){

		 		$scope.$emit('DELETE_CATEGROY_EVENT',webData.removeCateGroy(Object.assign({},$scope.data)))
		 	}

		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'ECMA', // E = Element, A = Attribute, C = Class, M = Comment
		 template: `<div class="core-item-container">
						<div class="core-item-container-icon"><img lazy-src="{{data.img_src}}" loading-image error-src="http://dummyimage.com/40x40"/></div>
						<div class="core-item-container-text">
								<div class="core-item-container-text-title">{{data.title}}</div>
								<div class="core-item-container-text-desc">{{data.text}}</div>
						</div><div class="icon-number" ng-if="data.selected>0">{{data.selected}}</div>

						<div class="close_btn" ng-if="data.hasClose && !closestatus" ng-click="closeCateGroy()"><i class="glyphicon glyphicon-remove"></i></div>
				</div>`,
				
		// templateUrl: '',
		 replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {



			
		}
	};
});