app.directive('mediaList',function(network,webData){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope: {

		 	url:"=",
		 	equ:"="
		 	//data:"=",//外部提供的数据源，主要确定第一层的显示的选中数据的个数
		 }, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'ECMA', // E = Element, A = Attribute, C = Class, M = Comment
		 template: `<div class="row">
						<media-menu-list class="col-lg-3 col-md-3 col-xs-3 col-sm-3" data=leftData filter="filter"></media-menu-list>
						<media-core-show  popup="popup" class="col-lg-9 col-md-9 col-xs-9 col-sm-9" data=showData></media-core-show>
					 </div>`,
		// templateUrl: '',
		 replace: true,

		 controller:function($scope){

		 	//console.log(webData.getSelectedData())
		 	//右边的过滤条件
		 	$scope.filter={
		 		text:""
		 	}

		 	var prevalue=[];
		 	$scope.popup={index:-1,cindex:-1};//弹出层显示规则 
		 	$scope.$watch('url',function(newvalue,oldvalue,scope){
		 		if(newvalue==oldvalue) return;
		 		if(newvalue.campaignType!=$scope.equ) return;
		 		$scope.$emit('CLEAR_SELECTED_DATA')
		 		network.media({
		 				priceType:newvalue.mediaType,
		 				mediaType:'002',//newvalue.campaignType,
		 				adType:newvalue.adType
		 			}).then(function(data){
		 			data=webData.makeMark(data);
		 			$scope.originData=data;
		 			$scope.leftData=webData.makeCategroy(data);
		 			$scope.showData=webData.chunk(data);
		 		})
		 	},true)

		 	//初始化加载数据
	 		network.media({
	 				priceType:$scope.url.mediaType,
	 				mediaType:'002',//$scope.url.campaignType,
	 				adType:$scope.url.adType
	 			}).then(function(data){

	 			data=webData.makeMark(data);
	 			$scope.originData=data;
	 			$scope.leftData=webData.makeCategroy(data);
	 			$scope.showData=webData.chunk(data);
				
				if($scope.url.campaignType==$scope.equ){
	 				$scope.$emit('SELECT_COMPLETE_EVENT',{target:'heroList'});
				}
	 		})



		 	//监听左栏目点击事件
		 	$scope.$on('filterDataEvent',function(e,data){
		 		$scope.popup={index:-1,cindex:-1};//弹出层显示规则设置为默认值即不弹出任何值
		 		$scope.showData=webData.chunk(webData.filterData($scope.originData,data));
		 	})	


		 	$scope.$watch('filter',function(newvalue,oldvalue,scope){

		 		$scope.popup={index:-1,cindex:-1};//弹出层显示规则设置为默认值即不弹出任何值
		 		$scope.showData=webData.chunk(webData.filterByTitle($scope.originData,$scope.filter));

		 	},true)

		 	//重置显示区域
		 	$scope.$on('SHOW_POPUP_EVENT',function(){
		 		prevalue=Object.assign([],webData.getSelectedData());//保存弹出之前的数据
		 		$scope.popup={index:-1,cindex:-1};//弹出层显示规则设置为默认值即不弹出任何值
		 		var data=webData.makeMark($scope.originData);
		 			$scope.originData=data;
		 			$scope.leftData=webData.makeCategroy(data);
		 			$scope.showData=webData.chunk(webData.filterByTitle(data,$scope.filter));
		 			//$scope.showData=webData.chunk(data);
		 	})

		 	//弹出层取消或关闭
		 	$scope.$on('CANCEL_POPUP_EVENT',function(){
		 		webData.prevalue(prevalue);//取消时，还原弹出之前的数据
		 	})

		 	//取消事件 恢复原始数据
		 	$scope.$on('cancelEvent',function(e,value){

		 		if(value=="Resource"){
		 			
					if($scope.url.campaignType==$scope.equ){
			 			webData.bakToOrigin();
		 				$scope.$emit('SELECT_COMPLETE_EVENT',{target:'heroList'});
					}
		 		}
		 	})
		 },

		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		

		}
	};
});