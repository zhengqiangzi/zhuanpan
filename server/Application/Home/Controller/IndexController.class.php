<?php
namespace Home\Controller;

use Think\Controller;
use Think\Exception;
use Base\FrontController;
/**
 * @name 前端入口controller
 * @author cloud
 * @version 1.0 2016-05-30
 */
class IndexController extends Controller {

	
	function _initialize(){
		// parent::_initialize(); 引用Base\FrontController; 下方法
		
	}

	 // public function customReturn($status, $content)
  //   {
  //       $data['succ'] = $status;
  //       if (!$content) {
  //           $content = array();
  //       }
  //       $data['data'] = $content;
  //       //$this->ajaxReturn($data);
  //       // echo (json_encode($data,JSON_UNESCAPED_SLASHES));
  //       echo str_replace("\\/", "/", json_encode($data));
  //       exit;
  //   }
	public function customReturn($status,$content)
    {
         $data['succ'] = $status;
        if (!$content) {
            $content = array();
        }
         $data['data'] = $content;
        
        echo str_replace("\\/", "/", json_encode($data));
        exit;
    }
	private function changeSession($key, $value)
    {
        $_SESSION[$key] = $value;
        session($key, $value);
    }
	

public function index() {
		$this->display('index');
		exit;
}


	// public function index_info() {
		

	// 	try {
           
 //            $phone = I('phone');
           
 //            $map['phone']=$phone;
 //            $phone_wei_yi = M('userinfo')->where($map)->find();
           
 //            if ($phone_wei_yi) {
 //            	$succ = 1;
 //                $ajaxdata['data'] = "登陆成功";
 //                $data = array();
 //                $data['id'] = $phone_wei_yi['id'];
 //                $data['store_name'] = $phone_wei_yi['openid'];
 //                $data['realname'] = $phone_wei_yi['name'];
 //                $data['phone'] = $phone_wei_yi['phone'];
	// 			$this->customReturn($data);
 //            }
 //            	else{
 //            		throw new \Exception("网络原因保存您的注册信息未成功,请稍候再试", 1999);
 //            	}
	// 	}
 //        catch(\Exception $exc){
 //        	$succ = $exc->getCode() == 1 ? -1 : $exc->getCode();
 //            $datas = array('errcode' => $succ,'errmsg' => $exc->getMessage());
 //            $this->customReturn($datas);
 //        }

	// }


	public function zjqq(){
		$giftid=rand('1','5');
		$data=array();
		$data['id']=1;
		$data['virtual']=2;
		$data['get']=2;
		$data['name']='微店十元优惠券';
		$data['giftid']=time()+$giftid;


		// echo $giftid;
		// echo "++";
		// echo time();
		// echo "++";
		// echo time()+$giftid;
		$data['pic']="img/sss.png";
		$succ = 1;
		$this->customReturn($succ,$data);
	}
	public function mygift(){
		try{

			$openid=I('openid');
			// $openid=222;
			$map['openid']=$openid;
			$mygift=M('giftinfo')->where($map)->select();
			
			if($mygift){
				$count=count($mygift);

				for($i=0;$i<$count;$i++)
				{
					
					$lists["date"]=$mygift[$i]['date'];
					$lists["award_name"]=$mygift[$i]['giftname'];
					$lists["award_number"]=$mygift[$i]['nums'];
					$list[]=$lists;
				}
				$succ=1;
				 $this->customReturn($succ,$list);
				}
				else{
            		throw new \Exception("网络原因保存您的注册信息未成功,请稍候再试", 1999);
            	}
		}
		catch(\Exception $exc){
        	$succ = $exc->getCode() == 1 ? -1 : $exc->getCode();
            $datas = array('errcode' => $succ,'errmsg' => $exc->getMessage());
            $this->customReturn($succ,$datas);
        }
	}
	public function kuaidixx(){
		try{
			// $openid=I('openid');
			$openid=2222;
			if(!$openid)
			{
				throw new \Exception("网络原因保存您的注册信息未成功,请稍候再试", 1999);
			}
			$giftid=I('gid');
			$name=I('username');
			$phone=I('userphone');
			$addr=I('useraddress');
			$map['openid']=$openid;
			$map['giftid']=$giftid;
			$map['name']=$name;
			$map['phone']=$phone;
			$map['$addr']=addr;
			$map['create_time']=time();
			$map['status']=1;
			$addRe = M('userinfo')->add($map);
			if (!$addRe) {
                throw new \Exception("网络原因保存您的注册信息未成功,请稍候再试", 1999);
            }
			$succ = 1;
            $data = array();
            // $data['id'] = $addRe['id'];
            $data['name'] = $addRe['name'];
            $data['phone'] =$addRe['phone'];
            $data['openid'] = $addRe['openid'];
            $this->changeSession(C('weixin_session_key'), $data);
            $this->customReturn($succ, $data);
			
		}
		catch(\Exception $exc){
        	$succ = $exc->getCode() == 1 ? -1 : $exc->getCode();
            $datas = array('errcode' => $succ,'errmsg' => $exc->getMessage());
            $this->customReturn($succ, $datas);
        }
	}
	
		
	
}
