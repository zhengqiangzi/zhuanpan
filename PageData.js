class PageData{


	constructor(data){
		this._data=data;
		this._pagesize=3;
		this._index=-1;
	}

	next(){
		this._index++;
		var result= this.getData();

		if(!result){
			this._index--;
		}
		return result
	}

	pre(){
		this._index--
		var result= this.getData();
		if(!result){

			this._index++;
		}
		return result;
	}

	hasNext(){

		var start=this._index*this._pagesize;
		var end=start+this._pagesize-1;
		return end+1>=this._data.length?false:true;

	}
	hasPrev(){

		if(this._index>0){

			return true
		}

		return false;

	}

	getData(){

		var result=[];
		var start=this._index*this._pagesize;
		var end=start+this._pagesize-1;
		for(var i=start;i<=end;i++){
			if(typeof(this._data[i])!='undefined'){
				result.push(this._data[i])
			}else{
				break;
			}
		}
		return result.length>0?result:false;
	}
}


module.exports=function(data){


	return new PageData(data);
}