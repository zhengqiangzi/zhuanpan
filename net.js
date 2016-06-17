function ajax(url,data=null){

	return $.ajax({
	     type: 'GET',
	     url: url ,
	     data: data ,
	     dataType: 'json'

	});

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