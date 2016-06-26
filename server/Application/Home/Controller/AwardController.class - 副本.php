<?php
namespace Home\Controller;
use Think\Controller;
use Think\Exception;
/**
 * @author cloud
 * @version 1.0 2016-05-30
 */
class RandChar{
  function getRandChar($length){
   $str = null;
   $strPol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
   $max = strlen($strPol)-1;
   for($i=0;$i<$length;$i++){
    $str.=$strPol[rand(0,$max)];//rand($min,$max)生成介于min和max两个数之间的一个随机整数
   }
   return $str;
  }
 }
class AwardController extends Controller {
	
	function _initialize(){
		
	}
	function index(){
	}
	/*
		{"list":[
				{"date":"03.25","award_name":"球衣","award_number":1},
				{"date":"03.26","award_name":"手机壳","award_number":2},
				{"date":"03.27","award_name":"微店10元优惠券","award_number":3},
				{"date":"03.28","award_name":"阳伞","award_number":1},
				{"date":"03.29","award_name":"5元微店优惠券","award_number":1}
			]
		}
	*/
	function loginid(){
		// 进入页面抓取session
		$getloginid=I('loginid');

		// $getloginid有值便设置session并开始进入数据库查找，若无值便从else开始请求新的session；
		if($getloginid!="-1")
		{
			$lifetime =168 * 3600;    //7天；
			session_set_cookie_params($lifetime);
			session_start();
			$_SESSION['loginid']=$getloginid;
			// session_unset();
			// session_destroy();
			$arr=array();
			$arr["loginid"]=$getloginid;
			$arr["status"]=1;//1成功2失败

			// 查询是否为真
			$data=array();
			$data["loginid"]=$getloginid;
			$cfm_loginid=M('userinfo')->where($data)->find();

			if (!$cfm_loginid) {
				// 查询到的loginid与实际不符
				$arr["status"]=2;
				$arr["errmsg"]="该登录信息有误，请重新登录";
				$this->ajaxReturn($arr);
				return;
			}
			$time = time();
			$month=date('m',$time);
			$day=date('d',$time);
			$nowday=$month.$day;
			$timesdata=array();
			$timesdata["loginid"]=$getloginid;
			$timesdata["date"]=$nowday;
			$gettimes=M('loginid')->where($timesdata)->find();
			
			if($gettimes==null){
				$time = time();
				$month=date('m',$time);
				$day=date('d',$time);
				$nowday=$month.$day;
				$checkdate=array();
				$checkdate['loginid']=$getloginid;
				$checkdate['date']=$nowday;
				$check_in=M('loginid')->add($checkdate);
				$uptimes=array();
				$uptimes['times']=2;
				$datetype=M('userinfo')->where('loginid="'.$getloginid.'"')->save($uptimes);
				$arr["times"]=2;

				$this->ajaxReturn($arr);
				
			}else{
				$times = M('userinfo')->where('loginid="'.$getloginid.'"')->getField('times');
				$arr['times']=$times;
				$this->ajaxReturn($arr);
			}



			
		}else{
			// 空loginid将会执行下方方法获取新的loginid
			function findid(){
				$randCharObj = new RandChar();
				$loginid=$randCharObj->getRandChar(16);
				$data=array();
				$data['loginid']=$loginid;
				
				
				$find_lid=M('userinfo')->where($data)->find();
				if($find_lid)
				{
					findid();
					return false;
				}
				else
				{
					$data['times']=2;
					M('userinfo')->data($data)->add();
					$lifetime =168* 3600;    //7天；
					session_set_cookie_params($lifetime);
					session_Start();
					$_SESSION["admin"] = true; 
					$_SESSION["loginid"]=$loginid;
					return $loginid;
				}
				
			}
			$arr=array();
			$arr["loginid"]=findid();
			$arr["status"]=1;
			$arr["times"]=2;
			session_start();
			$this->ajaxReturn($arr);
		}
	}
	
