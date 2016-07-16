	'http://madhouse.mp.com/ad/campaign/ajaxmedia?priceType=1&mediaType=002&adtype=&campaigntype=&mediaattr=&',
	'http://madhouse.mp.com/ad/campaign/ajaxadspace?priceType=1&mediaid=logoDiv_136'
	'http://madhouse.mp.com/ad/campaign/ajaxnetwork?priceType=1&mediaType=002&adType=2&_=1467854705672'

module.exports=app.provider('network',function () {
	

	this.$get = function($resource,$q) {

			var nets = $resource('http://madhouse.mp.com/ad/campaign/:actionName',{},{

					media: {
						params:{
							actionName:'ajaxmedia',
							mediaType:"002",
							adtype:null
						},
						method: 'GET',
						responseType:"json",
						isArray:true
					},
					adSpace:{

						params:{
							actionName:"ajaxadspace"
						},
						method: 'GET',
						responseType:"json",
						isArray:true

					},
					tableList:{

						params:{
							actionName:"ajaxnetwork"
						},
						isArray:false,
						method:"GET",
						responseType:"json"
					},

					otv:{
						params:{
							actionName:"ajaxVideoNetwork"
						},
						isAarray:false,
						responseType:'json',
						method:"GET"

					}

			});

		return  {
			media:function(params){

				
				return nets.media(params).$promise;
				/*var defer=$q.defer()
				
				defer.reject({b:123})

				return defer.promise*/

			},
			adSpace:function(params){

				return nets.adSpace(params).$promise;
			},

			tableList:function(params){
				return nets.tableList(params).$promise
			},
			otvSelect:function(params){
				return nets.otv(params).$promise;
			}	


		}
	};
})

