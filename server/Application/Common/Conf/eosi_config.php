<?php

return array (
		
		
		
		'upload'=>array(
				
				'maxSize'   =>3145728,
				'exts'      => array('jpg', 'gif', 'png', 'jpeg'),
				'rootPath'  =>'./Uploads/gift/',
				'savePath'  =>'',
				'saveName' => array('uniqid',''),
				'subName'  => array('date','Ymd')
         ),
		
		
		//微信配置
		//fotile 爱告白服务号
		// 'APPID'=>'wx07c9e65abb2b37f8',
		// 'APPSECRET'=>'d06fb63f30d4d0349c7d1dbc94e3b3b6',
		
		//omron服务号
		'APPID'=>'wx1f09dc1fabd6037a',
		'APPSECRET'=>'na',
		// benlei
		// 'APPID'=>'wx62d80f930f7b9382',
		// 'APPSECRET'=>'52dfe7fff5a419f2963d77ebf146e644',
		
		//是否需要进行微信授权 (不需要则只能自定义分享)
		'need_weixin_authorize'  =>0,
		//微站h5首页
		'front_url'=>'http://' . $_SERVER['HTTP_HOST'].'/app/index.php',
		//获得微信用户属性的url
		'weixin_url'=>'http://' . $_SERVER['HTTP_HOST'].'/Home/Index/get_info',
		//进行微信授权页的url
		'login_url'=>'http://' . $_SERVER['HTTP_HOST'].'/Home/Index/index',
		//微信授权后记录的session key
		'weixin_session_key'=>'weixin_user_auth5',
		
		
		//后台全局常量
		'LOGIN_TITLE' => 'EOSI-LOGIN', //登陆title
		'LOGIN_BANNER' => 'EOSI', //
		'LOGIN_APPLICATION' => 'Application', //登陆title
		'LOGIN_COMPANY' => '上海奥狮网络科技有限公司', //公司名称
		'INDEX_HEADER' => 'EOSI', //
		'PLATFORM_NAME' => 'omron自测后台管理', //平台名称
		'PLATFORM_VERSION' => '1.0', //平台版本
		'URL'=>'http://'.$_SERVER['HTTP_HOST'],

        'dati_cishu'=>'3',
      	'sub_order'=>array(

          '1'=>'A',
          '2'=>'B',
          '3'=>'C',
          '4'=>'D',
          '5'=>'E',
          '6'=>'F',
          '7'=>'G',
          '8'=>'H',
          '9'=>'I',
          '10'=>'J'
      	),
      	//每次从题库中抽取多少道题目给用户回答
      	'timu_count_max'=>20,
      	// //根据全国排名返回激励话语
      	// 'inspire_text'=>array(
      	// 		1=>array('不错呀！你是不是小O肚里的蛔虫！嘻嘻,坚持答题,大奖就是你的了！','blablabla'),
      	// 		10=>array('恩，还差一点点哟！快快快，再来一次，大奖一步之遥啦！','blablabla'),
      	// 		50=>array('很棒哟！要不要再试试！大奖就在眼前！','blablabla'),
      	// 		80=>array('哼！少壮不努力，年底没奖品！','blablabla'),
      	// 		1000000=>array('你你你你你！让小O伤心了！','可不可以再来一次？你一定手滑点错啦！'),
      			
      	// 	),

      	//根据全国排名返回激励话语
		//当前全国排名<=前面的数字时,就会从后面的话语中随便取一个显示,你记得把blablabla替换掉
		//如果不需要,则删掉,多个话语记得用'包起来,并且用,分割
		//排名段你可以自己再加,但必须按顺序来,比如你要再加个<=200的,则要加在80和1000000之间
		'inspire_text'=>array(
			    //小于等于第1名的话语
				1=>array('不错呀！你是不是小O肚里的蛔虫！嘻嘻，坚持答题，大奖就是你的了！'),
				//小于等于第10名
				10=>array('恩，还差一点点哟！快快快，再来一次，大奖一步之遥啦！','在这看脸的世界你却偏偏靠智商！','很棒！你的智商跟颜值相等！','果然最棒就是你!么么哒!爱你哦!','你这么聪明！吓死宝宝了！'),
				//小于等于第50名
				50=>array('很棒哟！要不要再试试！大奖就在眼前！','哎哟，不错噢，有本事你全答对啊！','优异的成绩得来不易,继续保持哦！','谁说你不棒！小O说你棒！','原来你一直在默默的关注小O！'),
				//小于等于第80名
				80=>array('哼！少壮不努力,年底没奖品！','我的天呐！你好懂小O,看好你哦！','从此以后,你就是小O的人了！','跟上小O的步伐，答题答题再答题！','好可惜,相信下一次会更好'),
                //小于等于第200名
                200=>array('你与大奖擦肩而过,再来一次吧！','再试试,放轻松,小O相信你可以全答对的！','从加油！加油！加油！你还需要多和小O交流！','差一点？没关系,再接再厉！'),
                //小于等于第300名
                300=>array('恭喜你,没有完全避开正确答案！','可不可以再来一次？你一定手滑点错啦！','呜~错太多了,没有大奖哦！'),
                //小于等于第500名
                500=>array('不好意思哟,答错太多,大奖不能给你哟！','你你你你你！让小O伤心了！','恩,小O可以和你促膝长谈,增进彼此了解么？'),
                //小于等于第800名
                800=>array('秉烛夜游怎么样？你会认识不一样的小O！','你距离大奖越来越远咯！','你这么乱选,小O会生气的！'),
				//小于等于第1000000名
				1000000=>array('天啦噜！你竟然不了解小O！！'),
				),


		 
);
