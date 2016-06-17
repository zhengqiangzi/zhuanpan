<?php
namespace Home\Controller;

use Think\Controller;
use Think\Exception;
/**
 * @name 轻应用用户微信授权Controller
 * @author perry
 * @version 1.0 2015-07-30
 */
class WxIndexController extends Controller {

	public $url;              //本轻应用的微信授权链接
	public $appurl;			 //本轻应用的前端入口页链接
	public $ret_url;          //微信授权通过后的回跳url
	//public $wx_link;         //微信自定义分享链接
	//public $wx_appId;       //公众号的唯一标识

	function _initialize(){

		$this->url = C('login_url');
		$this->appurl = C('front_url');
		$this->need_authorize = C('need_weixin_authorize');
		$this->ret_url=I('ret_url');
		if($this->ret_url){
			$this->appurl=$this->ret_url;
		}
		$this->illegal_url=C('illegal_url');
	}

	public function index() {
		if($this->need_authorize){
			$is_login=session(C('weixin_session_key'));
			if(!$is_login){
			if(APP_DEBUG && I('must_debug')=='eosi'){
					$model=M('apply_user');
					$result=$model->where(array('id'=>1))->find();
					$this->changeSession(C('weixin_session_key'), $result);
				}
				else {
				//判断是否要进行微信端Oauth2.0登录
				if ($this->isWeixin()) {
					$return_url=$this->url;
					if($this->ret_url){
						$return_url.="?ret_url=".$this->ret_url;
					}
					$wx_u_info=$this->userWx($return_url);
					}else{
						
							print "请在微信浏览器中打开本页面,谢谢您的关注.";
							exit();
						
					}
				}
			}
		}
		$this->appurl=str_replace('andgoto=', '#', $this->appurl);
		echo('<script>window.location="'.$this->appurl.'"</script>');
		exit();
	}

	/**
	 * @name 获取微信配置(包括js_ticket等和用户无关的全局缓存7200秒数据),本方法还供第三方开发者调用用来获取js_ticket
	 */
	public function wxConfig() {
		$para_url=I('url');
		if($para_url){
			$share_url=urldecode($para_url);
		}
		else {
			$share_url = $this->appurl;
		}
		$share_url=str_replace("&amp;", '&', $share_url);
		$res = $this->wxJsConfig($share_url);
		//perry add 20150813 获取当前用户是否已申领以及是否已获奖，区分不同微信分享文案
		//curl session 取不到 $uinfo=session(C('weixin_session_key'));	
		// $id = I('id');
		// if(ic_isPosInt($id)){
		// 	$check_re=$this->checkUserHasApply($id);
		// 	$res['is_winner']=$check_re['is_winner'];
		// 	$res['already_applied']=$check_re['already_applied'];
		// }
		echo json_encode($res);
	}
	
	#检查用户是否已提交过申请
	// private function checkUserHasApply($id){
	// 	$model = M('apply_user');
		
	// 	$map = array();
	// 	$map['id'] = $id;
	// 	$apply_user = $model->where($map)->find();
	// 	$re=array('already_applied'=>0,'is_winner'=>0);
	// 	if($apply_user){
	// 		$re['already_applied']=$apply_user['status'];  //1已申请 0为申请
	// 		if($apply_user['status']==1){
	// 			$isWinner = $this->getCurApplyUserIsWinner($id);
	// 			$re['is_winner']=$isWinner?1:0;  //是否成功获得奖品
	// 		}
	// 		else {
	// 			$re['is_winner']=0;
	// 		}
	// 	}
	// 	return $re;
	// }
	
	#获取当前登录用户详细信息(是否中奖)
	// private function getCurApplyUserIsWinner($id){
	// 	$apply_user_id=$id;
	// 	$apply_user_winner_model = M('apply_user_winner');
	// 	$map = array();
	// 	$map['apply_user_id'] = $apply_user_id;
	// 	$winner_list = $apply_user_winner_model->field('create_time')->where($map)->find();
	// 	return $winner_list;
	// }

	/**
	 * 记录用户信息到表里
	 */
	private function userAdd($info) {
		$openid=$info['openid'];
		$model=M('apply_user');
		$result=$model->where(array('openid'=>$openid))->find();
		$data['nickname']=$info['nickname'];
		$data['wx_sex']=$info['sex'];
		$data['province']=$info['province'];
		$data['city']=$info['city'];
		$data['country']=$info['country'];
		$data['headimgurl']=$info['headimgurl'];
		if($result){
			$data['update_time']=time();
			$res=$model->where(array('openid'=>$openid))->save($data);
			$data=array_merge($result,$data);
		}else{
			$data['openid']=$openid;
			$data['create_time']=time();
			$data['status'] = 0;
			$res=$model->add($data);
			$data['id']=$res;
		}
		if($res === false){
			$this->error('网络原因记录您的信息失败,请稍候再试.',$this->illegal_url);
		}
		else {
			$this->changeSession(C('weixin_session_key'), $data);
		}
	}
	/**
	 * 转换session
	 * @param 名称 $key
	 * @param 值 $value
	 */
	private function changeSession($key, $value) {
		$_SESSION [$key] = $value;
		session($key,$value);
	}

