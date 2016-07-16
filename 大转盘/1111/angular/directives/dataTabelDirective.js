app.directive('ovtTableList',function(network,webData,$timeout){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope:{
		 	status:"=",
		 	data:"=",
		 	url:"@",
		 	result:"=",
		 }, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs, $transclude) {

		 	var bak={}
			function mergeDataTree(object){
				$scope.data=Object.assign({},$scope.data,object);
			}

			 //过滤器的变化
			 $scope.$watch('data.index',function(newvalue,oldvalue,scope){

			 	$scope.$emit('dataTableChangeIndexEvent',newvalue);

			 },true)

			 //当url变化时，加载数据
			 $scope.$watch('url',function(newvalue,oldvalue,scope){

			 	if(newvalue==oldvalue) return;

			 	$scope.data.init_data=[]
			 	//当地址变化 时，需要清理表格中已选中的数据 和输出数据
			 	network.otvSelect(JSON.parse(newvalue)).then(function(data){

			 		mergeDataTree({tableData:data.data})
			 	})

			 },true);

		

		 
		 	//弹出时，重绘表格
		 	$scope.$watch('status',function(newvalue){
		
			})

		 	//弹出时，备份选中的数据
			$scope.$on('SHOW_POPUP_EVENT',function(){

				bak=Object.assign({},$scope.data);
				

			})

			//取消时还原上次数据
			$scope.$on('CANCEL_POPUP_EVENT',function(){

				$scope.data=Object.assign({},bak)
				$scope.data.version=Math.ceil(Math.random()*100000);

			})

			$scope.$on('POPUP_SUBMIT_EVENT',function(e,msg){

			})

		 },

		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'ECMA', // E = Element, A = Attribute, C = Class, M = Comment
		 template: `
			<div>

				<div class="col-lg-3 col-md-3 col-xs-3 col-sm-3 row">
					<select class="form-control" ng-model="data.index">
						  <option ng-repeat="(key,value) in data.selected_list" value={{key}}>
								{{value}}
						  </option>
					</select>
				</div>

				<d-jquery-data-tables tdata="data"></d-jquery-data-tables>
					

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