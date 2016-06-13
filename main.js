var style=require('mainStyle')
var template=require('template');
var webEvents=require('webEvents')

var layout=require('layout');


function addHome(){
	var home=template.home()
	$('.main').append(home)
}


webEvents.on('homeEvent',function(){
	addHome();
})


webEvents.on('PopupEvent.WriteMessage',function(){

	layout.createWriteMessage();
})
webEvents.on('PopupEvent.createFocus',function(){

	layout.createFocus();
})
//webEvents.emit('PopupEvent.WriteMessage')
//webEvents.emit('PopupEvent.createFocus')
