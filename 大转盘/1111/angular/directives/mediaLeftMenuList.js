app.directive('mediaMenuList',function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope: {
		 		data:"=",
		 		filter:"="
		 	}, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs, $transclude) {

		 	$scope.filterData=function(data){
		 		$scope.$emit('filterDataEvent',data)
		 	}
		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'ECMA', // E = Element, A = Attribute, C = Class, M = Comment
		 template: `<div>
				
						<div class='clear'><input type="text" class="form-control" ng-model="filter.text" placeHolder="查找字符串"></div>

						<div class="list-group ngMarginLeft">
							  <a href="javascript:void(0)" class="list-group-item" ng-click="filterData()">All</a>
							  <a href="javascript:void(0)" class="list-group-item" ng-repeat="item in data" ng-click="filterData(item)">
								{{item.text}}
							  </a>
						</div>

				 </div>`,
		// templateUrl: '',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			


		}
	};
});