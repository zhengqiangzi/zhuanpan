
app.directive('angularDataTable',function(network,webData,$rootScope,$timeout){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope:{
		 	status:"=",
		 	url:"=",
		 	ignore:"="

		 }, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs, $transclude) {

		 	$scope.$watch('url',function(newvalue,oldvalue,scope){

		 		if(newvalue==oldvalue) return;

		 		if(newvalue.campaignType==$scope.ignore) return;

		 		//webData.clearTableData();
		 		//$scope.$emit('SELECT_COMPLETE_EVENT',{target:"dataTabel"})

		 		$scope.$emit('CLEAR_SELECTED_DATA')

		 		network.tableList(
		 		{
		 			priceType:newvalue.mediaType,
		 			mediaType:newvalue.campaignType,
		 			adType:newvalue.adType

		 		}).then(function(data){

		 			$scope.tableData=data.data
					drawTable(data.data)

		 		})

		 	},true)


		 	$scope.data=null;
		 	var tables=null;
		 	var api=null;
		 	var prevalue=[];

		 	//初始化传的数据 hack判断
		 	if($scope.url.campaignType!=$scope.ignore){

				network.tableList({
		 			priceType:$scope.url.mediaType,
		 			mediaType:$scope.url.campaignType,
		 			adType:$scope.url.adType

		 		}).then(function(data){

		 			$scope.tableData=data.data;
		 			webData.exchangeData(data);
					drawTable(data.data);
	  				$scope.$emit('SELECT_COMPLETE_EVENT',{target:'dataTabel'});
		 		})
		 	}

		 	function checkSelect(){
				//this.api.draw();
				var info=getCurrentTabelInfo();
				//当前页全选了
				updateHeaderCheckBox(info.selectAll||false);
			}

			function updateHeaderCheckBox(flag){

				$(api.tables().header()[0]).find('input[type="checkbox"]').prop('checked',flag)
			}

			function getCurrentTabelInfo(){

			     var rows=$(tables).find('tbody>tr');
			     var rowsLength=rows.length;
			     var t=0;
				for(var i=0;i<rows.length;i++){
					var f=$(rows[i]).find('input[type="checkbox"]').prop('checked');
					if(f){
						t=t+1;
					}
				}
				return {rowsLength,t,selectAll:rowsLength==t}
			}
		 	function drawTable(data){
		 		if(tables){
		 			api.destroy();
		 			tables=null;
		 		}
	 			tables=$('#list-tables').dataTable({
					dom:"rt<p>",
					data:data,
					 "ordering": false,
					 "searching":false,
					'columns':[
						{"data":"id",title:"<input type='checkbox'/>"},
						{"data":"name",title:"name"},
						{"data":"size",title:"size"},
						{"data":"type",title:"type"}
					],
		          	"columnDefs": [{
		           		 "render": function(data, type, row) {
                				return "<input type='checkbox' data-id='"+data+"'/>"
		           		},
		            	"targets": 0
		       		 }],
		       		 createdRow:function(row,data,index){
		       		 	
			   		 	$(row).find('input[type="checkbox"]').change(function(){
			   		 		checkSelect();
			   		 		webData.tableListData(data,$(this).prop('checked'));
			   		 	})

		       		 },
		       		 //draw方法回调，切换分页时都会触发此方法
		       		 drawCallback:function(settings){
						 var len=this.api().rows()[0].length;
			       		 	for(var i=0;i<len;i++){
			       		 		var checkbox=$(this.api().row(i).node()).find('input[type="checkbox"]');
			       		 		var id=checkbox.attr('data-id');

			       		 		var index=_.findIndex(webData.getTableListData(),{id:parseInt(id)})

			       		 		if(index>=0)
								{
			       		    		checkbox.prop('checked',true)	
								}else{
			       		    		checkbox.prop('checked',false)	
								}
			       		 	}

		       		 }
			    });

			    api=tables.api();

				tables.init(()=>{

					//全选或全部取消
					$(api.tables().header()[0]).find('input[type="checkbox"]').change(function(){
							var ichecked=$(this).prop('checked')
		       		 	    var rows=$(tables).find('tbody>tr');
					

							for(var i=0;i<rows.length;i++){
							   var node=$(rows).eq(i);
							    node.find('input[type="checkbox"]').prop('checked',ichecked);
							    node.find('input[type="checkbox"]').trigger('change');
							}
					})
					checkSelect();
				})

				tables.on('draw.dt',()=>{
					checkSelect();
				})

		 	}
		 

		 	//弹出时，重绘表格
		 	$scope.$watch('status',function(newvalue){
		 		if($scope.tableData&&newvalue){
					drawTable($scope.tableData)
		 		}
			})

		 	//弹出时，备份选中的数据
			$scope.$on('SHOW_POPUP_EVENT',function(){

				prevalue=Object.assign([],webData.getTableListData());

			})
			//取消时还原上次数据
			$scope.$on('CANCEL_POPUP_EVENT',function(){
				
				webData.prevTableData(prevalue)

			})


		 	$scope.$on('cancelEvent',function(e,value){



		 		if(value=="Resource"){

					if($scope.url.campaignType!=$scope.ignore){
						$timeout(function(){

							webData.bakTableListOrigin();
		 					$scope.$emit('SELECT_COMPLETE_EVENT',{target:'dataTabel'});
		 				},10)
					} 
				}
		 	})

		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'ECMA', // E = Element, A = Attribute, C = Class, M = Comment
		 template: `
			<div>
				<table id="list-tables" class="display" cellspacing="0" width="100%"></table>
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