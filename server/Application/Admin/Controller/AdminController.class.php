<?php

namespace Admin\Controller;

use Base\BaseController;

class AdminController extends BaseController {

    public function _initialize() {
        $this->default_redirect_url = '/Admin/ApplyUser/index';
    }
    //登录后默认跳转页
    

    //后台首页
    public function index() {
        //判断是否登录
        if (is_login()) {
            redirect(__APP__ . $this->default_redirect_url);
        } else {
            redirect(__APP__ . '/Admin/Admin/login');
        }
    }

    //后台登录页面
    public function login() {
        //判断是否登录
        if (is_login()) {
            redirect(__APP__ . $this->default_redirect_url);
        } else {
            $this->display();
        }
    }

    //获取后台登录验证码
    public function verify() {
        $verify = new \Think\Verify();
        $verify->entry(1);
    }

    //验证后台登录
    public function loginForm() {
        $username = trim(I('username'));
        if (empty($username)) {
            $this->out_error_info('帐号错误！');
        }
        $password = trim(I('password'));
        if (empty($password)) {
            $this->out_error_info('密码必须！');
        }
         $verify = trim(I('verify'));
        if (!check_verify($verify)) {
            $this->out_error_info('验证码输入错误！');
        } 

        /* 登录用户 */

        $User = D('AuthUser');
        $user = $User->login($username, $password);

        if ($user) { //登录用户
            //跳转到登录前页面
            $this->success('登录成功！', __APP__ . $this->default_redirect_url);
        } else {
            $this->out_error_info($User->getError());
        }
    }

    //返回错误信息
    public function out_error_info($message) {
        $this->ajaxReturn(array('data' => '', 'info' => $message, 'status' => 0));
    }

    //后台登出
    public function logout() {
        //判断是否登录
        if (is_login()) {
            D('AuthUser')->logout();
            session('[destroy]');
            $this->success('退出成功！', U('login'));
        } else {
            redirect(__APP__ . '/Admin/Admin/login');
        }
    }

}
