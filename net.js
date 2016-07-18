var localdatas=require('localdata')
var uid=function(){return localdatas.getItem("loginid")||-1};
function ajax(url,data=null){

	var best=$("<div class='best'><div>正在加载信息...</div></div>");
	$(document.body).append(best)
	var ajax= $.ajax({
	     type: 'GET',
	     url: url ,
	     data: data ,
	     dataType: 'json'

	})

	ajax.then(function(){

		$('.best').remove();

	},function(){

		$('.best').remove();

	})
	return ajax;

}

function getMyAward(){

	return ajax("/Home/Award/myaward",{loginid:uid()})
	// return ajax("/app/myaward.json")
}

function getAward(){


	return ajax("/Home/Award/one",{loginid:uid()})

	// return ajax("/app/one.json")
}

function getUserId(data){

	return ajax("/Home/Award/loginid",data)
}

function submitMessage(data){

	data.loginid=uid;
	return ajax("/Home/Award/setAward",data)
}	

module.exports={
	getMyAward,
	getAward,
	submitMessage,
	getUserId
}