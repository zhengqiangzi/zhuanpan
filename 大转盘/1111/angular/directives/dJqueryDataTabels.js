app.directive('dJqueryDataTables',function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope: {
		 	tdata:"="

		 }, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs, $transclude) {
			
		/*	$scope.$watch('initdata.data',function(newvalue){

				console.log(newvalue)

			},true);*/
			 $scope.table_name="table"+Math.ceil(Math.random()*1000);//table的id

			 var tables=null;
			 var api=null;

			 var _selected_data=[];
			 var _origin_table_data=[];

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
		 		_origin_table_data=Object.assign([],data);//把最新一次绘制表格的数据备分一下

	 			tables=$('#'+$scope.table_name).dataTable({
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
			   		 		tableListData(data,$(this).prop('checked'));
			   		 	})

		       		 },
		       		 //draw方法回调，切换分页时都会触发此方法
				      drawCallback:function(settings){

						 	var len=this.api().rows()[0].length;
			       		 	for(var i=0;i<len;i++){
			       		 		var checkbox=$(this.api().row(i).node()).find('input[type="checkbox"]');
			       		 		var id=checkbox.attr('data-id');

			       		 		var index=_.findIndex($scope.tdata.init_data,{id:parseInt(id)})

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
			/**
				@name tableListData
				@desc:当页面中勾选或取消勾选，把数据存储到_selected_data中
				@param 
					data:选中或未选中的数据
					status:true/false，true为选中,false为取消选中
			**/
			function tableListData(data,status){
				if(status){
					//添加数据	
					_selected_data.push(data)
				}else{
					//删除数据
					_selected_data=Object.assign([],_selected_data.filter((item)=>{
						return item.id!=data.id
					}))
				}
				_selected_data=_.uniq(_selected_data,'id');

				$scope.tdata.init_data=Object.assign([],_selected_data)

			}


			$scope.$watch('tdata',function(newvalue,oldvalue){

				//if(typeof(newvalue)!='string') return;
				
				$scope.tdata=newvalue;
				drawTable($scope.tdata.tableData)

			},true)



		
			
		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'ECMA', // E = Element, A = Attribute, C = Class, M = Comment
		 template: `<div>
				<table id="{{table_name}}" class="display" cellspacing="0" width="100%"></table>
		 </div>`,
		// templateUrl: '',
		 replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {


			
		}
	};
});