	/**
	 * 记录用户openid到session
	 * 检测是否获取到ipenid
	 */
	private function userWx($u){
		//微信端登录
		$state = I('state');
		if ($state == 'getOpenid') {
			try {
				//获取openid
				$u = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' . C('APPID') . '&secret=' . C ('APPSECRET') . '&code=' . $_GET['code'] . '&grant_type=authorization_code';
				$o = curlGet($u);
				if ($o['errcode']) {
					E('网络原因获取您的信息失败，请稍候再试。'.$o['errmsg'], $o['errcode']);
				}
				$url_user_info = "https://api.weixin.qq.com/sns/userinfo?access_token=".$o['access_token']."&openid=".$o['openid']."&lang=zh_CN";
				$o = curlGet($url_user_info);
				if (!$o['openid']) {
					E('网络原因获取您的微信信息失败，请稍候再试。',-112);
				}
				$this->userAdd($o);
			} catch (Exception $exc) {
				$this->error($exc->getMessage().'|'.$exc->getCode(),$this->illegal_url);
			}
		}
		//判断是否已经获取openid
		$openid = session(C('weixin_session_key'));
		if (!$openid) {
			$this->getOpenid($u);
		}

		return $o;
	}

	private function  wxClose($str) {
		echo "<script>alert('" . $str . "');WeixinJSBridge.invoke('closeWindow',{},function(res){});</script>";
		exit;
	}


	/**
	 * 微信用户Oauth2.0方式登录授权
	 * @param unknown $u
	 */
	private function getOpenid($u) {
		$url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' . C('APPID')
			. '&redirect_uri=' . urlencode($u)
			. '&response_type=code&scope=snsapi_userinfo&state=getOpenid#wechat_redirect';
		header('location:' . $url);
		exit;
	}

	/**
	 * 分享链接生成
	 * @param string $url
	 * @return $arr
	 */
	private function wxJsConfig($url = '') {

		$sdk = new \Home\ORG\WeixinSDK(C('APPID'),C('APPSECRET'));
		$s = new \Home\ORG\String();
		$arr = array();
		$arr['appId'] = C('APPID');
		$arr['timestamp'] = time();
		$jsapi_ticket = $sdk->getJs_ticket();
		$arr['nonceStr'] = $s->randString();
		$realurl = $url ? $url : 'http://' . $_SERVER['HTTP_HOST'] . __SELF__;
		$str = "jsapi_ticket=" . $jsapi_ticket . "&noncestr=" . $arr['nonceStr'] . "&timestamp=" . $arr['timestamp'] . "&url=" . $realurl;
		$arr['str'] = $str;
		$arr['signature'] = sha1($str);
		return $arr;
	}

	/**
	 * @name 本类中所有方法统一使用本方法做数据返回。
	 * @param int $code    返回代码（1表示数据成功获取，方法成功执行）
	 * @param array $datas  返回数据（当code=1时返回数据才有意义）
	 * @param string $msg   返回信息（当code！=1时msg提示前台用户错误原因）
	 */
	private function end($code,$datas,$msg){
		$arr['code'] = $code;
		$arr['msg'] = $msg;
		if($datas != null){
			$arr['datas'] = $datas;
		}else{
			$arr['datas'] = array();
		}
		echo(json_encode($arr));
		exit;
	}
	
	protected function error($message='',$jumpUrl='',$ajax=false) {
		if($jumpUrl!=$this->illegal_url){
			$redirect_url=$jumpUrl;
			$jumpUrl=$this->illegal_url;
		}
		$jumpUrl=$jumpUrl."?msg=".urlencode($message);
		if($redirect_url){
			$jumpUrl.=("&rurl=".urlencode($redirect_url));
		}
		$message='';
		header('location:' . $jumpUrl);
		exit;
		//parent::error($message,0,$jumpUrl,0);
		//$this->dispatchJump($message,0,$jumpUrl,$ajax);
	}

	/**
 * @name 判断是否是微信端访问
* @return boolean
*/
function isWeixin() {
	if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'micromessenger') !== FALSE) {
		return true;
	} else {
		return false;
	}
}



}
