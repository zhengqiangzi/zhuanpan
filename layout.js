var webEvents=require('webEvents')

var popup=null;
function createLayOut(){
	popup=$('<div class="popup"></div>');
	$(document.body).append(popup)

	popup.click(function(){
		$(this).remove();
		$('.popup-content').remove();
		popup=null;
	})
}

function createWriteMessage(){
	var html=`
		<div class="write-message popup-content">
			<div class="write-message-image"><img src="image/message-bg.png"/></div>
			<div class="write-form">
				<div class="write-item-manager">
					<div class="write-item">
						<div class="write-item-icon"><img src="image/icon-1.png"/></div>
						<div class='write-item-input'><input type='text' placeHolder="请输入姓名"/></div>
					</div>

					<div class="write-item">
						<div class="write-item-icon"><img src="image/icon-2.png"/></div>
						<div class='write-item-input'><input type='tel'  placeHolder="请输入手机号码" /></div>
					</div>

					<div class="write-item">
						<div class="write-item-icon"><img src="image/icon-3.png"/></div>
						<div class='write-item-input'><input type='text'  placeHolder="请输入地址"/></div>
					</div>

				</div>
				<div class='write-message-submit-btn'><a href='javascript:void(0)'><img src="image/submit-message.jpg"/></a></div>
			</div>
		</div>
	`
	createLayOut();
	$(document.body).append(html)
}

function createFocus(){

	var html=`
		<div class="focus popup-content">
			<div class='focus-tips'><img src="image/focus.png"/></div>

			<div class="close-btn"><img src="image/close-btn.jpg"/></div>
		</div>
	`
	createLayOut();
	$(document.body).append(html)


	$('.close-btn').click(function(){
		closePopup();
	})
}

function createVirAward(){

	var html=`
		
		<div class="virAward popup-content">
	
			<div class="vir-bg"><img src="image/vir_bg.png"/></div>

			<div class="vir-award-content">
				<img src="image/quan.png"/>
			</div>
				<div class="star-manager">
					<div><img src="image/star-left.png"/></div>
					<div><img src="image/star-middle.png"/></div>
					<div><img src="image/star-right.png"/></div>

				</div>

		</div>


	`

	$(document.body).append(html);


	createLayOut();
}

function createRealAward(){
	var html=`
			<div class="realAward popup-content">
				<div class="star-manager">
					<div><img src="image/star-left.png"/></div>
					<div><img src="image/star-middle.png"/></div>
					<div><img src="image/star-right.png"/></div>
				</div>
				<div class="realAward-image"><img src="image/award_bg.png"/></div>
				<div class="realAwardBtn"><img src="image/btn.png"/></div>
			<div>
	`
	createLayOut();
	$(document.body).append(html);
	//关闭自己，并且跳到填写弹出窗口页面
	$('.realAwardBtn').click(function(){
		closePopup();
		webEvents.emit('PopupEvent.WriteMessage')
	})
}
//创建我的中奖纪录
 function createMyAward(){
	var html=`
			<div class="myAward popup-content">
				<div class="myaward-top"><img src="image/my-top.png"/></div>
				<div class="myaward-middle">
						
						<div class="my-award-item">
							<div class="my-award-left"><img src="image/award-item-left.png"/><span>3.25</span></div>
							<div class="my-award-middle">雨伞</div>
							<div class="my-award-right">3</div>
						</div>
					
						<div class="my-award-item">
							<div class="my-award-left"><img src="image/award-item-left.png"/><span>3.25</span></div>
							<div class="my-award-middle">雨伞</div>
							<div class="my-award-right">3</div>
						</div>

						<div class="my-award-item">
							<div class="my-award-left"><img src="image/award-item-left.png"/><span>3.25</span></div>
							<div class="my-award-middle">雨伞</div>
							<div class="my-award-right">3</div>
						</div>

						<div class="my-award-item">
							<div class="my-award-left"><img src="image/award-item-left.png"/><span>3.25</span></div>
							<div class="my-award-middle">雨伞</div>
							<div class="my-award-right">3</div>
						</div>

						<div class="my-award-item">
							<div class="my-award-left"><img src="image/award-item-left.png"/><span>3.25</span></div>
							<div class="my-award-middle">微店优惠券</div>
							<div class="my-award-right">3</div>
						</div>



				</div>
				<div class="myaward-bottom"><img src="image/my-bottom.png"/>
						
						<div class="next-btn"><img src="image/next.png"/></div>

				</div>
		

			<div>
	`

	createLayOut();
	$(document.body).append(html);



 }


function closePopup(){
	if(popup){
		popup.remove();
		$('.popup-content').remove();
		popup=null;
	}
}




module.exports={

	createWriteMessage,
	createFocus,
	createRealAward,
	createVirAward,
	createMyAward

}