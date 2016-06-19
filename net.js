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

	return ajax("/Home/Award/myaward","")
	// return ajax("/app/myaward.json")
}

function getAward(){


	return ajax("/Home/Award/one")

}

function submitMessage(data){

	return ajax("/Home/Award/setAward",data)
}	

module.exports={
	getMyAward,
	getAward,
	submitMessage
}