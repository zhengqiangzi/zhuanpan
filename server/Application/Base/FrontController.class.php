<?php

/**
 * 前台验证基类，所有前台的Controller都必须继承本类
 */
namespace Base;
use Think\Controller;

class FrontController extends Controller {

    public function _initialize() {
        $this->cur_url=$_SERVER["HTTP_HOST"].__ACTION__;
        if($_SERVER["QUERY_STRING"]){
          $output=array();
          parse_str($_SERVER["QUERY_STRING"],$output);
          unset($output['s']);
          if(count($output)){
            $query = http_build_query($output);
            $this->cur_url=$this->cur_url."?".$query;
          }
        }
        $this->cur_url='http://' .$this->cur_url;
        $this->weixin_user = $_SESSION[C('weixin_session_key')];
        $this->checkWxLogin();
    }

    //判断用户是否微信登陆
    protected function checkWxLogin() {
      if(!$this->weixin_user){
        $redirect_url = C('login_url')."?ret_url=".urlencode($this->cur_url);
        if(IS_AJAX){
          $this->customReturn(0,array('msg'=>"您还未登录或登录信息已过期,请重新登录.",'redirect_url'=>$redirect_url));
        }
        else {
          header('location:' . $redirect_url);
        }
        exit;
      }
    }

    public function customReturn($status,$content){
      $data['succ'] = $status;
      if(!$content){
        $content=array();
      }
      $data['data'] = $content;
      //$this->ajaxReturn($data);
      // echo (json_encode($data,JSON_UNESCAPED_SLASHES));
      echo str_replace("\\/", "/",  json_encode($data));
      exit;
    }

}
