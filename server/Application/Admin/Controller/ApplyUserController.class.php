<?php

namespace Admin\Controller;

use Base\BackController;

class ApplyUserController extends BackController {

    //用户列表
    public function index(){

        $store_name=I('store_name');
        $realname=I('realname');
        $phone = I("phone");
        $where = array();
        if($store_name){
            $where['store_name'] = array('like', '%'.$store_name.'%');
        }
        if($realname){
            $where['realname'] = array('like', '%'.$realname.'%');
        }
        if($phone){
            $where['phone'] = array('like', '%'.$phone.'%');
        }

        $this->user_model = M('apply_user');
        //任务总数
        $total = $this->user_model->where($where)->count();
        //每页条数
        $listRows = C('LIST_ROWS') > 0 ? C('LIST_ROWS') : 10;
        //实例化分页类
        $page = new \Admin\ORG\PageNew($total, $listRows, '');
        if ($total > $listRows) {

            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
        }
        $p = $page->show();

        $this->assign('_page', $p ? $p : '');

        $dataList = $this->user_model->where($where)->order('id asc')->limit("$page->firstRow,$page->listRows")->select();

        foreach($dataList as $k=>$value){

           $value['create_time']=date('Y-m-d H:i:s', $value['create_time']);
            $dataList[$k] = $value;
        }
        $this->assign('store_name',$store_name);
        $this->assign('realname',$realname);
        $this->assign('phone',$phone);
        $this->assign('_list', $dataList);
        $this->assign('groupName', '权限管理 ');
        $this->assign('moduleName', '自测用户信息管理');
        $this->assign('actionName', '自测用户记录列表');
        $this->display('ApplyUser:User:index');
    }

    public function export_user(){

        $store_name=I('store_name');
        $realname=I('realname');
        $phone = I("phone");
        $where = array();
        if($store_name){
            $where['store_name'] = array('like', '%'.$store_name.'%');
        }
        if($realname){
            $where['realname'] = array('like', '%'.$realname.'%');
        } if($phone){
            $where['phone'] = array('like', '%'.$phone.'%');
        }

        $this->user_model = M('apply_user');

        $result = $this->user_model->where($where)->order('id asc')->select();

        // $data = array(array('ID', '微信id',  '昵称', '性别','省份','城市','创建时间','店名','姓名','手机','注册省份','注册城市','状态'));
        $data = array(array('ID', '创建时间','店名','姓名','手机','状态'));

        foreach ($result as $k => $val) {

            $val['id'] = $val['id'];

            // $val['openid'] = $val['openid'];

            // $val['nickname']=$val['nickname'];

            // if($val['sex']=='1'){
            //     $val['sex']='男';
            // }else{
            //     $val['sex']='女';
            // }

            // $val['province'] =$val['province'];

            // $val['city'] = $val['city'];

            $val['create_time'] = $val['create_time']?date('Y-m-d H:i:s' ,$val['create_time']):'';

            $val['store_name'] = $val['store_name'];

            $val['realname'] = $val['realname'];

            $val['phone']=$val['phone'];

            // $val['r_province'] = $val['r_province'];
            // $val['r_city'] = $val['r_city'];
            if($val['status']=='0'){
                $val['status']='禁用';
            }else{
                $val['status']='启用';
            }
            array_push($data, array($val['id'], $val['create_time'], $val['store_name'], $val['realname'],$val['phone'],$val['status']));
            // array_push($data, array($val['id'], $val['openid'], $val['nickname'],$val['sex'], $val['province'], $val['city'], $val['create_time'], $val['store_name'], $val['realname'],$val['phone'],$val['r_province'],$val['r_city'],$val['status']));
        }

        $exeleObject = new \Admin\ORG\Excel();

        $exeleObject->download($data, '自测用户信息记录表');
    }



}