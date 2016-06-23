function home(){
	return `<div class="home">
				<div class="index-top">
					<div class="title"><img src="/app/image/title.png"/></div>
					<div class="dai">
						<div class='dai-bg'><img src="/app/image/top.png"/></div>
						<div class="a-dai"><img src="/app/image/a-dai.png"/></div>
					</div>
				</div>
				<div class="index-bottom">
					<div class="start-btn"><a href='javascript:void(0)'><img src="/app/image/btn-index.png"/></a></div>
					<div class="index-logo"><img src="/app/image/logo-index.png"/></div>
					<img src="/app/image/index-bottom.png" class='ib-bg'/>
				</div>

				<div class="caidai">
					<div class='dai-bg'><img src="/app/image/caidai.png"/></div>
				</div>
			</div>`

}


function luck(){

	
	return `<div class="luck">
			<div class="luck-title">
				<img src="/app/image/title2.png"/>
				
				<div class="jingbi"><img src="/app/image/luck-ani-1.png"/></div>
				<div class="bao"><img src="/app/image/luck-ani-2.png"/></div>
			</div>	
		
			<div class="pan">
				<div class="round-pan"><img src="/app/image/pan.png"/></div>
				<div class="zhizheng"><img src="/app/image/zhizheng.png"/></div>

				<div class="light">
					<img src="/app/image/light1.png"/>
				</div>
			</div>
			<div class="myAwardBtn">

				<div><a href='javascript:void(0)' class='rule-trigger'><img src="/app/image/rule_btn.png"/></a></div>
				<div><a href='javascript:void(0)'><img src="/app/image/times.png"/></a></div>
				<div><a href='javascript:void(0)' class='myaward_btn'><img src="/app/image/myAwardBtn.png"/></a></div>


			</div>
		</div>`

}

module.exports={

	home,
	luck
}