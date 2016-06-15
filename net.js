function ajax(url,data=null){

	return $.ajax({
	     type: 'GET',
	     url: url ,
	     data: data ,
	     dataType: 'json'

	});

}

function getMyAward(){


	return ajax("myaward.json")

}

function getAward(){


	return ajax("one.json")

}

function submitMessage(data){

	return ajax("setAward.json",data)
}	

module.exports={
	getMyAward,
	getAward,
	submitMessage
}