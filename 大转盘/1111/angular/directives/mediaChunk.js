app.directive('mediaChunk',function(network,webData){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope: {
		 	data:"=",
		 	popup:"=",
		 	index:"@"

		 }, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs, $transclude) {
			 //显示区域点击某一个按钮
			 $scope.selectItem=function(index,data){
			 	var itemData=data;
			 	//请求二级数据
		 		network.adSpace({priceType:1,mediaid:data.id}).then(function(data){
		 			$scope.data.child={
		 				data:webData.chunk(webData.markInfo(data,itemData)),
		 				pos:index==0?"":index==1?"middle":"right",
		 			}
		 			$scope.popup.index=(function(){
		 				if($scope.popup.index==$scope.index && index==$scope.popup.cindex){
		 					return -1;
		 				}else{
		 					return $scope.index
		 				}
		 			})() 
		 			$scope.popup.cindex=index;
		 		})
			 }
		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'ECMA', // E = Element, A = Attribute, C = Class, M = Comment
		 template:`
				<div>
					<single-media ng-repeat="item in data" data="item" ng-click="selectItem($index,item)"></single-media>
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