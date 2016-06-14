function home(){
	return `<div class="home">
				<div class="index-top">
					<div class="title"><img src="image/title.png"/></div>
					<div class="dai">
						<div class='dai-bg'><img src="image/top.png"/></div>
						<div class="a-dai"><img src="image/a-dai.png"/></div>
					</div>
				</div>
				<div class="index-bottom">
					<div class="start-btn"><a href='javascript:void(0)'><img src="image/btn-index.png"/></a></div>
					<div class="index-logo"><img src="image/logo-index.png"/></div>
					<img src="image/index-bottom.png" class='ib-bg'/>
				</div>

				<div class="caidai">
					<div class='dai-bg'><img src="image/caidai.png"/></div>
				</div>
			</div>`

}


function luck(){

	
	return `	 <div class="luck">
			<div class="luck-title"><img src="image/title2.png"/></div>	
		
			<div class="pan">
				<div class="round-pan"><img src="image/pan.png"/></div>
				<div class="zhizheng"><img src="image/zhizheng.png"/></div>
			</div>
			<div class="myAwardBtn"><a href='javascript:void(0)'><img src="image/myAwardBtn.png"/></a></div>
		</div>`

}

module.exports={

	home,
	luck
}