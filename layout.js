var webEvents=require('webEvents');
var nets=require('net');
var pageData=require('PageData');
var ld=require('localdata')

var popup=null;
var conts=require('consts')

var citySelect=require('jquery.cityselect');

console.log(citySelect)

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

function createWriteMessage(data={data:{gid:1}}){

	var name=ld.getItem("name")||"";
	var address=ld.getItem("address")||"";
	var phone=ld.getItem("phone")||"";
	var phone_type_html=`
					<div class="write-item spec">
						<select>
							<option value="-1">请选择手机壳类型</option>
							<option value="iPhone6">iphone6</option>
							<option value="iPhone6Plus">iPhone6Plus</option>
						</select>
					</div>`
	var html=`


		<div class="write-message popup-content">
			<div class="write-message-image-top"><img src="/app/image/message-bg-top.png"/></div>
			<div class="write-message-image-middle">

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

							<div class="write-item spec" id="scx">
								<div class="shen"><select class='prov'></select></div>
								<div class="shi"><select class='city'></select></div>
								<div class="qu"><select class='dist'></select></div>

							</div>
							
							<div class="write-item">
								<div class="write-item-icon"><img src="/app/image/icon-3.png"/></div>
								<div class='write-item-input'><input type='text' placeHolder="请输入地址" name='useraddress' value='${address}'/></div>
							</div>

						</div>
						<div class='write-message-submit-btn'><a href='javascript:void(0)'><img src="/app/image/submit-message.jpg"/></a></div>
					</div>

			</div>
			<div class="write-message-image-bottom"><img src="/app/image/message-bg-bottom.png"/></div>
			

	
		</div>
	`
	createLayOut(false);

	$(document.body).append(html)

	if(data.data.id==2){

		$('.write-item-manager').append($(phone_type_html))
	}

	

	$('#scx').citySelect({
			url:"/app/js/city.min.js",
			prov:function(){return ld.getItem("shen")||'北京'}(),
			city:function(){return ld.getItem("shi")||'东城区'}(),
			dist:function(){return ld.getItem("dist")||''}(),
			nodata:"none"
	})


	$('.write-message-submit-btn>a').click(function(){

		var gid=$("input[name='gid']").val()
		var username=$("input[name='username']").val()
		var userphone=$("input[name='userphone']").val()
		var useraddress=$("input[name='useraddress']").val()
		var shen=$('.prov').val();
		var shi=$('.city').val();
		var dist=$('.dist').val()||'';
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
			useraddress:shen+shi+dist+useraddress
		}

		ld.saveItem("name",username)
		ld.saveItem("phone",userphone)
		ld.saveItem("address",useraddress)
		ld.saveItem("shen",shen)
		ld.saveItem("shi",shi)
		ld.saveItem("dist",dist)

		nets.submitMessage(object).then(function(data){
			closePopup();
			if(data.status==1){
				//提交成功
				webEvents.emit('PopupEvent.createMessageSuccess')
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
			<div class='focus-tips'><img src="/app/image/focus${conts.leave_times}.png"/></div>

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
			<div class="vir-bg"><img src="${data.data.pic}"/>

			<div class="vire-bg-close-btn"><img src="/app/image/close-btn2.png"/></div>
			</div>
				<div class="star-manager">
					<div><img src="/app/image/star-left.png"/></div>
					<div><img src="/app/image/star-middle.png"/></div>
					<div><img src="/app/image/star-right.png"/></div>
				</div>
		</div>

	`
	$(document.body).append(html);

	$('.vire-bg-close-btn').click(function(){

		closePopup();
	})
	createLayOut(false);
}

function createRealAward(data){

	var html=`
			<div class="realAward popup-content">
				<div class="star-manager">
					<div><img src="/app/image/star-left.png"/></div>
					<div><img src="/app/image/star-middle.png"/></div>
					<div><img src="/app/image/star-right.png"/></div>
				</div>

				<div class="realAward-image">

				<img src="${data.data.pic}"/>

					<div class="realAward-close-btn"><img src="/app/image/close-btn2.png"/></div>

				</div>


				<!--<div class="realAwardImage"><img src="/app/image/quan.png"/></div>-->
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

	$('.realAward-close-btn').click(function(){
		closePopup();
		
	})
}
//创建我的中奖纪录
 function createMyAward(){


 	var source=null;

		nets.getMyAward().then(function(data){

			source=pageData(data.list);//中奖数据实翻页实例

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
					<div class="pre-btn"><img src="/app/image/prev.png"/><img src="/app/image/prev_disabled.png"/></div>
					<div class="next-btn"><img src="/app/image/next.png"/><img src="/app/image/next_disabled.png"/></div>
				</div>
			<div>
			`


			createLayOut();
			$(document.body).append(html);

			//下一页数据
			$('.next-btn').click(function(){
				var data=source.next();

				setBtn();
				if(data){
					$('.myaward-middle').contents().remove();
					for(var i=0;i<data.length;i++){
						var d=$(item);
						d.find('.my-award-left span').text(data[i].date);
						d.find('.my-award-middle').text(data[i].award_name);
						d.find('.my-award-right').text(data[i].award_number);
						$('.myaward-middle').append(d)
					}
				}
			})

			//下一页数据
			$('.pre-btn').click(function(){
				var data=source.pre();
				setBtn();
				if(data){
					$('.myaward-middle').contents().remove();
					for(var i=0;i<data.length;i++){
						var d=$(item);
						d.find('.my-award-left span').text(data[i].date);
						d.find('.my-award-middle').text(data[i].award_name);
						d.find('.my-award-right').text(data[i].award_number);
						$('.myaward-middle').append(d)
					}
				}
			})

			
			//关闭按钮
			$('.close-btn-2').click(function(){
				closePopup();
			})

			if(data.list.length<=0){

				$('.next-btn,.pre-btn').remove();

				$('.myaward-middle').html('<div class="nodata">暂时没有中奖数据哦！请加油哦！</div>')

			}else{
				
				$('.next-btn').trigger('click')
			}


		},function(e){
			console.log('error in my award data')
		})

		//设置按钮是否可以点击 
		function setBtn(){

			if(source.hasNext()){

				$('.next-btn').removeClass('disabled')
			}else{

				$('.next-btn').addClass('disabled')
			}


			if(source.hasPrev()){
				$('.pre-btn').removeClass('disabled')
			}else{
				
				$('.pre-btn').addClass('disabled')
			}
		}

 }


function createRule(){

var html=`
			<div class="rule popup-content">
				
				<div class="rule-header"><img src="/app/image/rule-header.png"/>
					
					<div class="rule-close-btn"><img src="/app/image/close-btn2.png"/></div>

				</div>
				<div class="rule-content"><img src="/app/image/rule_content.png"/></div>



			<div>
	`
	createLayOut(false);
	$(document.body).append(html);

	$('.rule-close-btn').click(function(){

				closePopup();
	})


}

function createFail(){

	var html=`
			<div class="fail popup-content">
				
				<span>
					<img src="/app/image/fail.png"/>
					</span>


			<div>
	`
	createLayOut(false);
	$(document.body).append(html);


	$('.fail').click(function(){

				closePopup();
	})
}

function createMessageSuccess(){

	var html=`
			<div class="messageSuccess popup-content">
				
				<div class='messageSuccess-content'>
					<div><img src="/app/image/message-success.png"/></div>
					
					<div class='myawardbtn2'><img src="/app/image/myAwardBtn2.png"/></div>
					<div class='message-close-btn'><img src="/app/image/close-btn2.png"/></div>
				</div>


			<div>
	`
	createLayOut(false);
	$(document.body).append(html);


	$('.message-close-btn').click(function(){

				closePopup();
	})


	$('.myawardbtn2').click(function(){

		closePopup();
		webEvents.emit('PopupEvent.myAwardEvent')
	})


}


function closePopup(){
	if(popup){
		popup.remove();
		$('.popup-content').remove();
		popup=null;
	}
}

function DAlert(msg){


	var html=`<div class="Alert">
				
				<div class="core">
					<div class='core-msg'>${msg}</div>
					<div class='core-close-btn'><a href='javascript:void(0)'>关闭</a></div>

				</div>			

			</div>`

	$(document.body).append(html);


	$('.core-close-btn').click(function(){
			$(this).unbind();
			$(this).parents('.Alert').remove();
	})

}


module.exports={

	createWriteMessage,
	createFocus,
	createRealAward,
	createVirAward,
	createMessageSuccess,
	createMyAward,
	createRule,
	createFail,
	DAlert

}