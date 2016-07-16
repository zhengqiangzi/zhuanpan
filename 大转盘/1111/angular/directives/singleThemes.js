app.directive('singleThemes', function(webData){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope: {
		 	data:"="
		 }, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs, $transclude) {
		 	$scope.selectItem=function(){
		 		$scope.data.selected=!$scope.data.selected;
		 		webData.updateChildData($scope.data)
		 	}

		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'ECMA', // E = Element, A = Attribute, C = Class, M = Comment
		 template: `
					<div class="themes_item" ng-class="{selected:data.selected}" ng-click="selectItem()">

						<div class="themes_item_image">

							<div class="tag glyphicon glyphicon-ok"></div>

							<img lazy-src="{{data.img_src}}" loading-image error-src="http://dummyimage.com/414x736">
						</div>

						<div class="themes_item_title">{{data.title}}</div>

						<div class="themes_item_size">{{data.text}}</div>

					</div>
		 `,
		// templateUrl: '',
		 replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
});