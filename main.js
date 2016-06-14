var style=require('mainStyle')
var template=require('template');
var webEvents=require('webEvents')

var layout=require('layout');


function addHome(){
	var home=template.home()
	$('.main').append(home)
}


function addluck(){
	var luck=template.luck()
	$('.main').append(luck)
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
webEvents.on('PopupEvent.WriteMessage',function(){

	layout.createWriteMessage();
})
//关注弹出窗口
webEvents.on('PopupEvent.createFocus',function(){

	layout.createFocus();
})

webEvents.on('PopupEvent.realAward',function(){

	layout.createRealAward();
})

webEvents.on('virAwardEvent',function(){

	layout.createVirAward();
})
webEvents.on('myAwardEvent',function(){

	layout.createMyAward();
})

//webEvents.emit('PopupEvent.WriteMessage')
//webEvents.emit('homeEvent')
//webEvents.emit('PopupEvent.createFocus')
//webEvents.emit('PopupEvent.realAward')
//webEvents.emit('luckEvent')
//webEvents.emit('virAwardEvent')
webEvents.emit('myAwardEvent')
