<?php

namespace Admin\Controller;

use Base\BackController;

class TestController extends BackController
{

    public function index()
    {
        $name = I('name');
        $map = array();
        if ($name) {
            $map['name'] = array('like', '%' . $name . '%');
        }
        $map['type'] = 1;
        $this->user_model = M('test');

        $total = $this->user_model->where($map)->count();
        //每页条数
        $listRows = C('LIST_ROWS') > 0 ? C('LIST_ROWS') : 10;
        //实例化分页类
        $page = new \Admin\ORG\PageNew($total, $listRows, '');
        if ($total > $listRows) {
            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
        }
        $p = $page->show();

        $this->assign('_page', $p ? $p : '');

        $dataList = $this->user_model->where($map)->order('id desc')->limit("$page->firstRow,$page->listRows")->select();


        $this->assign('name', $name);
        $this->assign('_list', $dataList);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '题库管理');
        $this->assign('actionName', '题库列表');
        $this->display('Test:index');

    }

    public function View_title()
    {

        $parent_id = I('id');

        //dump($parent_id);

        $this->assign('parent_id', $parent_id);//传值题库id也就是parent_id

        $name = I('name');

        $map = array();

        if ($parent_id) {

            $map['parent_id'] = $parent_id;
        }

        if ($name) {

            $map['name'] = array('exp',"like '%".$name."%'");
        }

        $this->user_model = M('test');

        $total = $this->user_model->where($map)->count();
        //每页条数
        $listRows = C('LIST_ROWS') > 0 ? C('LIST_ROWS') : 10;
        //实例化分页类
        $page = new \Admin\ORG\PageNew($total, $listRows, '');
        if ($total > $listRows) {
            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
        }
        $p = $page->show();
        $this->assign('_page', $p ? $p : '');
        $dataList = $this->user_model->where($map)->order('sub_order asc')->limit("$page->firstRow,$page->listRows")->select();
        $this->assign('name', $name);
        $this->assign('_list', $dataList);
        $this->assign('id', $parent_id);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '题目管理');
        $this->assign('actionName', '题目列表');
        $this->display('Test:View_title');
    }

    public function  View_options()
    {

        $timuid = I('id');

        //dump($timuid);

        if (empty($timuid)) {

            $this->error('缺失主键');
        }

        $data = M('test')->where("id={$timuid}")->order('sub_order asc')->field('id,name,is_duoxuan,right_answer,parent_id')->find();

        // dump($data);

        $data2 = M('test')->where("parent_id={$timuid}")->order('sub_order asc')->field('id,name,sub_order')->select();


        $cc = count($data2);
        if ($cc < 10) {
            for (; $cc < 10; $cc++) {
                array_push($data2, array('sub_order' => $cc + 1, 'name' => '', 'id' => 0));
            }
        }

        $this->assign("data", $data);
        $this->assign("data2", $data2);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '题目管理');
        $this->assign('actionName', '编辑题目');
        $this->display('Test:View_options');
    }

    public function update()
    {
        $idd = I('id');//当前题目id
        $root_id = I('parent_id');
        $xuanxiang1id = I('xuanxiangid1');//选项id
        $xuanxiang2id = I('xuanxiangid2');//选项id
        $xuanxiang3id = I('xuanxiangid3');//选项id
        $xuanxiang4id = I('xuanxiangid4');//选项id
        $xuanxiang5id = I('xuanxiangid5');//选项id
        $xuanxiang6id = I('xuanxiangid6');//选项id
        $xuanxiang7id = I('xuanxiangid7');//选项id
        $xuanxiang8id = I('xuanxiangid8');//选项id
        $xuanxiang9id = I('xuanxiangid9');//选项id
        $xuanxiang10id = I('xuanxiangid10');//选项id
        $sub_order1 = I('sub_order1');
        $sub_order2 = I('sub_order2');
        $sub_order3 = I('sub_order3');
        $sub_order4 = I('sub_order4');
        $sub_order5 = I('sub_order5');
        $sub_order6 = I('sub_order6');
        $sub_order7 = I('sub_order7');
        $sub_order8 = I('sub_order8');
        $sub_order9 = I('sub_order9');
        $sub_order10 = I('sub_order10');
        $name1 = I('name1');//选项1
        $name2 = I('name2');//选项2
        $name3 = I('name3');//选项3
        $name4 = I('name4');//选项4
        $name5 = I('name5');//选项5
        $name6 = I('name6');//选项6
        $name7 = I('name7');//选项7
        $name8 = I('name8');//选项8
        $name9 = I('name9');//选项9
        $name10= I('name10');//选项10
        $name = I('name');//当前id内容

        $right_answer = I('right_answer');//当前id正确答案

        $map = array();

        if ($name) {

            $map['name'] = $name;

        }

        $is_duoxuan = I('is_duoxuan');//当前id是否选择

        if ($is_duoxuan) {

            $map['is_duoxuan'] = $is_duoxuan;

        } else {

            $map['is_duoxuan'] = 0;
        }

        if ($right_answer) {

            $map['right_answer'] = $right_answer;
        }

        M('test')->where("id={$idd}")->save($map);

        $ma = array();

        $ma['type'] = 3;

        for ($id = 1; $id <= 10; $id++) {

            $nameid = 'xuanxiang' . $id . 'id';

            $name = 'name' . $id;

            $sub_order = 'sub_order' . $id;

            if (ic_isPosInt($$nameid)) {
                if ($$name == '') {
                    M('test')->where(array('id' => $$nameid))->delete();
                }
                $ma['name'] = $$name;
                $ma['parent_id'] = $idd;
                $ma['root_id'] = $root_id;

                M('test')->where(array('id' => $$nameid))->save($ma);

            } else {
                if (ic_checkUnEmpty($$name)) {
                    $ma['name'] = $$name;
                    $ma['parent_id'] = $idd;
                    $ma['root_id'] = $root_id;
                    $ma['sub_order'] = $$sub_order;
                    M('test')->add($ma);
                }
            }
        }

        $this->success("题目编辑成功", __CONTROLLER__ . "/View_options/id/$idd");
    }

    public function add()
    {

        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '题库管理');
        $this->assign('actionName', '添加题库');
        $this->display('Test:add');
    }

    public function ad()
    {
        $saveData['name'] = I('name');

        $saveData['type'] = 1;

        $flag = M('test')->add($saveData);

        if ($flag) {
            $this->success('题库添加成功', __CONTROLLER__ . '/index');
        } else {
            $this->error('题库添加失败');
        }
    }

    public function View_title_add()
    {
        $timuid = I('id');
        $this->assign('timuid', $timuid);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '题目管理');
        $this->assign('actionName', '添加题目');
        $this->display('Test:View_title_add');
    }

    public function View_title_ad()
    {
        $parent_id = I('timuid');

        $name = I('name');//当前id内容

        $right_answer = I('right_answer');//当前id正确答案

        $map = array();

        $map['type'] = 2;

        if ($name) {

            $map['name'] = $name;

        }

        $is_duoxuan = I('is_duoxuan');//当前id是否选择

        if ($is_duoxuan) {

            $map['is_duoxuan'] = $is_duoxuan;

        } else {

            $map['is_duoxuan'] = 0;
        }

        if ($right_answer) {

            $map['right_answer'] = $right_answer;
        }
        if ($parent_id) {

            $map['parent_id'] = $parent_id;
            $map['root_id'] = $parent_id;
        }

        $sub_order = M('test')->where(array('parent_id' => $parent_id))->order('sub_order desc')->find();

        if ($sub_order == '') {

            $map['sub_order'] = 1;
        } else {
            $map['sub_order'] = $sub_order['sub_order'] + 1;
        }

        M('test')->add($map);

        $xuangxiangid = M('test')->where(array('parent_id' => $parent_id))->order('id desc')->field('id')->find();

        $parentid = implode('', $xuangxiangid);//选项id转化parentid
        $sub_order1 = I('sub_order1');
        $sub_order2 = I('sub_order2');
        $sub_order3 = I('sub_order3');
        $sub_order4 = I('sub_order4');
        $sub_order5 = I('sub_order5');
        $sub_order6 = I('sub_order6');
        $sub_order7 = I('sub_order7');
        $sub_order8 = I('sub_order8');
        $sub_order9 = I('sub_order9');
        $sub_order10 = I('sub_order10');
        $name1 = I('name1');//选项1
        $name2 = I('name2');//选项2
        $name3 = I('name3');//选项3
        $name4 = I('name4');//选项4
        $name5 = I('name5');//选项5
        $name6 = I('name6');//选项6
        $name7 = I('name7');//选项7
        $name8 = I('name8');//选项8
        $name9 = I('name9');//选项9
        $name10= I('name10');//选项10
        for ($id = 1; $id <= 10; $id++) {

            $xuangxiangname = 'name' . $id;

            $sub_order = 'sub_order' . $id;

            if (ic_checkUnEmpty($$xuangxiangname)) {

                $ma['name'] = $$xuangxiangname;

                $ma['parent_id'] = $parentid;

                $ma['type'] = 3;

                $ma['root_id'] = $parent_id;

                $ma['sub_order'] = $$sub_order;


                M('test')->add($ma);

            }
        }

        $this->success("题目添加成功", __CONTROLLER__ . "/index");
    }
}