	function myaward(){
		$list=array();
		$list["sucess"]=1;
		$list['list']=array();
		session_start();
		$loginid=$_SESSION["loginid"];
		// $openid=$loginid;
		$map['loginid']=$loginid;
		$mygift=M('giftinfo')->where($map)->select();
		if ($mygift) {
			for($i=0;$i<count($mygift);$i++)
				$list["list"][$i]=array("date"=>$mygift[$i]['date'],"award_name"=>$mygift[$i]['giftname'],"award_number"=>$mygift[$i]['get']);
		}
		// $list["list"][0]=array("date"=>"03.25","award_name"=>"球衣","award_number"=>1);
		// $list["list"][1]=array("date"=>"03.25","award_name"=>"球衣","award_number"=>1);
		// $list["list"][2]=array("date"=>"03.25","award_name"=>"球衣","award_number"=>1);
		// $list["list"][3]=array("date"=>"03.25","award_name"=>"球衣","award_number"=>1);
		// $list["list"][4]=array("date"=>"03.25","award_name"=>"球衣","award_number"=>1);
		
		$this->ajaxReturn($list);
	}
	//{"id":2,"virtual":2,"get":1,"name":"手机壳","gid":123,"pic":"image/quan.png"}
	function one(){
		session_start();
		$loginid=$_SESSION["loginid"];

		$times = M('userinfo')->where('loginid="'.$loginid.'"')->getField('times');

		if($times==0){
			$data=array();
			$data['times']=0;
			$data['msg']="今日可玩次数已用光，请明日继续！";
			$this->ajaxReturn($data);
			return;
		}else
		{
				$uptimes=array();
				$uptimes['times']=$times-1;
				$datetype=M('userinfo')->where('loginid="'.$loginid.'"')->save($uptimes);
				
		}
	
		function get_rand($proArr) { 
		    $result = ''; 
		    //概率数组的总概率精度
		    $proSum = array_sum($proArr); 
		    //概率数组循环
		    foreach ($proArr as $key => $proCur) { 
		        $randNum = mt_rand(1, $proSum); 
		        if ($randNum <= $proCur) { 
		            $result = $key; 
		            break; 
		        } else { 
		            $proSum -= $proCur; 
		        } 
		    } 
		    unset ($proArr); 
		    return $result; 
		}
// 		$prize_arr是一个二维数组，记录了所有本次抽奖的奖项信息，其中id表示中奖等级，prize表示奖品，v表示中奖概率。注意其中的v必须为整数，你可以将对应的奖项的v设置成0，即意味着该奖项抽中的几率是0，数组中v的总和（基数），基数越大越能体现概率的准确性。本例中v的总和为100，那么平板电脑对应的中奖概率就是1%，如果v的总和是10000，那中奖概率就是万分之一了。
// 每次前端页面的请求，PHP循环奖项设置数组，通过概率计算函数get_rand获取抽中的奖项id。将中奖奖品保存在数组$res['yes']中，而剩下的未中奖的信息保存在$res['no']中，最后输出json个数数据给前端页面。
		$map=array();
		$map['stock']=array('neq','0');
		$select_stocks=M('stocks')->where($map)->select();
		 // dump($select_stocks);
		$stocks=array();
		$stocks=$select_stocks;
		// $prize_arr = array( 
		//     '0' => array('id'=>1,'prize'=>'平板电脑','v'=>1), 
		//     '1' => array('id'=>2,'prize'=>'数码相机','v'=>5), 
		//     '2' => array('id'=>3,'prize'=>'音箱设备','v'=>10), 
		//     '3' => array('id'=>4,'prize'=>'4G优盘','v'=>12), 
		//     '4' => array('id'=>5,'prize'=>'10Q币','v'=>22), 
		//     '5' => array('id'=>6,'prize'=>'下次没准就能中哦','v'=>50), 
		// ); 
		
		// dump($prize_arr);
		//如果中奖数据是放在数据库里，这里就需要进行判断中奖数量
		//在中1、2、3等奖的，如果达到最大数量的则unset相应的奖项，避免重复中大奖
		//code here eg:unset($prize_arr['0'])

		foreach ($stocks as $key => $val) { 
		    $arr[$val['id']] = $val['probability']; 
		} 
		$rid = get_rand($arr); //根据概率获取奖项id
		// echo $rid;
		
		$giftid=rand(1000,9999).time().$stocks[$rid-1]['id'];
		// 前端返回
		$returnData['id']=$stocks[$rid-1]['id'];
		$returnData['virtual']=$stocks[$rid-1]['virtual'];
		$returnData['get']=$stocks[$rid-1]['get'];
		$returnData['name']=$stocks[$rid-1]['name'];
		$returnData['pic']=$stocks[$rid-1]['imgurl'];
		$returnData['gid']=$giftid;
		
		
		if($stocks[$rid-1]['id']==6)
		{
			$this->ajaxReturn($returnData);
			return;
		}
		else
		{
			// 输出中奖内容
			$time = time();
			$month=date('m',$time);
			$day=date('d',$time);
			$nowday=$month.$day;
			$data=array();
			$data['giftid']=$giftid;
			$data['date']=$nowday;
			$data['giftname']=$stocks[$rid-1]['name'];
			$data['virtual']=$stocks[$rid-1]['virtual'];
			$data['pic']=$stocks[$rid-1]['imgurl'];
			$data['get']=$stocks[$rid-1]['get'];
			$data['gid']=$stocks[$rid-1]['id'];
			$data['openid']=$openid;
			$data['loginid']=$loginid;
			// dump($data['loginid']);
			// 根据用户身份插入数据,若openid与loginid均无数据。则无法插入。
			if(!$data['openid'] && !$data['loginid'])
			{
				$baduser=array();
				$baduser['errmsg']="出现网络问题，请稍后尝试!";
				$this->ajaxReturn($baduser);
				return;
			}
			// 查看用户当日是否已经参与，若有，则无法再次参与
			$map=array();
			$map['date']=array('eq',0);
			$map['_query']='openid='.$openid.'&loginid='.$loginid.'&_logic=or';
			$findtoday=M('giftinfo')->where($map)->select();
			if($findtoday){
				$baduser=array();
				$baduser['errmsg']="一天只有一次机会哟，明日再来吧";
				$this->ajaxReturn($baduser);
				return;
			}
			//数据库写入：
			$addgit=M('giftinfo')->data($data)->add();
			}
			$this->ajaxReturn($returnData);
	}
	/*{
	"status":1,
	"info":"服务器异常"
	}*/
	function setAward(){
		$time = time();
		$month=date('m',$time);
		$day=date('d',$time);
		$nowday=$month.$day;
		$gid=I('gid');
		$username=I('username');
		$userphone=I('userphone');
		$useraddress=I('useraddress');
		$loginid=I('loginid');
		
		// 查找该ID当日是否已经中奖，若无则可以添加信息；
		$map=array();
		$map['times']=array('eq',0);
		$map['_query']='openid='.$openid.'&loginid='.$loginid.'&_logic=or';
		// $findtoday=M('userinfo')->where($map)->select();
		// dump($map);
		// dump($findtoday);
		// if(!$findtoday){
			$adddata=array();
			$adddata['loginid']=$loginid;
			$adddata['name']=$username;
			$adddata['phone']=$userphone;
			$adddata['addr']=$useraddress;
			// $adddata['giftid']=$gid;
			$adddata['creat_time']=$nowday;
			$adddata['status']=0;
			$addsql=M('userinfo')->where('loginid="'.$loginid.'"')->save($adddata);
			if($addsql)
			{
				$data=array();
				$data['status']=1;
				$data['info']="添加成功";
				$data["success"]=1;
				$this->ajaxReturn($data);
			}
			else
			{
				$data=array();
				$data['status']=1;
				$data['info']="网络异常，请稍后再试！";
				$data["success"]=1;
				$this->ajaxReturn($data);
			}
		// }else
		// {
		// 	$data=array();
		// 	$data['status']=1;
		// 	$data['info']="今日已经中奖，请明日再来参与！";
		// 	$data["success"]=1;
		// 	$this->ajaxReturn($data);
		// }
		
		
		
	}
}