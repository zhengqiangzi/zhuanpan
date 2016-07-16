app.controller('ovtCtrl',function ($scope) {
	

	$scope.status=false;//默认弹出层是关闭的
	//切换弹出层显示 
	//弹出层数据树
	$scope.popup={
		selected_list:mediaPopupList,//select 下拉框数据源
		index:mediaPopupListSelectIndex,//select 下拉框数据选中项
		init_data:[],//列表默认值 ，可以为空
	}
	//广告形式默认选中的值 
	$scope.adType={
		data:7
	};
	//tablelist请求地址配置
	$scope.url={
		priceType:1,
		mediaType:'004'
	}

	$scope.$watch('adType',function(newvalue,oldvalue,scope){
		$scope.url=Object.assign($scope.url,{adType:newvalue.data})
	},true);


	$scope.$on('dataTableChangeIndexEvent',function(e,data){
		$scope.url=Object.assign($scope.url,{mediaId:data})
	})



	//输出结果值
	$scope.results={
		data:[1,2,3,4]
	};
	//广告形式的数据源 ng-repeat
	$scope.adTypeList={
		data:adtypeSelectData
	}
	//切换弹出层
	$scope.togglePopup=function(){
		$scope.status=!$scope.status;
	}
})