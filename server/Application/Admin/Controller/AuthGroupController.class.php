<?php

namespace Admin\Controller;

use Base\BackController;

class AuthGroupController extends BackController {

    //群组列表
    public function group() {
        $this->group_model = M('auth_group');
        $this->status_arr = array(
            '0' => '无效',
            '1' => '有效'
        );
        //任务总数
        $total = $this->group_model->count();
        //每页条数
        $listRows = C('LIST_ROWS') > 0 ? C('LIST_ROWS') : 10;
        //实例化分页类
        $page = new \Admin\ORG\PageNew($total, $listRows, '');
        if ($total > $listRows) {
            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
        }
        $p = $page->show();
        $this->assign('_page', $p ? $p : '');

        $dataList = $this->group_model->order('id desc')->limit("$page->firstRow,$page->listRows")->select();

        //数据处理
        foreach ($dataList as $k => $value) {
            //状态
            if ($value['status'] == 1) {
                $value['status_str'] = "<span class=\"label label-sm label-success arrowed-in\"> " . $this->status_arr[$value['status']] . " </span>&nbsp;|&nbsp;&nbsp;&nbsp;<span class=\"hand icon-lock red bigger-125\" title=\"关闭用户组\" onclick=\"setGroupStatus('close','{$value['id']}');\"></span>";
            } else {
                $value['status_str'] = "<span class=\"label label-sm label-info arrowed-in\"> " . $this->status_arr[$value['status']] . " </span>&nbsp;|&nbsp;&nbsp;&nbsp;<span class=\"hand icon-unlock green bigger-125\" title=\"开启用户组\" onclick=\"setGroupStatus('open','{$value['id']}');\"></span>";
            }
            $dataList[$k] = $value;
        }
        $this->assign('_list', $dataList);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '群组管理');
        $this->assign('actionName', '群组列表');
        $this->display('Auth:Group:group');
    }

    //添加群组
    public function addGroup() {
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '群组管理');
        $this->assign('actionName', '添加群组');
        $this->display('Auth:Group:addGroup');
    }

    //保存群组
    public function insertGroup() {
        $title = I('title');
        $map = array();
        $map['title'] = $title;
        $data = M('auth_group')->where($map)->find();
        if (!empty($data)) {
            $this->error("用户组\"{$title}\"已存在");
        }

        $saveData = array();
        $saveData['title'] = $title;
        $flag = M('auth_group')->add($saveData);
        if ($flag) {
            $this->success('用户组添加成功', __CONTROLLER__ . '/group');
        } else {
            $this->error('用户组添加失败');
        }
    }

    //开启群组|关闭群组
    public function setGroupStatus() {
        $type = I('type');
        $groupid = I('id');
        if (empty($type) || empty($groupid)) {
            $this->error("丢失参数");
        }
        if ($type == 'open')
            $str = '开启用户组';
        if ($type == 'close')
            $str = '关闭用户组';

        $data = array();
        $data['id'] = $groupid;
        if ($type == 'open') {
            $data['status'] = 1;
        }
        if ($type == 'close') {
            $data['status'] = 0;
        }
        $flag = M('auth_group')->save($data);
        if ($flag) {
            $this->success("{$str}成功", U('group'));
        } else {
            $this->error("{$str}失败");
        }
    }

    //编辑群组
    public function editGroup() {
        $groupid = I('id');
        if (empty($groupid)) {
            $this->error("缺失主键");
        }
        $data = M('auth_group')->where("id={$groupid}")->find();
        if (empty($data)) {
            $this->error("用户组不存在");
        }
        $this->assign("data", $data);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '群组管理');
        $this->assign('actionName', '编辑群组');
        $this->display('Auth:Group:editGroup');
    }

    //更新群组
    public function updateGroup() {
        $groupid = I('id');
        if (empty($groupid)) {
            $this->error("缺失主键");
        }
        $title = I('title');

        $map = array();
        $map['title'] = $title;
        $map['id'] = array("neq", $groupid);
        $data = M('auth_group')->where($map)->find();
        if (!empty($data)) {
            $this->error("用户组\"{$title}\"已存在");
        }
        $saveData = array();
        $saveData['id'] = $groupid;
        $saveData['title'] = $title;
        $flag = M('auth_group')->save($saveData);
        if ($flag) {
            $this->success('用户组编辑成功', __CONTROLLER__ . '/group');
        } else {
            $this->error('用户组编辑失败，可能未做修改');
        }
    }

    //删除群组
    public function deleteGroup() {
        $groupid = I('id');
        if (empty($groupid)) {
            $this->error('缺失主键');
        }
        //删除群组
        $flag = M('auth_group')->where("id={$groupid}")->delete();
        if ($flag) {
            $this->success('删除用户组成功', __CONTROLLER__ . '/group');
        } else {
            $this->error('删除用户组失败');
        }
    }

    //访问授权
    public function rulePermit() {
        $groupid = I('id');
        if (empty($groupid)) {
            $this->error('缺失主键');
        }
        $data = M('auth_group')->where("id={$groupid}")->find();
        if (empty($data)) {
            $this->error('用户组不存在');
        }
        $this->assign('groupid', $groupid);
        $this->assign('grouptitle', $data['title']);

        //所有有效的规则
        $rules = M('auth_rule')->field("id,name,title")->where("status=1")->select();
        $this->assign("rules", json_encode($rules));

        $selectRules = M('auth_group')->where("id={$groupid}")->getField("rules");
        $this->assign("selectRules", $selectRules);

        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '群组管理');
        $this->assign('actionName', '访问授权');
        $this->display('Auth:Group:rulePermit');
    }

    //保存访问授权
    public function rulePermitSave() {
        $groupid = I('groupid');
        $ruleid = I('ruleid');
        $status = I('status');

        $selectRules = M('auth_group')->where("id={$groupid}")->getField("rules");
        if (!empty($selectRules)) {
            $selectRulesArr = explode(",", $selectRules);
        }
        if ($status == 'true') {
            if (strpos($ruleid, "#")) {
                $ruleidArr = explode("#", $ruleid);
            } else {
                $ruleidArr[] = $ruleid;
            }
            if (!empty($selectRulesArr)) {
                $newSelectRulesArr = array_merge($selectRulesArr, $ruleidArr);
            } else {
                $newSelectRulesArr = $ruleidArr;
            }
            $newSelectRulesArr = array_unique($newSelectRulesArr);
            asort($newSelectRulesArr);

            $saveData = array();
            $saveData['id'] = $groupid;
            $saveData['rules'] = implode(",", $newSelectRulesArr);
            M('auth_group')->save($saveData);
            $this->success('授权成功');
        } else {
            //取消
            if (strpos($ruleid, "#")) {
                $ruleidArr = explode("#", $ruleid);
            } else {
                $ruleidArr[] = $ruleid;
            }
            $newSelectRulesArr = array();
            foreach ($selectRulesArr as $k => $value) {
                if (!in_array($value, $ruleidArr)) {
                    $newSelectRulesArr[] = $value;
                }
            }
            asort($newSelectRulesArr);
            $saveData = array();
            $saveData['id'] = $groupid;
            $saveData['rules'] = implode(",", $newSelectRulesArr);
            M('auth_group')->save($saveData);
            $this->success('取消授权成功');
        }
    }

    //成员授权
    public function userPermit() {
        $groupid = I('id');
        if (empty($groupid)) {
            $this->error("缺失主键");
        }
        $data = M('auth_group')->where("id={$groupid}")->find();
        if (empty($data)) {
            $this->error("用户组不存在");
        }
        $this->assign("groupid", $groupid);
        $this->assign("grouptitle", $data['title']);

        //所有有效的成员
        $users = M('auth_members')->field("id,username,nickname")->where("status=1")->select();
        $this->assign("users", json_encode($users));

        $selectUsers = M('auth_group_access')->where("group_id={$groupid}")->select();
        $str = "";
        if (!empty($selectUsers)) {
            foreach ($selectUsers as $user) {
                $str .= $user['uid'] . ",";
            }
            $str = substr($str, 0, -1);
        }
        $this->assign("selectUsers", $str);

        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '群组管理');
        $this->assign('actionName', '成员授权');
        $this->display('Auth:Group:userPermit');
    }

    //成员授权保存
    public function userPermitSave() {
        $groupid = I('groupid');
        $userid = I('userid');
        $status = I('status');

        $selectUsers = M('auth_group_access')->where("group_id={$groupid}")->select();
        $selectUsersArr = array();
        if (!empty($selectUsers)) {
            foreach ($selectUsers as $k => $value) {
                $selectUsersArr[] = $value['uid'];
            }
        }

        if ($status == 'true') {
            if (strpos($userid, "#")) {
                $useridArr = explode("#", $userid);
            } else {
                $useridArr[] = $userid;
            }
            foreach ($useridArr as $k => $uid) {
                if (!in_array($uid, $selectUsersArr)) {
                    $saveData = array();
                    $saveData['group_id'] = $groupid;
                    $saveData['uid'] = $uid;
                    M('auth_group_access')->add($saveData);
                }
            }
            $this->success('授权成功');
        } else {
            //取消
            if (strpos($userid, "#")) {
                $useridArr = explode("#", $userid);
            } else {
                $useridArr[] = $userid;
            }
            if (!empty($selectUsersArr)) {
                foreach ($selectUsersArr as $k => $uid) {
                    if (in_array($uid, $useridArr)) {
                        $map = array();
                        $map['group_id'] = $groupid;
                        $map['uid'] = $uid;
                        M('auth_group_access')->where($map)->delete();
                    }
                }
            }
            $this->success('取消授权成功');
        }
    }

}
