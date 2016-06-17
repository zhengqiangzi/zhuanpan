<?php

namespace Admin\Controller;

use Base\BackController;

class AuthRuleController extends BackController {

    //规则列表
    public function rule() {
        $this->rule_model = M('auth_rule');
        $this->status_arr = array(
            '0' => '无效',
            '1' => '有效'
        );
        //任务总数
        $total = $this->rule_model->count();
        //每页条数
        $listRows = C('LIST_ROWS') > 0 ? C('LIST_ROWS') : 10;
        //实例化分页类
        $page = new \Admin\ORG\PageNew($total, $listRows, '');
        if ($total > $listRows) {
            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
        }
        $p = $page->show();
        $this->assign('_page', $p ? $p : '');

        $dataList = $this->rule_model->order('id desc')->limit("$page->firstRow,$page->listRows")->select();

        //数据处理
        foreach ($dataList as $k => $value) {
            //状态
            if ($value['status'] == 1) {
                $value['status_str'] = "<span class=\"label label-sm label-success arrowed-in\"> " . $this->status_arr[$value['status']] . " </span>&nbsp;|&nbsp;&nbsp;&nbsp;<span class=\"hand icon-lock red bigger-125\" title=\"关闭规则\" onclick=\"setStatus('close','{$value['id']}');\"></span>";
            } else {
                $value['status_str'] = "<span class=\"label label-sm label-info arrowed-in\"> " . $this->status_arr[$value['status']] . " </span>&nbsp;|&nbsp;&nbsp;&nbsp;<span class=\"hand icon-unlock green bigger-125\" title=\"开启规则\" onclick=\"setStatus('open','{$value['id']}');\"></span>";
            }
            $dataList[$k] = $value;
        }
        $this->assign('_list', $dataList);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '规则管理');
        $this->assign('actionName', '规则列表');
        $this->display('Auth:Rule:rule');
    }

    //添加规则
    public function addRule() {
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '规则管理');
        $this->assign('actionName', '添加规则');
        $this->display('Auth:Rule:addRule');
    }

    //保存规则
    public function insertRule() {
        $name = I('name');
        $title = I('title');
        $condition = I('condition');
        $map = array();
        $map['name'] = $name;
        $data = M('auth_rule')->where($map)->find();
        if (!empty($data)) {
            $this->error("规则\"{$name}\"已存在");
        }
        $saveData = array();
        $saveData['name'] = $name;
        $saveData['title'] = $title;
        $saveData['condition'] = $condition;
        $flag = M('auth_rule')->add($saveData);
        if ($flag) {
            $this->success('规则添加成功', __CONTROLLER__ . '/rule');
        } else {
            $this->error('规则添加失败');
        }
    }

    //开启规则|关闭规则
    public function setRuleStatus() {
        $type = I('type');
        $ruleid = I('id');
        if (empty($type) || empty($ruleid)) {
            $this->error('丢失参数');
        }
        if ($type == 'open')
            $str = '开启规则';
        if ($type == 'close')
            $str = '关闭规则';

        $data = array();
        $data['id'] = $ruleid;
        if ($type == 'open') {
            $data['status'] = 1;
        }
        if ($type == 'close') {
            $data['status'] = 0;
        }
        $flag = M('auth_rule')->save($data);
        if ($flag) {
            $this->success("{$str}成功", U('rule'));
        } else {
            $this->error("{$str}失败");
        }
    }

    //编辑规则
    public function editRule() {
        $ruleid = I('id');
        if (empty($ruleid)) {
            $this->error('缺失主键');
        }
        $data = M('auth_rule')->where("id={$ruleid}")->find();
        if (empty($data)) {
            $this->error('数据不存在');
        }
        $this->assign('data', $data);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '规则管理');
        $this->assign('actionName', '编辑规则');
        $this->display('Auth:Rule:editRule');
    }

    //更新规则
    public function updateRule() {
        $ruleid = I('id');
        if (empty($ruleid)) {
            $this->error('缺失主键');
        }
        $name = I('name');
        $title = I('title');
        $condition = I('condition');

        $map = array();
        $map['name'] = $name;
        $map['id'] = array('neq', $ruleid);
        $data = M('auth_rule')->where($map)->find();
        if (!empty($data)) {
            $this->error("规则\"{$name}\"已存在");
        }
        $saveData = array();
        $saveData['id'] = $ruleid;
        $saveData['name'] = $name;
        $saveData['title'] = $title;
        $saveData['condition'] = $condition;
        $flag = M('auth_rule')->save($saveData);
        if ($flag) {
            $this->success('规则编辑成功', __CONTROLLER__ . '/rule');
        } else {
            $this->error('规则编辑失败，可能未做修改');
        }
    }

    //删除规则
    public function deleteRule() {
        $ruleid = I('id');
        if (empty($ruleid)) {
            $this->error('缺失主键');
        }
        //删除规则表
        $flag = M('auth_rule')->where("id={$ruleid}")->delete();
        if ($flag) {
            $this->success('删除成功', __CONTROLLER__ . '/rule');
        } else {
            $this->error('删除规则失败');
        }
    }

}
