app.filter('strDottedByAttrName',function(){

     return function(data,attr){

     	if(data.length<=0) return '';

     	var r=[]
     	for(var i=0;i<data.length;i++){
     		r.push(data[i][attr])
     	}

     	return r.toString()
     }

})