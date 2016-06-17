
class LocalData{

	getItem(param){

		return window.localStorage[param];

	}

	saveItem(key,value){

		window.localStorage[key]=value;

	}

}
var data=new LocalData();
module.exports=data;