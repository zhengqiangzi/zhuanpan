<?php if (!defined('THINK_PATH')) exit();?><!doctype html>
<html>

	<head>
		<title></title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1">
        <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
        <script type="text/javascript" src="/dazhuanpan/Public/jquery.min.js"></script>
        <script type="text/javascript">
    
    </script>
	</head>

	<body>
            
            <div id='1s'>首页</div>
            
            <script type="text/javascript">
            $("#1s").click(function(){
            	
            
            	
            	$.ajax({
            		type:"get",
            		url:"index_info",
            		data:{
            			phone:2997676
            		},
            		async:true
            	});
            }
            )
            
            
            	
            </script>
	</body>

</html>