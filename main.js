var style=require('mainStyle')
var template=require('template');
var webEvents=require('webEvents')
var layout=require('layout');
var awardData=require('awardData');

var timer=null;
/*var a={
	list:[
		{
			date:"03.25",
			award_name:"球衣",
			award_number:1
		},

		{
			date:"03.25",
			award_name:"球衣",
			award_number:1
		},
		{
			date:"03.25",
			award_name:"球衣",
			award_number:1
		},
		{
			date:"03.25",
			award_name:"球衣",
			award_number:1
		},
		{
			date:"03.25",
			award_name:"球衣",
			award_number:1
		}

	]
}
console.log(JSON.stringify(a))

*/

	


//主页面
function addHome(){

	clearTimer();

	$('.main').contents().remove();//清除掉内容

	var home=template.home()
	$('.main').append(home)
	//点击 开始 按钮
	$('.start-btn').click(function(){

		if(isfans==1){

			webEvents.emit('luckEvent')
		}else{
			webEvents.emit('PopupEvent.createFocus')
		}
	})


}

//清除摇奖页面的灯计时器
function clearTimer(){

	if(timer!=null){

		clearInterval(timer);
		timer=null;
	}

}
//摇奖页面
function addluck(){


	clearTimer();

	$('.main').contents().remove();
	var luck=template.luck()
	$('.main').append(luck)

	
	$('.round-pan').height($('.round-pan').width());//shit for round fixer

	//查看我的中奖礼品
	$('.myAwardBtn').click(function(){
		webEvents.emit('PopupEvent.myAwardEvent')
	})

	//开始抽奖按钮点击 事件
	$('.zhizheng').click(function(){

		awardData.getAward().then(function(param){

			$('.round-pan').animate({ d: param.rotate+(360*10) },{
			    step: function(now,fx) {
			      $(this).css('-webkit-transform','rotate('+now+'deg)'); 
			      $(this).css('-moz-transform','rotate('+now+'deg)');
			      $(this).css('transform','rotate('+now+'deg)');
			    },
			    duration:5000,
			    complete:function(){

			    	if(param.data.get==1){

			    		if(param.data.virtual==1){
			    			//中了虚拟的奖品
							webEvents.emit('PopupEvent.virAwardEvent',param)

			    		}else{
			    			//中了实物奖品
			    			webEvents.emit('PopupEvent.realAward',param)
			    		}

			    	}else{

			    		alert('运气不佳,未中奖,继续加油哦！')
			    	}
			    }
			},'linear');

		},function(param){

			console.log(param)
		})

	})

	//灯闪闪
	var obj=$('.light>img')
	var n=1;
	timer=setInterval(()=>{
		if(n>3){
			n=1;
		}
		obj.attr("src","image/light"+n+".png")
		n++;
	},100)


}	

//主页面
webEvents.on('homeEvent',function(){
	addHome();
})

//摇奖页面
webEvents.on('luckEvent',function(){
	addluck();
})

//填写信息弹出窗口
webEvents.on('PopupEvent.WriteMessage',function(data){

	layout.createWriteMessage(data);
})
//关注弹出窗口
webEvents.on('PopupEvent.createFocus',function(){
	layout.createFocus();
})
//真实 奖品弹出窗口
webEvents.on('PopupEvent.realAward',function(data){
	layout.createRealAward(data);
})
//虚拟奖品弹出窗口
webEvents.on('PopupEvent.virAwardEvent',function(data){

	layout.createVirAward(data);
})
//我的奖品弹出窗口
webEvents.on('PopupEvent.myAwardEvent',function(){
	layout.createMyAward();
})
//webEvents.emit('PopupEvent.WriteMessage')

window.start=function(){

webEvents.emit('homeEvent')
}



//webEvents.emit('PopupEvent.createFocus')
//webEvents.emit('PopupEvent.realAward')
//webEvents.emit('luckEvent')
//webEvents.emit('PopupEvent.virAwardEvent')
//webEvents.emit('PopupEvent.myAwardEvent')


/*
请求中奖接口返回的数据
var one={
	"id":1,//奖品ID需要和本地奖品ID相同
	"virtual":1,//是否是虚拟奖品1是2不是
	"get":1,//是否中奖，1中奖，2未中奖
	"name":"微店十元优惠券"//奖品名称
	"gid":123//服务器端礼品生成ID,主要是为了提交信息时传入后台的，
	"pic":"image/quan.png"//奖品图片地址
}
console.log(JSON.stringify(one))*/

/*
请求我的中奖记录数据
{
	"list":[
		{"date":"03.25","award_name":"球衣","award_number":1},//date:中奖时间 award_name:中奖名称,award_number:奖品个数
		{"date":"03.26","award_name":"球衣","award_number":1},
		{"date":"03.27","award_name":"球衣","award_number":1},
		{"date":"03.28","award_name":"球衣","award_number":1},
		{"date":"03.29","award_name":"球衣","award_number":1}
	]
}
*/


/*		
	提交中奖信息接口
		var object={
			gid:123//服务端生成的中奖记录id
			username:"johnny",//中奖姓名
			userphone:"13817649610",//中奖手机号码
			useraddress:"上海市嘉定区黄鹤楼路188号18#108"//中奖地址
		}
	返回值:{
			status:1;//status是否成功提交 1成功 2提交失败
			info:null;//提交失败的提示信息

	}
*/