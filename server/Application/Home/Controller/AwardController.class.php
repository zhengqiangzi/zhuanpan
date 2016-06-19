<?php
namespace Home\Controller;

use Think\Controller;
use Think\Exception;
/**
 * @author cloud
 * @version 1.0 2016-05-30
 */
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
		$loginid="999";

		$arr=array();
		$arr["loginid"]=$loginid;
		$arr["status"]=1;//1成功2失败

		$this->ajaxReturn($arr);
	}
	function myaward(){

		$list=array();
		$list["sucess"]=1;
		$list['list']=array();
		$openid="222";
		$map['openid']=$openid;
		$mygift=M('giftinfo')->where($map)->select();
		if ($mygift) {
			for($i=0;$i<count($mygift);$i++)
				$list["list"][$i]=array("date"=>$mygift[$i]['date'],"award_name"=>$mygift[$i]['giftname'],"award_number"=>$mygift[$i]['nums']);
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
		$time = time();
		$month=date('m',$time);
		$day=date('d',$time);
		$nowday=$month.$day;
		
		$openid="openeverthing";

		$data=array();
		$data["gid"]=2;
		$data["virtual"]=2;
		$data["get"]=rand(1,5);
		$data["giftname"]="手机壳";
		$giftid=time().gid;
		$data['openid']=$openid;
		$data["giftid"]=$giftid;
		$data['date']=$nowday;
		$data["pic"]="image/quan.png";
		$data["success"]=1;
		// dump($data);
		M('giftinfo')->data($data)->add();

		$returnData=array();
		$returnData["success"]=1;
		$returnData["id"]=$data["gid"];
		$returnData["get"]=$data["get"];






		$this->ajaxReturn($returnData);

	}

	/*{
	"status":1,
	"info":"服务器异常"
	}*/
	function setAward(){
		$data=array();
		$data['status']=1;
		$data['info']="服务器异常";
		$data["success"]=1;
		$this->ajaxReturn($data);

	}
}
