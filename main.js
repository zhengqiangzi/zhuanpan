var style=require('mainStyle')
var template=require('template');
var webEvents=require('webEvents')
var layout=require('layout');
var awardData=require('awardData');
var net=require('net')
var preRotate=-1;
var timer=null;
var localdatas=require('localdata')
var step=5;
var consts=require('consts')
	
//如果本地没有用户唯一数据就请求，并存入本地数据 库
	net.getUserId({loginid:localdatas.getItem("loginid")||-1}).then(function(data){
		if(data.status==1){
			consts.leave_times=data.times||1;
			localdatas.saveItem('loginid',data.loginid);
		}
	},function(){
		console.log('get user id error')
	})
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

		/*if(isfans==1){*/

			webEvents.emit('luckEvent')
		/*}else{
			webEvents.emit('PopupEvent.createFocus')
		}*/
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
	$('.myAwardBtn .myaward_btn').click(function(){
		webEvents.emit('PopupEvent.myAwardEvent')
	})

	//开始抽奖按钮点击 事件
	$('.zhizheng').click(function(){

		if(consts.leave_times<=0)
		{

			alert('你今天的摇奖次数已用完！')
			return;
		}

		awardData.getAward().then(function(param){
			preRotate=param.rotate+step*360;
			step=step+3;
			webEvents.emit('coverEvent');

			$('.round-pan').animate({ d: preRotate},{

			    step: function(now,fx) {
			      $(this).css('-webkit-transform','rotate('+now+'deg)'); 
			      $(this).css('-moz-transform','rotate('+now+'deg)');
			      $(this).css('transform','rotate('+now+'deg)');
			    },
			    duration:3000,
			    complete:function(){
			    	if(param.data.get==1){

			    		if(param.data.virtual==1){
			    			//中了虚拟的奖品
							setTimeout(function(){
								webEvents.emit('PopupEvent.virAwardEvent',param);
								webEvents.emit('closeCoverEvent')

							},1000);

			    		}else{
			    			//中了实物奖品
			    			setTimeout(function(){
			    				webEvents.emit('PopupEvent.realAward',param);
			    				webEvents.emit('closeCoverEvent')
			    			},1000);
			    		}

			    	}else{

			    		setTimeout(function(){
							webEvents.emit('closeCoverEvent')
			    			webEvents.emit('PopupEvent.createFail')

			    		},1000);
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
		obj.attr("src","/app/image/light"+n+".png")
		n++;
	},100)


	$('.rule-trigger').click(function(){
			webEvents.emit('PopupEvent.rule')

	})
}	

//主页面
webEvents.on('homeEvent',function(){
	addHome();
})

//摇奖页面
webEvents.on('luckEvent',function(){
	addluck();
	webEvents.emit('PopupEvent.createFocus')

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


webEvents.on('coverEvent',function(){

	var cover=$('<div class="cover"></div>');
	$(document.body).append(cover)
})
webEvents.on('closeCoverEvent',function(){

	$('.cover').remove();

})
//中奖规则 
webEvents.on('PopupEvent.rule',function(){
	layout.createRule();
})

webEvents.on('PopupEvent.createFail',function(){
	layout.createFail();
})
webEvents.on('PopupEvent.createMessageSuccess',function(){
	layout.createMessageSuccess();
})

window.start=function(){

	webEvents.emit('homeEvent')
}


	//console.log(ld.getItem("name"))
	//console.log(ld.saveItem("age",301))
//webEvents.emit('PopupEvent.realAward')
//webEvents.emit('luckEvent')
//webEvents.emit('PopupEvent.virAwardEvent')
//webEvents.emit('PopupEvent.myAwardEvent')
//webEvents.emit('PopupEvent.createMessageSuccess')
//webEvents.emit('PopupEvent.rule')

