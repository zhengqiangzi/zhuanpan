app.directive('mediaCoreShow',function(){
	// Runs during compile <single-media ng-repeat="item in data" data="item"></single-media>
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope: {
		 	data:"=",
		 	popup:"=",

		 }, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'ECMA', // E = Element, A = Attribute, C = Class, M = Comment
		 template: `<div class="heroAppContainer">

		 			<div ng-repeat="item in data"> 

						<media-chunk data="item" class='chunk' popup=popup index={{$index}}></media-chunk>
						
						<div class="child_list {{item.child.pos}}" ng-if="popup.index==$index">
							
							<div class="tips" ng-if="item.child.data.length<=0">当前项暂无数据!</div>

							<div class="chunk_themes_item" ng-repeat="citem in item.child.data">

								<single-themes ng-repeat="ccitem in citem" data="ccitem"></single-themes>
								
							</div>
						</div>

			 		</div>

		 </div>`,
		// templateUrl: '',
		 replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		controller:function($scope){

		},
		link: function($scope, iElm, iAttrs, controller) {
			


		}
	};
});