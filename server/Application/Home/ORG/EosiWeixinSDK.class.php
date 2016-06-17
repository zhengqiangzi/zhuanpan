<?php
namespace Home\ORG;
//curl调用微信api地址返回数据类 (access token 从接口获得,不从威信api获取)
class EosiWeixinSDK {
	private $appid;
	private $appsecret;
	private $access_token;
	//初始化appid 和 secret
	public function __construct(){ 
		$this->appid = C('APPID');
		$this->appsecret = C('APPSECRET');
		$token = S('token');
// 		dump($token);
		if( !empty($token) ){
			$this->access_token = $token;
		}else{
			$gettoken = $this->token();
// 			dump($gettoken);
			if ( isset($gettoken['errcode']) ) {
				$this->access_token = $gettoken['errmsg'];
			}
			if( isset($gettoken['access_token']) ){
				S('token',$gettoken['access_token'],30);
				$this->access_token = $gettoken['access_token'];
			}
		}
		//file_put_contents($_SERVER['DOCUMENT_ROOT'].'/Uploads/1.txt', $token);
	}
	//更新token
	private function token() {
		//$url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$this->appid."&secret=".$this->appsecret;
		$ctime=time();
		// $corpid=C('corpid');

		// $corpkey = C('corpkey');
		// $sign= md5($corpkey.$corpid.$ctime);
		// $url = 'http://hzwz.priligy.cn/Home/Service/get_wx_acc_t?corpid='.$corpid.'&timestamp='.$ctime.'&sign='.$sign;
		$url = 'http://fuwuhao.omronhealthcare.com.cn/Home/Service/private_eosii_get_wx_acc_t';
		$txt = $this->https_request($url);
		return $txt;
	}
	
