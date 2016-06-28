<!doctype html>
<html>
<head>
	<meta charset='utf-8'/>
	<meta name="viewport" content="width=device-width,target-densitydpi=high-dpi,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
	
	<script type="text/javascript" src="/app/weblib/createjs-2015.11.26.min.js"></script>
	<script type="text/javascript" src="/app/weblib/jquery.min.js"></script>
	<link type="text/css" rel="styleSheet" href="/app/dist/style.css?vesion=445214"/>
	<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
   	<title>橙天玩</title>
 <?php
	// require_once "jssdk.php";
	// $jssdk = new JSSDK("wx101f436c8f26adb6", "86be98b96e3aec971a43017a4fa254d1");
	// // $jssdk = new JSSDK("wx74bbbf82bcaf1008", "124e4af215d0efb88dfbcc0835b35e67");
	// $signPackage = $jssdk -> GetSignPackage();
	// echo $access_token;
?> 
   	
   	
   	<script type="text/javascript">
   		var wx_imgUrl = 'http://green.vcenter-shop.com/app/image/wx_share_big.jpg';
		var wx_link = 'http://green.vcenter-shop.com/app/index.php';
		var wx_title ='橙天玩-幸运大转盘';
		var wx_desc = '速来平安一账通，幸运橙天玩，转盘赢惊喜，每天壕礼送不停！';
		
		
		var wx_init=function() {
wx.onMenuShareAppMessage({
	title: wx_title, // 分享标题
	desc:wx_desc, // 分享描述
	link: wx_link, // 分享链接
	imgUrl: wx_imgUrl, // 分享图标
	type: '', // 分享类型,music、video或link，不填默认为link
	dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	success: function() {
	},
	cancel: function() {
	}
});
wx.onMenuShareTimeline({
	title: wx_desc,
	link: wx_link,
	imgUrl: wx_imgUrl,
	success: function() {
	},
	cancel: function() {
	}
});
};
wx.config({
//debug: true,
	appId: '<?php echo $signPackage["appId"]; ?>',
	timestamp:<?php echo $signPackage["timestamp"]; ?>,
	nonceStr: '<?php echo $signPackage["nonceStr"]; ?>',
	signature: '<?php echo $signPackage["signature"]; ?>',
	jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	});
wx.ready(wx_init);

wx.error(function (res) {
//alert(res.errMsg);
});
	</script>
   	
   	
   	
   	
   	
   	
   	
   	
   	
   	
   	
   	
   	
</head>
<body>


<div class="main">

</div>

<div class="loading">
	
	<div class="loading-text">
		<div class="loading-3"><img src="/app/image/bg3-loading.png"/></div>
		<div class="loading-2"><img src="/app/image/bg2-loading.png"/></div>
		<div class="loading-1"><img src="/app/image/bg-loading.png"/></div>
		<div class="loading-progress"><span class='number'></span><span class='tag'>%</span></div>
	</div>
		<div class="loading-tops">loading...</div>

	<div class="loading-logo">
			<img src="/app/image/logo-loading.png"/>
	</div>
</div>


<script type="text/javascript">
	//var isfans=2;//是否公众号的粉丝 1是，2否

var queue = new createjs.LoadQueue();
 queue.on("complete", handleComplete, this);
 queue.on("progress",progressHandler,this)
 queue.loadManifest([
     {id: "myImage", src:"/app/image/bg.jpg"},
     {id: "myImage2", src:"/app/image/award_bg.png"},
     {id: "myImage3", src:"/app/image/award-item-left.png"},
     {id: "myImage4", src:"/app/image/a-dai.png"},
     {id: "myImage5", src:"/app/image/pan.png"},
     {id: "myImage6", src:"/app/image/my-top.png"},
     {id: "myImage7", src:"/app/image/light1.png"},
     {id: "myImage8", src:"/app/image/light2.png"},
     {id: "myImage9", src:"/app/image/light3.png"},
 ]);
 function progressHandler(e){
 	var pro=Math.floor(e.progress*100)
 	$('.number').html(pro);
 }
 function handleComplete() {
    $('.loading').remove();
    queue=null;
 	window.start();
 }
</script>
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?d5ca7b47c86e42cd84f46d96a031b1e4";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>

<script type="text/javascript" src="/app/dist/bound.js?vesion=522"></script>
</body>
</html>
