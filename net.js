function ajax(url,data=null){

	return $.ajax({
	     type: 'GET',
	     url: url ,
	     data: data ,
	     dataType: 'json'

	});

}

function getMyAward(){


	return ajax("/app/myaward.json")

}

function getAward(){


	return ajax("/app/one.json")

}

function submitMessage(data){

	return ajax("/app/setAward.json",data)
}	

module.exports={
	getMyAward,
	getAward,
	submitMessage
}