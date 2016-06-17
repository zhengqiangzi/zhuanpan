<?php

/**
 * 用户模型
 * @author harvey
 */

namespace Admin\Model;

use Think\Model;

class AuthUserModel extends Model {
    
    protected $tableName = 'auth_members'; 

    /**
     * 初始化
     */
    function _initialize() {
        $this->userModel = M("auth_members");
    }

    /**
     * 登录指定用户
     * @param  integer $uid 用户ID
     * @return boolean      ture-登录成功，false-登录失败
     */
    public function login($username, $password) {
        /* 检测是否在当前应用注册 */
        $user = $this->userModel->where("username='{$username}'")->find();

        if (!$user || 1 != $user['status']) {
            $this->error = '用户不存在或已被禁用！'; //应用级别禁用
            return false;
        }

        $aip = get_client_ip();

        if ($user['password'] != md5($password)) {
            $this->error = '用户名或密码错误！'; //应用级别禁用
            return false;
        }
        /* 登录用户 */
        $this->autoLogin($user);
        return true;
    }

    /**
     * 自动登录用户
     * @param  integer $user 用户信息数组
     */
    private function autoLogin($user) {
        /* 更新登录信息 */
        $data = array(
            'id' => $user['id'],
            'login_count' => array('exp', '`login_count`+1'),
            'last_login_time' => NOW_TIME,
            'last_login_ip' => get_client_ip(),
        );
        $this->userModel->save($data);

        /* 记录登录SESSION和COOKIES */
        $auth = array(
            'uid' => $user['id'],
            'username' => $user['username'],
            'last_login_time' => $user['last_login_time'],
        );

        session('user_auth', $auth);
        session('user_auth_sign', data_auth_sign($auth));
        session("nickname", $user['nickname']);
        session("uid", $user['id']);
        session("username", $user['username']);
    }

    /**
     * 根据ID获取用户名
     * @author harvey
     */
    public function getUserName($uid) {
        return $this->userModel->where(array('id' => (int) $uid))->getField('username');
    }

    /**
     * 注销当前用户
     * @return void
     */
    public function logout() {
        session('user_auth', null);
        session('user_auth_sign', null);
        session('uid', null);
        session('username', null);
        session("nickname", null);
    }

}
