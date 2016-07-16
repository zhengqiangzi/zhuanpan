app.directive('loadingImage',function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope:false,// {}, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs, $transclude) {




		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'ECMA', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		 replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
				
			if(iAttrs.lazySrc.length<=3){
					iElm.attr('src',iAttrs.errorSrc)

				

			}else{


				iElm.attr('src',"/images/loading.gif")

				var newImage=angular.element("<img src='"+iAttrs.lazySrc+"'/>")

				newImage.bind('load',function(){
					iElm.after(newImage)
					iElm.remove();
				})

				newImage.bind('error',function(){
					iElm.attr('src',iAttrs.errorSrc)
				})

			}


		}
	};
});