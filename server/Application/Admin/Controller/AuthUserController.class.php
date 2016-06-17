<?php

namespace Admin\Controller;

use Base\BackController;

class AuthUserController extends BackController {

    //用户列表
    public function user() {
        $this->user_model = M('auth_members');
        $this->status_arr = array(
            '0' => '无效',
            '1' => '有效'
        );
        //任务总数
        $total = $this->user_model->count();
        //每页条数
        $listRows = C('LIST_ROWS') > 0 ? C('LIST_ROWS') : 10;
        //实例化分页类
        $page = new \Admin\ORG\PageNew($total, $listRows, '');
        if ($total > $listRows) {
            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
        }
        $p = $page->show();
        $this->assign('_page', $p ? $p : '');

        $dataList = $this->user_model->order('id desc')->limit("$page->firstRow,$page->listRows")->select();

        //数据处理
        foreach ($dataList as $k => $value) {
            //状态
            if ($value['status'] == 1) {
                $value['status_str'] = "<span class=\"label label-sm label-success arrowed-in\"> " . $this->status_arr[$value['status']] . " </span>&nbsp;|&nbsp;&nbsp;&nbsp;<span class=\"hand icon-lock red bigger-125\" title=\"禁用\" onclick=\"setUserStatus('close','{$value['id']}');\"></span>";
            } else {
                $value['status_str'] = "<span class=\"label label-sm label-info arrowed-in\"> " . $this->status_arr[$value['status']] . " </span>&nbsp;|&nbsp;&nbsp;&nbsp;<span class=\"hand icon-unlock green bigger-125\" title=\"启用\" onclick=\"setUserStatus('open','{$value['id']}');\"></span>";
            }
            $value['last_login_time_str'] = date('Y-m-d H:i:s', $value['last_login_time']);

            $dataList[$k] = $value;
        }
        $this->assign('_list', $dataList);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '用户管理');
        $this->assign('actionName', '用户列表');
        $this->display('Auth:User:user');
    }

    //添加用户
    public function addUser() {
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '用户管理');
        $this->assign('actionName', '添加用户');
        $this->display('Auth:User:addUser');
    }

    //保存用户
    public function insertUser() {
        $username = I('username');
        $password = I('password');
        $nickname = I('nickname');
        $map = array();
        $map['username'] = $username;
        $data = M('auth_members')->where($map)->find();
        if (!empty($data)) {
            $this->error("用户名\"{$username}\"已存在");
        }
        $saveData = array();
        $saveData['username'] = $username;
        $saveData['password'] = md5($password);
        $saveData['nickname'] = $nickname;
        $saveData['create_time'] = time();
        $flag = M('auth_members')->add($saveData);
        if ($flag) {
            $this->success('用户添加成功', __CONTROLLER__ . '/user');
        } else {
            $this->error('用户添加失败');
        }
    }

    //开启用户|关闭用户
    public function setUserStatus() {
        $type = I('type');
        $userid = I('id');
        if (empty($type) || empty($userid)) {
            $this->error('丢失参数');
        }
        if ($type == 'open')
            $str = '启用用户';
        if ($type == 'close')
            $str = '禁用用户';

        $data = array();
        $data['id'] = $userid;
        if ($type == 'open') {
            $data['status'] = 1;
        }
        if ($type == 'close') {
            $data['status'] = 0;
        }
        $flag = M('auth_members')->save($data);
        if ($flag) {
            $this->success("{$str}成功", U('user'));
        } else {
            $this->error("{$str}失败");
        }
    }

    //编辑用户
    public function editUser() {
        $userid = I('id');
        if (empty($userid)) {
            $this->error('缺失主键');
        }
        $data = M('auth_members')->where("id={$userid}")->find();
        if (empty($data)) {
            $this->error("用户不存在");
        }
        $this->assign("data", $data);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '用户管理');
        $this->assign('actionName', '编辑用户');
        $this->display('Auth:User:editUser');
    }

    //更新用户
    public function updateUser() {
        $userid = I('id');
        if (empty($userid)) {
            $this->error("缺失主键");
        }
        $username = I('username');
        $nickname = I('nickname');

        $map = array();
        $map['username'] = $username;
        $map['id'] = array("neq", $userid);
        $data = M('auth_members')->where($map)->find();
        if (!empty($data)) {
            $this->error("用户名\"{$username}\"已存在");
        }
        $saveData = array();
        $saveData['id'] = $userid;
        $saveData['username'] = $username;
        $saveData['nickname'] = $nickname;
        $flag = M('auth_members')->save($saveData);
        if ($flag) {
            $this->success("用户编辑成功", __CONTROLLER__ . "/user");
        } else {
            $this->error("用户编辑失败，可能未做修改");
        }
    }

    //删除用户
    public function deleteUser() {
        $userid = I('id');
        if (empty($userid)) {
            $this->error('缺失主键');
        }
        //删除用户
        $flag = M('auth_members')->where("id={$userid}")->delete();
        if ($flag) {
            $this->success('删除用户成功', __CONTROLLER__ . '/user');
        } else {
            $this->error('删除用户失败');
        }
    }

    //修改用户密码
    public function editPwd() {
        $userid = I('id');
        $password = I('password');
        if (empty($userid)) {
            $this->error('缺失主键');
        }
        $saveData = array();
        $saveData['id'] = $userid;
        $saveData['password'] = md5($password);
        $flag = M('auth_members')->save($saveData);
        if ($flag) {
            $this->success('修改密码成功', __CONTROLLER__ . '/user');
        } else {
            $this->error('修改密码失败,可能未做修改');
        }
    }

}
