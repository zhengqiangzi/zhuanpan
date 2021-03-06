var net=require('net');
var consts=require('consts')

var local_award_info={
	award_mapping:[
		{
			id:1,
			name:"10元微店优惠券",
			rotate:135
		},
		{
			id:2,
			name:"手机壳",
			rotate:180
		},
		{
			id:3,
			name:"阳伞",
			rotate:-90
		},
		{
			id:4,
			name:"5元微店优惠券",
			rotate:-45
		},
		{
			//special add no clothers of footerball
			id:5,
			name:"20元微店优惠券",
			rotate:45
		},
/*		{
			id:5,
			name:"球衣",
			rotate:135
		},*/
		{
			id:6,
			name:"足球",
			rotate:0
		}


		/*{
			id:-1,
			name:"没有中奖",
			rotate:[90,0,230]
		}*/
	]
}

function getRotateById(param){

	var data=local_award_info.award_mapping;

	var rotate=null;

	if(param.get==1){
		//中奖
		for(var i=0;i<data.length;i++){
			if(data[i].id==param.id){
				rotate=data[i].rotate;
			}
		}
	}else{
		//未中奖
		var g=[90,-135];
		return g[Math.floor(Math.random()*g.length)];
	}
	return rotate;
}

function getAward(){

	var defer=$.Deferred();


	net.getAward().then(function(data){

		var pan_rotate=getRotateById(data);
		consts.leave_times=data.times||0;
		return defer.resolve({rotate:pan_rotate,data:data});

	},function(){

		defer.reject('摇奖接口发生异常')
	})


	return defer.promise();

}

module.exports={
	local_award_info,
	getAward
}