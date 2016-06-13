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

function closePopup(){
	if(popup){
		popup.remove();
		$('.popup-content').remove();
		popup=null;
	}
}




module.exports={

	createWriteMessage,
	createFocus

}