	//不带post的curl
	private function curl_get($url) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
		$txt = curl_exec($ch);
		if($txt===false){
//			echo "cURL Error: " . curl_error($ch);
                    ob_start();
                    echo $url;
                    $info = curl_getinfo($ch);
                    var_dump($info);
                    $a = ob_get_contents();
                    file_put_contents('./test/1.txt', $a.curl_error($ch));
                    ob_clean();
		}
		//$info = curl_getinfo($ch);
		curl_close($ch);
		$txt = json_decode($txt,true);
		if( isset($txt['errcode']) ){
			//token过期重新获取token
			if( $txt['errcode']==42001 ){
				$this->token_now();
			}
		}
		// 		dump($txt);dump($info);die;
		return $txt;
	}
	
	private function curl_post($url, $body) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
		$txt = curl_exec($ch);
		if($txt===false){
//			echo "cURL Error: " . curl_error($ch);
//			$info = curl_getinfo($ch);
//			dump($info);
		}
		// 		$info = curl_getinfo($ch);
		curl_close($ch);
		$txt = json_decode($txt,true);
		if( isset($txt['errcode']) ){
			//token过期重新获取token
			if( $txt['errcode']==42001 ){
				$this->token_now();
			}
		}
		return $txt;
	}
	
	/**
	 * curl https 请求（支持 GET 和 POST）
	 * @param $url string
	 */
	private function https_request( $url, $data=NULL ) {
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
		if (!empty($data)){
			curl_setopt($curl, CURLOPT_POST, 1);
			curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
		}
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		$output = curl_exec($curl);
		#add
		//if($output===false){
		if ( curl_errno($curl) ) {
// 			echo "cURL Error: " . curl_error($curl);
			$info = curl_getinfo($curl);
// 			dump($info);
		}
		#add
		curl_close($curl);
		#add
		$output = json_decode($output, true);
		if( isset($output['errcode']) ){
			//token过期重新获取token
			if( $output['errcode']==42001 ){
				$this->token_now();
			}
		}
		#add
		return $output;
	}
	
	//curl下载图片
	public function curl_down_pic($url){
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$txt = curl_exec($ch);
		if($txt===false){
//			echo "cURL Error: " . curl_error($ch);
//			$info = curl_getinfo($ch);
//			dump($info);
		}
		$info = curl_getinfo($ch);
		curl_close($ch);
		return array('txt'=>$txt,'info'=>$info);
	}
	
	//马上更新token并缓存
	public function token_now() {
		$gettoken = $this->token();
		if ( isset($gettoken['errcode']) ) {
// 			$this->access_token = $gettoken['errmsg'];
			return $gettoken['errmsg'];
		}
		if( isset($gettoken['access_token']) ){
			S('token',$gettoken['access_token'],30);
			$this->access_token = $gettoken['access_token'];
			return true;
		}
	}
	
	function menuCreate($strPost) {
		$url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=".$this->access_token;
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $strPost);
		$txt = curl_exec($ch);
		$info = curl_getinfo($ch);
		curl_close($ch);
		return $txt;
	}
	//自定义菜单删除接口
	function deleteMenu() {
		$url = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=".$this->access_token;
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
		$txt = curl_exec($ch);
		$info = curl_getinfo($ch);
		curl_close($ch);
		$txt = json_decode($txt,true);
		return $txt;
	}
	
	//获取关注着列表
	function userGet() {
		$url = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=".$this->access_token;
		$txt = $this->https_request($url);
		return $txt;
	}
	
	//获取指定openid的用户的基本信息
	function userInfo($openid) {
		$url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=".$this->access_token."&openid=".$openid;
		$txt = $this->curl_get($url);
		return $txt;
	}
	
	//给指定openid的用户发送消息
	function sendMessage($body) {
		$url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=".$this->access_token;
		$txt = $this->curl_post($url, $body);
		return $txt;
	}
	
	//创建分组
	function createGroups($body) {
		$url = "https://api.weixin.qq.com/cgi-bin/groups/create?access_token=".$this->access_token;
		$txt = $this->curl_post($url, $body);
		return $txt;
	}
	
	//修改分组名
	function updateGroups($body) {
		$url = "https://api.weixin.qq.com/cgi-bin/groups/update?access_token=".$this->access_token;
		$txt = $this->curl_post($url, $body);
		return $txt;
	}
	
	//查询所有分组
	function getGroups() {
		$url = "https://api.weixin.qq.com/cgi-bin/groups/get?access_token=".$this->access_token;
		$txt = $this->curl_get($url);
		return $txt;
	}
	
	//查询用户所在分组
	function getidGroups($body) {
		$url = "https://api.weixin.qq.com/cgi-bin/groups/getid?access_token=".$this->access_token;
		$txt = $this->curl_post($url, $body);
		return $txt;
	}
	
	//移动用户分组
	function updateMembersGroups($body) {
		$url = "https://api.weixin.qq.com/cgi-bin/groups/members/update?access_token=".$this->access_token;
		$txt = $this->curl_post($url, $body);
		return $txt;
	}
	
	//上传多媒体文件
	function uploadMedia($data,$type){
		$url = "http://file.api.weixin.qq.com/cgi-bin/media/upload?access_token=".$this->access_token."&type=".$type;
		$txt = $this->curl_post($url, $data);
		return $txt;
	
	}
	
	//生成二维码
	function createQrcode($body) {
		$url = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=".$this->access_token;
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
		$txt = curl_exec($ch);
		$info = curl_getinfo($ch);
		curl_close($ch);
		return $txt;
	}
	
	//通过ticket换取二维码
	function showqrcode($ticket) {
		$url = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=".$ticket;
// 		$ch = curl_init();
// 		curl_setopt($ch, CURLOPT_URL, $url);
// 		curl_setopt($ch, CURLOPT_HEADER, 0);
// 		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// 		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
// 		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
// 		$txt = curl_exec($ch);
// 		$info = curl_getinfo($ch);
// 		curl_close($ch);
// 		dump($txt);
// 		dump($info);die;
// 		$txt = json_decode($txt,true);
// 		return $txt;
		$hander = curl_init();
// 		$fp = fopen('Uploads/images.jpg','wb');
		curl_setopt($hander,CURLOPT_URL,$url);
// 		curl_setopt($hander, CURLOPT_PROXY, "http://192.168.0.140:3128");//使用代理
// 		curl_setopt($hander,CURLOPT_FILE,$fp);
		//curl_setopt($hander,CURLOPT_HEADER,0);
		//curl_setopt($hander,CURLOPT_FOLLOWLOCATION,1);
		curl_setopt($hander,CURLOPT_SSL_VERIFYHOST,0);//https
		curl_setopt($hander,CURLOPT_SSL_VERIFYPEER,0);//https
		curl_setopt($hander,CURLOPT_RETURNTRANSFER,true);//以数据流的方式返回数据,当为false是直接显示出来
		//curl_setopt($hander,CURLOPT_TIMEOUT,60);
		$result = curl_exec($hander);
		$info = curl_getinfo($hander);
// 		dump($info);
// 		dump($result);
		curl_close($hander);
// 		$fp = fopen('Uploads/images.jpg','w');
// 		fwrite($fp, $result);
// 		fclose($fp);die;
		
// 		dump($result);exit;
		//fclose($fp);
		Return $result;
	}
	
	
	//上传图文消息素材
	function uploadnews($body) {
		$url = "https://api.weixin.qq.com/cgi-bin/media/uploadnews?access_token=".$this->access_token;
		$txt = $this->curl_post($url, $body);
		return $txt;
	}
	
	
	/**
	 * 使用code换取access_token
	 * @param $code
	 * @return json->array
	 */
	function oauth2Token($code) {
		//oauth2的方式获得openid
		$url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" . $this->appid . "&secret=" . $this->appsecret . "&code=" . $code . "&grant_type=authorization_code";
		$txt = $this->https_request($url);
		return $txt;
	}
	
	function oauth2Userinfo($token,$openid) {
		$url = "https://api.weixin.qq.com/sns/userinfo?access_token=" . $token . "&openid=" . $openid;
		$txt = $this->https_request($url);
		return $txt;
	}
	
        /**
        * 获取jsapi_ticket
        */
   //     function getJs_ticket() {
   //         if(S('JS_TICKET')){
   //             return S('JS_TICKET');
   //         }
   //         //$url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=".$this->access_token."&type=jsapi";
   //         //$txt = $this->https_request($url);
   //         $ctime=time();
			// $corpid=C('corpid');

			// $corpkey = C('corpkey');
			// $sign= md5($corpkey.$corpid.$ctime);
			// $url = 'http://hzwz.priligy.cn/Home/Service/get_wx_js_ticket?corpid='.$corpid.'&timestamp='.$ctime.'&sign='.$sign;
			// $txt = $this->https_request($url);
			// // dump($txt);
   //         if($txt['succ']){
   //             S("JS_TICKET",$txt['ticket'], 30);
   //             return $txt['ticket'];
   //         }else{
   //             return json_encode($txt);
   //         }
   //     }

        /**
        * 获取jsapi_ticket
        */
       function getJs_ticket() {
           if(S('JS_TICKET')){
               return S('JS_TICKET');
           }
           $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=".$this->access_token."&type=jsapi";
           $txt = $this->https_request($url);
           if($txt['errcode'] == 0){
           	   $exp_in = $txt['expires_in']>180? $txt['expires_in']-180:$txt['expires_in'];
               S("JS_TICKET",$txt['ticket'], $exp_in);
               return $txt['ticket'];
           }else{
               return 0;
           }
       }


       /**
        * 获取用户是否关注本公众号
        */
      function get_subscribe($openid, $return_arr=false){
      	$fp = fopen('http://hzwz.priligy.cn/Api/Index/get_subscribe/oid/'.$openid,'r');
		if($fp){
			$file='';  
		    while(!feof($fp)) {    
		        $file.=fgets($fp);  
		    }  
		    fclose($fp);    
		    $re = json_decode($file,true);
		    if($return_arr){
		    	return $re;
		    }
			//$re2 = array('succ'=>1, 're'=>json_decode($file,true));
			if(!$re){
				return 0;
			}
			return $re['subscribe'];

	    }
	    else {
	    	if($return_arr){
	    		return array('subscribe'=>'na');
	    	}
			//$re2=array('succ'=>0, 're'=>null);
			return '网络原因游戏暂不能进行,很抱歉哦.';
	    }  
		// dump($re2);
		//return $re2;
      }

      function get_access_token(){
        return $this->access_token;
       }


    // function get_access_token_arr(){
    //     return $this->token_arr;
    //    }
	
	
	
	
	
	
	
	
	
}