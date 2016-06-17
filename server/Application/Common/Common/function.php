<?php

/**
     * 对传入字符串做安全过滤,防止sql注入或xss攻击
     * @param string $str 传入字符串
     * @return string
     */
    function ic_filterStr($str)
    {
        $farr = array(
                "/<(\\/?)(script|i?frame|style|html|body|title|link|meta|object|\\?|\\%)([^>]*?)>/isU",
                "/(<[^>]*)on[a-zA-Z]+\s*=([^>]*>)/isU",
                "/select|insert|update|delete|\'|\/\*|\*|\.\.\/|\.\/|union|into|load_file|outfile|dump/is"
        );
        $str = preg_replace($farr,'',$str);
        return $str;
    }
     
    /**
     * 过滤接受的参数或者数组,如$_GET,$_POST
     * @param array|string $arr 接受的参数或者数组
     * @return array|string
     */
    function ic_filterArr($arr)
    {
        if(is_array($arr)){
            foreach($arr as $k => $v){
                $arr[$k] = ic_filterArr($v);
            }
        }else{
            $arr = ic_filterStr($arr);
        }
        return $arr;
    }

function ic_isCellPhone($str){
	if(preg_match("/^1[3456789]\d{9}$/", $str)){
		return true;
	}
	return false;
}

/**
 * 判断传入参数是否为正整数
 *
 * @param unknown_type $value
 */
function ic_isPosInt($value){
	if(!is_numeric($value)){
		return false;
	}
	$value=intval($value);
	if($value<=0){
		return false;
	}

	return true;
}

/**
 * 判断传入字符串是否全由数字组成
 *
 * @param unknown_type $str
 * @return unknown
 */
function ic_onlyNumberStr($str){
	$reg="/^\d+$/";
	if (preg_match($reg,$str)){
		return 1;
	}
	else{
		return 0;
	}
}

/**
 * 返回当前月，格式为1506这样
 * @return smallint
 */
function ic_curMonth(){
	return ic_specMonthBefore(0);
}

/**
 * 返回上月，格式为1506这样
 */
function ic_lastMonth(){
	return ic_specMonthBefore(1);
}

/**
 * 返回前月，也即当前月-2月
 */
function ic_theMonthBeforeLastMonth(){
	return ic_specMonthBefore(2);
}

/**
 * @name 返回指定几个月前
 * @param int $c 指定月
 */
function ic_specMonthBefore($c){
	if(!(ic_isPosInt($c)||$c==0)){
		throw new Exception('ic_specMonthBefore参数必须正整数',-1);
	}
	$time=time();
	for($i=0;$i<$c;$i++){
		$time = strtotime('first day of last month',$time);
	}
	return ic_dateToStr($time, 'ym');
}



/**
 * 判断传入值是否 不为空字符串,不空返回true，为空返回false
 * perry add 2012-03-20
 *
 * @param unknown_type $str
 */
function ic_checkUnEmpty($str) {
	// 检测字符串是否为空，是去掉中文空格和英文空格后再验证的
	if (strlen ( $str ) <= 0) {
		return false;
	}
	$nstr = preg_replace ( "/[\s]+/", "", $str );
	$nstr = preg_replace ( "/[\s|　]+/", "", $nstr );
	if (strlen ( $nstr ) > 0) {
		return true;
	} else {
		return false;
	}
}

/**
 * 将时间戳转换为可阅读的字符串格式
 * Author:perry
 * CreateTime:2012-03-15
 *
 * @param unknown_type $timeStamp
 *        	待转换时间戳
 * @param unknown_type $format
 *        	转换格式，默认y-m-d H:i:m
 * @return unknown
 */
function ic_dateToStr($timeStamp, $format = 'y-m-d H:i:m') {
	if (empty ( $timeStamp ) || (null == $timeStamp)) {
		return '';
	}
	$time = date ( $format, $timeStamp );
	return $time;
}

/**
 * 将时间字符串转化成时间戳,如果转化失败返回0
 *
 * @param unknown_type $strDate
 * @return unknown
 */
function ic_strToTimeStamp($strDate) {
	$re = strtotime ( $strDate );
	if (! $re) {
		return 0;
	}
	return $re;
}

/**
 * 检测用户是否登录
 * @return integer 0-未登录，大于0-当前登录用户ID
 * @author harvey
 */
function is_login() {
    $user = session('user_auth');
    if (empty($user)) {
        return 0;
    } else {
        return session('user_auth_sign') == data_auth_sign($user) ? $user['uid'] : 0;
    }
}

/**
 * 数据签名认证
 * @param  array  $data 被认证的数据
 * @return string       签名
 * @author harvey
 */
function data_auth_sign($data) {
    //数据类型检测
    if (!is_array($data)) {
        $data = (array) $data;
    }
    ksort($data); //排序
    $code = http_build_query($data); //url编码并生成query字符串
    $sign = sha1($code); //生成签名
    return $sign;
}

/**
 * 检测验证码
 * @param  integer $id 验证码ID
 * @return boolean     检测结果
 * @author harvey
 */
function check_verify($code, $id = 1) {
    $verify = new \Think\Verify();
    return $verify->check($code, $id);
}


function curlGet($url, $data = NULL) {
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
	if (!empty($data)) {
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	}
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	$output = curl_exec($curl);
	#add
	if (curl_errno($curl)) {
		$info = curl_getinfo($curl);
		dump($info);
	}
	#add
	curl_close($curl);
	#add
	$output = json_decode($output, true);
	return $output;
}

