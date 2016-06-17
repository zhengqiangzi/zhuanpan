<?php

namespace Base;

use Think\Controller;

header('Content-type:text/html;charset=utf-8');

class BaseController extends Controller {

    public function _initialize() {
        
    }
    
    //判断用户是否登陆
    protected function checkLogin() {
        $uid = session('uid') ? true : false;
        if (!$uid) {
            $this->error('请先登陆', __APP__ . '/Admin/Admin/login');
        }
    }

}
