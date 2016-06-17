<?php

namespace Admin\Controller;

use Base\BackController;

class QuarterPointsController extends BackController
{

    public function index()
    {

        $realname = I('realname');

        $quarter = I('quarter');

        $points = I("points");

        if ($points) {

            $name_points = $points;
        }
        $name = I('name');

        $map = array();

        if ($realname) {
            $map['realname'] = array('like', '%' . $realname . '%');
        }
        if ($quarter) {

            $map['quarter'] = $quarter;
        }
        if ($name == '1') {
            $map['points'] = array('GT', $name_points);

        } elseif ($name == '2') {

            $map['points'] = array('LT', $name_points);

        } elseif ($name == '3') {

            $map['points'] = array('EQ', $name_points);
        }

        $this->user_model = M('apply_user_quarter_points');

        $join = 'left join eosi_apply_user eg on ejh.user_id = eg.id';

        $total = $this->user_model->alias('ejh')->join($join)->where($map)->count();
        //每页条数
        $listRows = C('LIST_ROWS') > 0 ? C('LIST_ROWS') : 10;
        //实例化分页类
        $page = new \Admin\ORG\PageNew($total, $listRows, '');
        if ($total > $listRows) {
            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
        }
        $p = $page->show();
        $this->assign('_page', $p ? $p : '');

        $dataList = $this->user_model->alias('ejh')->join($join)->field('ejh.*,eg.realname')->where($map)->order('points desc')->limit("$page->firstRow,$page->listRows")->select();
        //dump($dataList);
        //数据处理
        foreach ($dataList as $k => $value) {
            // $value['month']= date('Y-m',$value['month'] );
            $value['updated_at'] = date('Y-m-d H:i:s',$value['updated_at']);

            $dataList[$k] = $value;
        }
        $this->assign('_list', $dataList);
        $this->assign('realname', $realname);
        $this->assign('quarter', $quarter);
        $this->assign('points', $points);
        $this->assign('name', $name);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '用户季度积分管理');
        $this->assign('actionName', '用户季度积分累计表');
        $this->display('QuarterPoints:Points:index');
    }

    public function export_user()
    {

        $realname = I('realname');
        $quarter = I('quarter');
        $points = I("points");
        if ($points) {
            $name_points = $points;
        }
        $name = I('name');

        $map = array();

        if ($realname) {
            $map['realname'] = array('like', '%' . $realname . '%');
        }
        if ($quarter) {
            //$map['month']= strtotime($month);;
            $map['quarter'] = $quarter;
        }
        if ($name == '1') {
            $map['points'] = array('GT', $name_points);

        } elseif ($name == '2') {

            $map['points'] = array('LT', $name_points);

        } elseif ($name == '3') {

            $map['points'] = array('EQ', $name_points);
        }

        $this->user_model = M('apply_user_quarter_points');

        //任务总数
        $join = 'left join eosi_apply_user eg on ejh.user_id = eg.id';

//        //任务总数
//        $total = $this->user_model->alias('ejh')->join($join)->where($map)->count();

        $result = $this->user_model->alias('ejh')->join($join)->field('ejh.*,eg.realname')->where($map)->order('points asc')->select();

        $data = array(array('ID', '姓名', '积分积累季度', '该月累计积分', '最后答题时间'));

        foreach ($result as $k => $val) {

            $val['id'] = $val['id'];

            $val['realname'] = $val['realname'];

            $val['quarter'] = $val['quarter'];

            $val['points'] = $val['points'];

            $val['updated_at'] = $val['updated_at'] ? date('Y-m-d H:i:s', $val['updated_at']) : '';

            array_push($data, array($val['id'], $val['realname'], $val['quarter'], $val['points'], $val['updated_at']));
        }

        $exeleObject = new \Admin\ORG\Excel();

        $exeleObject->download($data, '用户季度积分累计表');
    }
}