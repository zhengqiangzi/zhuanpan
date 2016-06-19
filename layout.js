var webEvents=require('webEvents');
var nets=require('net');
var pageData=require('PageData');
var ld=require('localdata')

var popup=null;
/*

	param:
		bgClickClose:bool,true点击背景可以关掉弹出窗口，false反之
*/
function createLayOut(bgClickClose=true){


	popup=$('<div class="popup"></div>');
	$(document.body).append(popup)

	if(bgClickClose)
	{
		popup.click(function(){
		$(this).remove();
		$('.popup-content').remove();
		popup=null;
		})
	}
}

function createWriteMessage(data){

	var name=ld.getItem("name")||"";
	var address=ld.getItem("address")||"";
	var phone=ld.getItem("phone")||"";

	var html=`
		<div class="write-message popup-content">
			<div class="write-message-image"><img src="/app/image/message-bg.png"/></div>
			<div class="write-form">
				<input type='hidden' value="${data.data.gid}" name='gid'/>
				<div class="write-item-manager">
					<div class="write-item">
						<div class="write-item-icon"><img src="/app/image/icon-1.png"/></div>
						<div class='write-item-input'><input type='text' placeHolder="请输入姓名" name='username' value='${name}'/></div>
					</div>

					<div class="write-item">
						<div class="write-item-icon"><img src="/app/image/icon-2.png"/></div>
						<div class='write-item-input'><input type='tel'  placeHolder="请输入手机号码"  name='userphone' value='${phone}'/></div>
					</div>

					<div class="write-item">
						<div class="write-item-icon"><img src="/app/image/icon-3.png"/></div>
						<div class='write-item-input'><input type='text' placeHolder="请输入地址" name='useraddress' value='${address}'/></div>
					</div>

				</div>
				<div class='write-message-submit-btn'><a href='javascript:void(0)'><img src="/app/image/submit-message.jpg"/></a></div>
			</div>
		</div>
	`
	createLayOut(false);
	$(document.body).append(html)


	$('.write-message-submit-btn>a').click(function(){

		var gid=$("input[name='gid']").val()
		var username=$("input[name='username']").val()
		var userphone=$("input[name='userphone']").val()
		var useraddress=$("input[name='useraddress']").val()

		if(gid.length<=0){
			alert('发生错误！请联系管理员!')
			return;
		}
		if(username.length<=1){
			alert('请正确填写姓名')
			return;
		}
		if(!/^1[0-9]{10}$/.test(userphone)){
			alert("请正确填写手机号码")
			return 
		}
		if(useraddress.length<=5){
			alert('请正确填写地址')
			return;
		}
		var object={
			gid:gid,
			username:username,
			userphone:userphone,
			useraddress:useraddress
		}

		ld.saveItem("name",username)
		ld.saveItem("phone",userphone)
		ld.saveItem("address",useraddress)

		nets.submitMessage(object).then(function(data){
			closePopup();
			if(data.status==1){
				//提交成功
				alert('提交信息成功！');
			}else{
				alert(data.info)
			}

		},function(){
			closePopup();
			console.log('提交信息发生异常')
		});
	})
}

function createFocus(){

	var html=`
		<div class="focus popup-content">
			<div class='focus-tips'><img src="/app/image/focus.png"/></div>

			<div class="close-btn"><img src="/app/image/close-btn.jpg"/></div>
		</div>
	`
	createLayOut();
	$(document.body).append(html)


	$('.close-btn').click(function(){
		closePopup();
	})
}

function createVirAward(data){

	var html=`
		<div class="virAward popup-content">
			<div class="vir-bg"><img src="/app/image/vir_bg.png"/></div>
			<div class="vir-award-content">
				<img src="${data.data.pic}"/>
			</div>
				<div class="star-manager">
					<div><img src="/app/image/star-left.png"/></div>
					<div><img src="/app/image/star-middle.png"/></div>
					<div><img src="/app/image/star-right.png"/></div>
				</div>
		</div>

	`
	$(document.body).append(html);


	createLayOut();
}

function createRealAward(data){

	var html=`
			<div class="realAward popup-content">
				<div class="star-manager">
					<div><img src="/app/image/star-left.png"/></div>
					<div><img src="/app/image/star-middle.png"/></div>
					<div><img src="/app/image/star-right.png"/></div>
				</div>
				<div class="realAward-image"><img src="/app/image/award_bg.png"/></div>
				<div class="realAwardImage"><img src="/app/image/quan.png"/></div>
				<div class="realAwardBtn"><img src="/app/image/btn.png"/></div>
			<div>
	`
	createLayOut(false);
	$(document.body).append(html);
	//关闭自己，并且跳到填写弹出窗口页面
	$('.realAwardBtn').click(function(){
		closePopup();
		webEvents.emit('PopupEvent.WriteMessage',data)
	})
}
//创建我的中奖纪录
 function createMyAward(){
		nets.getMyAward().then(function(data){

			var source=pageData(data.list);//中奖数据实翻页实例

			var item=`<div class="my-award-item">
						<div class="my-award-left"><img src="/app/image/award-item-left.png"/><span>3.25</span></div>
						<div class="my-award-middle">雨伞</div>
						<div class="my-award-right">3</div>
					</div>`

			var html=`
			<div class="myAward popup-content">
				<div class="xin-group">
					<div><img src="/app/image/xin.png"/></div>
					<div><img src="/app/image/xin.png"/></div>
					<div><img src="/app/image/xin.png"/></div>
				</div>

				<div class="myaward-top"><img src="/app/image/my-top.png"/><span class="close-btn-2"><img src="/app/image/close-btn2.png"/></span></div>
				<div class="myaward-middle">
					
				</div>
				<div class="myaward-bottom"><img src="/app/image/my-bottom.png"/>
					<div class="next-btn"><img src="/app/image/next.png"/></div>
				</div>
			<div>
			`

			createLayOut();
			$(document.body).append(html);

			//下一页数据
			$('.next-btn').click(function(){
				var data=source.next();
				if(data){
					$('.myaward-middle').contents().remove();
					for(var i=0;i<data.length;i++){
						var d=$(item);
						d.find('.my-award-left span').text(data[i].date);
						d.find('.my-award-middle').text(data[i].award_name);
						d.find('.my-award-right').text(data[i].award_number);
						$('.myaward-middle').append(d)
					}
					if(!source.hasNext()){

						$('.next-btn').addClass('disabled');

					}
				}else{

					$('.next-btn').remove();
					$('.myaward-middle').html("<div class='nodata'>暂时没有中奖数据！</div>")
				}
			})

			$('.next-btn').trigger('click')

			//关闭按钮
			$('.close-btn-2').click(function(){
				closePopup();
			})



		},function(e){
			console.log('error in my award data')
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
	createFocus,
	createRealAward,
	createVirAward,
	createMyAward

}