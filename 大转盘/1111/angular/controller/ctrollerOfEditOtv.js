app.controller('ctrlotvedit',function ($scope){
	
	$scope.status=false;

	$scope.popup={
		data:{
			data:adsetSelectData.otvMediaList,
			index:{
				data:String(adsetSelectData.otvMediaId),
				version:0
			}
		}
	}

	$scope.url={
		priceType:1,
		mediaType:'004'
	}

	$scope.results={
		data:null
	}

	//初始化数据
	$scope.init_data={
		data:adsetSelectData.selectedAdspaceIds
	};

	//广告形式初始化
	$scope.adTypeList={data:adtypeSelectData}
	$scope.adType={
		data:adsetSelectData.adType
	}
	//广告形式切换时，需要加载相应的url数据
	$scope.$watch('adType',function(newvalue,oldvalue,scope){

		$scope.url=Object.assign($scope.url,{adType:newvalue.data})

	},true)


	$scope.$on('dataTableChangeIndexEvent',function(e,data){

		$scope.url=Object.assign($scope.url,{mediaId:data.data})

	})

	
	//切换弹出层
	$scope.togglePopup=function(){
		$scope.status=!$scope.status;
	}
})