/**
 * 判断设备是否为移动端
 */

function ic_isMobile(){
    // 如果有HTTP_X_WAP_PROFILE则一定是移动设备
    if (isset ($_SERVER['HTTP_X_WAP_PROFILE']))
        return true;
 
    //此条摘自TPM智能切换模板引擎，适合TPM开发
    if(isset ($_SERVER['HTTP_CLIENT']) &&'PhoneClient'==$_SERVER['HTTP_CLIENT'])
        return true;
    //如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息
    if (isset ($_SERVER['HTTP_VIA']))
        //找不到为flase,否则为true
        return stristr($_SERVER['HTTP_VIA'], 'wap') ? true : false;
    //判断手机发送的客户端标志,兼容性有待提高
    if (isset ($_SERVER['HTTP_USER_AGENT'])) {
        $clientkeywords = array(
            'nokia','sony','ericsson','mot','samsung','htc','sgh','lg','sharp','sie-','philips','panasonic','alcatel','lenovo','iphone','ipod','blackberry','meizu','android','netfront','symbian','ucweb','windowsce','palm','operamini','operamobi','openwave','nexusone','cldc','midp','wap','mobile'
        );
        //从HTTP_USER_AGENT中查找手机浏览器的关键字
        if (preg_match("/(" . implode('|', $clientkeywords) . ")/i", strtolower($_SERVER['HTTP_USER_AGENT']))) {
            return true;
        }
    }
    //协议法，因为有可能不准确，放到最后判断
    if (isset ($_SERVER['HTTP_ACCEPT'])) {
        // 如果只支持wml并且不支持html那一定是移动设备
        // 如果支持wml和html但是wml在html之前则是移动设备
        if ((strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') !== false) && (strpos($_SERVER['HTTP_ACCEPT'], 'text/html') === false || (strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'], 'text/html')))) {
            return true;
        }
    }
    return false;
}

function ic_check_ip_format($ip) {
        if (!preg_match("/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/", $ip)) {
            return false;
        }
        $ipa = explode('.', $ip);
        $len = count($ipa);
        $zcount = 0;
        $mcount = 0;
        for ($i = 0; $i < $len; $i++) {
            if ($ipa[$i] > 255 || $ipa[$i] < 0) {
                return false;
            }
            if ($ipa[$i] == 0) {
                $zcount++;
            } elseif ($ipa[$i] == 255) {
                $mcount++;
            }
        }
        if ($zcount == 4 || $mcount == 4) {
            return false;
        }
        return true;
    }

  /**
     * @name 将数组key去掉
     * @author  perry
     * @version  1.0 2015/9/21
     * @param unknown_type $arr
     * @param unknown_type $split
     */
	 function ic_getArrayValuesArray($arr, $subKey = false) {
        $re = false;
        foreach ($arr as $key => $val) {
            if ($subKey) {
                if (is_array($val)) {
                    $re[] = $val[$subKey];
                } else {
                    $re[] = $val->$subKey;
                }
            } else {
                $re[] = $val;
            }
        }

        return $re;
    }


    /**
     * @name 安全的根据数组key返回value，如果下标越界或键名称不存在，返回null
     * tips:最多支持2维数组
     * @param int $c 指定月
     */
     function ic_get_safe_arr_val($key, $arr, $sub_key = false, $default_return_val = null) {
        if (is_array($arr) || method_exists($arr, 'toArray')) {
            if (!is_array($arr)) {
                $arr = $arr->toArray();
            }
            if (array_key_exists($key, $arr)) {
                if ($sub_key) {
                    return ic_get_safe_arr_val($sub_key, $arr[$key]);
                }
                return $arr[$key];
            }
            return $default_return_val;
        }
        return $default_return_val;
    }


    /**
     * 将指定秒转换成xx天xx小时xx分格式
     * @author zhuyanhua 2016-01-07
     * @return string
     */
 function convert_seconds($sec){
        $re='';
        if($sec>86400){
            $re=$re.(floor($sec/86400))."天";
            $sec = $sec % 86400;
        }
        if($sec>3600){
            $re=$re.(floor($sec/3600))."小时";
            $sec = $sec % 3600;
        }
        if($sec>60){
            $re=$re.(floor($sec/60))."分";
            $sec = $sec % 60;
        }
        if($re==''){
            $re=$sec."秒";
        }
        return $re;

    }


    /**
* @邮箱
*/
function ic_isEmail($subject) {
$pattern='/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/';
if(preg_match($pattern, $subject)){
return true;
}
return false;
}


/**
* @name 判断是否是微信端访问
* @return boolean
*/
function ic_isWeixin() {
	if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'micromessenger') !== FALSE) {
		return true;
	} else {
		return false;
	}
}

/**
 * @author Tujt 2015-11-16
 */
function timeToDate($time,$type='Y-m-d') {
    if(empty($time)) return '';
	return date($type,$time);
}
/**
 * @author Tujt 2015-11-23
 */
function WeixinSex($wx_sex) {
	$sex = '';
    switch($wx_sex){
        case '1':
            $sex = '男';
            break;
        case '2':
            $sex = '女';
            break;
		default:
			$sex = '未知';
    }
	return $sex;
}