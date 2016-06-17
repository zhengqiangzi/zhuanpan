<?php

namespace Admin\Controller;

use Base\BackController;

class TestHistoryController extends BackController
{
    public function index()
    {
        $tikuid = I('tiku');

        if (ic_isPosInt($tikuid)) {
            $ml['parent_id'] = $tikuid;
            $ml['type'] = 2;
        }

        $timu = M('test')->where($ml)->field('id,name')->select();

        $this->assign('ti_mu', $timu);//传递前台题目id

        $timuid = I('timu');

        $is_right = I('is_right');

        $time = I('time');

        if ($time) {
            $times = explode('~', $time);
            $times[0] = date('Y-m-d H:00:00', strtotime($times[0]));
            $times[1] = date('Y-m-d H:59:59', strtotime($times[1]));
            $map['created_at'] = array(array('egt', strtotime($times[0])), array('elt', strtotime($times[1])));
        }

        if (ic_isPosInt($tikuid)) {
            $map['test_id'] = $tikuid;
        }

        if (ic_isPosInt($timuid)) {
            $map['q_id'] = $timuid;
        }
        if ($is_right) {
            $map['is_right'] = $is_right;
        }
        $type['type'] = 1;
        $name = M('test')->where($type)->field('id,name')->select();
        $this->assign('name', $name);//传递前台题库id和题库

        $this->user_model = M('test_history');

        $join = 'left join eosi_test eg1 on ejh.test_id = eg1.id and eg1.type=1 left join eosi_test eg2 on ejh.q_id = eg2.id and eg2.type=2';

        $total = $this->user_model->alias('ejh')->join($join)->where($map)->count();

        //dump($this->user_model->getLastSql());exit;

        //每页条数
        $listRows = C('LIST_ROWS') > 0 ? C('LIST_ROWS') : 10;
        //实例化分页类
        $page = new \Admin\ORG\PageNew($total, $listRows, '');
        if ($total > $listRows) {
            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
        }
        $p = $page->show();

        $this->assign('_page', $p ? $p : '');

        $dataList = $this->user_model->alias('ejh')->join($join)->field('ejh.*,eg1.name n1,eg2.name n2')->where($map)->order('created_at desc')->limit("$page->firstRow,$page->listRows")->select();

        foreach ($dataList as $k => $value) {

            $value['created_at'] = date('Y-m-d H:i:s', $value['created_at']);

            $dataList[$k] = $value;
        }
        $this->assign('time', $time);
        $this->assign('tiku', $tikuid);
        $this->assign('timu', $timuid);
        $this->assign('is_right', $is_right);
        $this->assign('_list', $dataList);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '用户管理');
        $this->assign('actionName', '用户答题历史表');
        $this->display('TestHistory:index');

    }

    public function tim_ming()
    {

        $id = I('id');
        if ($id) {
            $type['type'] = 2;
            $type['parent_id'] = $id;
        }
        $name = M('test')->where($type)->field('id,name')->select();

        $this->ajaxReturn($name);
    }

    public function export_user()
    {

        $tikuid = I('tiku');

        if (ic_isPosInt($tikuid)) {
            $ml['parent_id'] = $tikuid;
            $ml['type'] = 2;
        }

        $timu = M('test')->where($ml)->field('id,name')->select();

        $this->assign('ti_mu', $timu);//传递前台题目id

        $timuid = I('timu');

        $is_right = I('is_right');

        $time = I('time');

        $map = array();
        if (ic_isPosInt($tikuid)) {
            $map['test_id'] = $tikuid;
        }

        if (ic_isPosInt($timuid)) {
            $map['q_id'] = $timuid;
        }
        if ($is_right) {
            $map['is_right'] = $is_right;
        }
        if ($time) {
            $times = explode('~', $time);
            $times[0] = date('Y-m-d H:00:00', strtotime($times[0]));
            $times[1] = date('Y-m-d H:59:59', strtotime($times[1]));
            $map['created_at'] = array(array('egt', strtotime($times[0])), array('elt', strtotime($times[1])));
        }
        $type['type'] = 1;

        $name = M('test')->where($type)->field('id,name')->select();

        $this->assign('name', $name);//传递前台题库id和题库

        $this->user_model = M('test_history');

        $join = 'left join eosi_test eg1 on ejh.test_id = eg1.id and eg1.type=1 left join eosi_test eg2 on ejh.q_id = eg2.id and eg2.type=2';
//        $total = $this->user_model->alias('ejh')->join($join)->where($map)->count();

        //dump($this->user_model->getLastSql());exit;

        $dataList = $this->user_model->alias('ejh')->join($join)->field('ejh.*,eg1.name n1,eg2.name n2')->where($map)->order('created_at desc')->select();

//        dump($dataList);exit;

        $data = array(array('ID', '题库名', '题目名', '用户提交的答案顺序号', '本题是否答对', '本题得分', '创建时间'));

        foreach ($dataList as $k => $val) {


            $val['id'] = $val['id'];

            $val['n1'] = $val['n1'];

            $val['n2'] = $val['n2'];

            $val['answers'] = $val['answers'];

            if ($val['is_right'] == '0') {
                $val['is_right'] = '未知';
            } elseif ($val['is_right'] == '1') {
                $val['is_right'] = '答对';
            } elseif ($val['is_right'] == '2') {
                $val['is_right'] = '部分答对';
            } else {
                $val['is_right'] = '答错';
            }

            $val['score'] = $val['score'];

            $val['created_at'] = $val['created_at'] ? date('Y-m-d H:i:s', $val['created_at']) : '';

            array_push($data, array($val['id'], $val['n1'], $val['n2'], $val['answers'], $val['is_right'], $val['score'], $val['created_at']));
        }


        $exeleObject = new \Admin\ORG\Excel();

        $exeleObject->download($data, '用户答题历史表');
    }
}