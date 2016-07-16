app.provider('webData', function () {
		
	//按text分类
	function makeCategroy(data){

		return _.uniqBy(data,'text')
	}
	//分块
	function chunk(data,length=3){

		return _.chunk(data,length)

	}
//按分类过滤当前分类下面的媒 体
	function filterData(originData,condition){

		if(condition){

			return _.filter(originData,{text:condition.text})
		}else{

			return originData
		}
	}
//把第一层分类加上选择多少信息
	function makeMark(data){
		
		if(!data) return data;

		for(var i=0;i<data.length;i++){
			var g=_selectedData.filter((item)=>{
				return item.id==data[i].id;
			})
			data[i].selected=g.length;
		}
		return data
	}
	//把二级分类绑定父级信息，并判断是否选中
	function markInfo(data,parentData){

		for(var i=0;i<data.length;i++){

			//二级是否选中
			data[i].selected=_.findIndex(_selectedData,{cid:data[i].id})>=0
			data[i].parentData=parentData

		}
		return data
	}


/*//cid:"detItem_808"
id:"logoDiv_270"
src:"http://appback.b0.upaiyun.com/mamabang.png!40"
title:"MaMaBang"
txt:"生活"*/

//当选中或取消选中某一个二级媒体时，执行此方法，更新选中的状态和父节点的选中长度
	function updateChildData(data){


		if(data.selected){
			//添加
			var obj={
				cid:data.id,
				id:data.parentData.id,
				src:data.parentData.img_src,
				title:data.parentData.title,
				txt:data.parentData.text
			}
			_selectedData.push(obj);
		}else{

			_selectedData=_selectedData.filter((item)=>{
				return item.cid!=data.id;
			})
			//删除
		}


		//重新计算一下红圈上面的值 
		var g=_selectedData.filter((item)=>{

				return item.id==data.parentData.id;
			})

		data.parentData.selected=g.length;

	}


	//迎合外部数据格式
	function exportChildData(data){

		var obj={

		}
		for(var i=0;i<data.length;i++){

			obj[data[i].cid]=data[i].cid;
		}

		return obj
	}

	//导出数据
	function exportData(data){

		var group_obj=_.groupBy(data,"id")
		var result=[]
		for(var prop in group_obj){
			var item=group_obj[prop][0];
				item.img_src=item.src;
				item.selected=0,
				item.hasClose=true
				item.text=item.txt
				//console.log(item)
			result.push(item)
		}
		return {result:result,serverData:exportChildData(data)};
	}

	//删除某一分类
	function removeCateGroy(data){


		_selectedData=_selectedData.filter((item)=>{
			return item.id!=data.id
		})

		return exportData(_selectedData)
	}
	//清除记录的数据
	function clear(){

		_selectedData=[]
	}

	function getSelectedData(){

		return _selectedData
	}

	function prevalue(data){

		_selectedData=data;

	}


	function bakToOrigin(){

		_selectedData=Object.assign([],_selectedData_origin);

	}


	function tableListData(data,flag){

		if(flag==true){
			//添加
			_tableData.push(data);
		}else{
			//删除
			var cc=_tableData.filter((item)=>{
				return item.id!=data.id;
			})
			_tableData=cc
		}
		_tableData=Object.assign([],_.uniqBy(_tableData,'id'));


	}
	//获取tablelist选中的数据
	function getTableListData(){

		return _tableData
	}	
	//还原table数据
	function prevTableData(data){

		_tableData=data;
	}

	function exportTableData(data){

		data=_.compact(data);//去除假数据
		var p=[]
		for(var i=0;i<data.length;i++){
			if(data[i]){
				p.push(data[i].id)
			}
		}
		return {data:data,server:p.toString()}
	}

	function filterByTitle(filter){
		
		return function(data,condition){
			
			return filter('filter')(data,condition.text)
		}
	}

	function clearTableData(){
		_tableData=[]

	}

	function clearAll(){
		clear();
		clearTableData();
	}

	function setTableData(data){

		for(var prop in data){
			var id=parseInt(prop.replace(/detItem_/gi,''));
			var obj={id:id};
			_tableData.push(obj)
		}
	
	}

	function bakTableListOrigin(){

		_tableData=Object.assign([],_tableData_origin);

		//console.log(_tableData)
	}


	function exchangeData(newdata){

		var k=[]
		for(var i=0;i<_tableData.length;i++){

			k.push(_.find(newdata.data,{id:_tableData[i].id}));
		}
		_tableData=Object.assign([],k);
		//备份一下原始数据
		if(_tableData_origin.length<=0){

			_tableData_origin=Object.assign([],_tableData);
		}
	}



	var _selectedData=[];//外部提供选中的数据
	var _selectedData_origin=[]
	//var _tableData=[{id: 851, name: "腾讯广告位", size: "1080*1598,1920*1080,1080*300,1080*418,1280*200,1456*180,720*1024,160*130", type: "腾讯媒体"}];//jquery.dataTable中的数据
	var _tableData=[]
	var _tableData_origin=[]


	this.$get = function($filter) {

		return {

				makeCategroy:makeCategroy,
				chunk:chunk,
				filterData:filterData,
				makeMark:makeMark,
				markInfo:markInfo,
				//初始化选中信息
				selectedData:function(data){					
					for(var prop in data){

						for(var props in data[prop]){
							var obj={
									id:data[prop].id,
									src:data[prop].src,
									title:data[prop].title,
									txt:data[prop].txt,
							}
							if(props.match(/detItem_\d+/)){
								obj.cid=data[prop][props]
								_selectedData.push(obj)
							}
						}
					}
					//备份一下原始数据
					if(_selectedData_origin.length<=0)
					{
						_selectedData_origin=Object.assign([],_selectedData);
					}

					return _selectedData
				},
				updateChildData:updateChildData,
				exportData:exportData,
				removeCateGroy:removeCateGroy,
				clear:clear,
				tableListData:tableListData,
				getTableListData:getTableListData,
				exportTableData:exportTableData,
				getSelectedData:getSelectedData,
				prevalue:prevalue,
				prevTableData:prevTableData,
				filterByTitle:filterByTitle($filter),
				clearTableData:clearTableData,
				clearAll:clearAll,
				setTableData:setTableData,
				exchangeData:exchangeData,
				bakToOrigin:bakToOrigin,
				bakTableListOrigin:bakTableListOrigin
		};
	};
})