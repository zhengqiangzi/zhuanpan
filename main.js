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


