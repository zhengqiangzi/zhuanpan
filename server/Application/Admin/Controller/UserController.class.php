<?php

namespace Admin\Controller;

use Base\BackController;

class UserController extends BackController {

    public $ba_time_arr; //疤痕时间

    public function _initialize() {
        $this->ba_time_arr = array(
            1 => "6个月内",
            2 => "6-12个月",
            3 => "1年-2年",
            4 => "2年以上"
        );
    }

    public function index() {
        $model = M('apply_user');
        $realnme = I('realname');
        $nickname = I('nickname');
        $phone = I('phone');
        $create_time = urldecode(I('create_time'));
        $order_type = I('order_type');
        $ba_time_str = I('ba_time_str');
        $map = array();
        if ($create_time) {
            list($time_start, $time_end) = explode('~', $create_time);
            $time_end = date('Y-m-d H:59:59', strtotime($time_end));
            $map['create_time'] = array('between', array(strtotime($time_start), strtotime($time_end)));
        }
        if ($realnme) {
            $map['realname'] = $realnme;
        }
        if ($nickname) {
            $map['nickname'] = $nickname;
        }
        if ($phone) {
            $map['phone'] = array("like", "%" . $phone . "%");
        }
        if ($order_type == 'user') {
            $order = "help_friend_count desc,id asc";
        } else {
            $order = "create_time desc";
        }
        if ($ba_time_str) {
            $map['ba_time'] = $ba_time_str;
        }
        
        $count = $model->where($map)->count(); // 查询满足要求的总记录数
        $Page = new \Admin\ORG\PageNew($count, 10);
        $show = $Page->show(); // 分页显示输出
        $result = $model->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->order($order)->select();

        $list_result = array();
        foreach ($result as $k => $val) {
            $val['ba_time_str'] = $this->ba_time_arr[$val['ba_time']];
//            $val['friend_count'] = $this->getFriendCount($val['id']);
            $val['cart_count'] = $this->getCartCount($val['id']);
            $res = M('apply_user_winner')->where(array('apply_user_id' => $val['id']))->find();
            if ($res) {
                $val['is_winner'] = 1;
                $val['batch']=ic_dateToStr($res['batch'],'Y-m-d');
            } else {
                $val['is_winner'] = 0;
                $val['batch']=0;
            }
            $list_result[$k] = $val;
        }
        // dump($list_result);

        $this->assign('nickname', $nickname);
        $this->assign('realname', $realnme);
        $this->assign('create_time', $create_time);
        $this->assign('ba_time_str', $ba_time_str);
        $this->assign('phone', $phone);
        $this->assign('user', $list_result);
        $this->assign('order', $order_type);
        $this->assign('page', $show);
        $this->display();
    }

    #设置中奖

    public function setWinner() {
        $id = I('id');
        $riqi=I('riqi');
        $is_winner = I('is_winner');
        $model = M('apply_user_winner');
        if ($is_winner) {
            $result = $model->where(array('apply_user_id' => $id))->delete();
        } else {
            $res = M('apply_user_winner')->where(array('apply_user_id' => $id))->find();
            if ($res) {
                $msg = '该用户已中过奖，不能再中了。';
                $this->ajaxReturn($msg, 'json');
            } else {
                $data = array();
                $data['apply_user_id'] = $id;
                // $data['batch'] = strtotime(date('Y-m-d', time()));
                $data['batch'] = ic_strToTimeStamp($riqi);
                $data['create_time'] = time();
                $result = $model->add($data);
            }
        }
        if ($result !== false) {
            $msg = '设置成功!';
            $this->ajaxReturn($msg, 'json');
        } else {
            $msg = '设置失败';
            $this->ajaxReturn($msg, 'json');
        }
    }

    #根据用户ID，查找助力该用户的好友数

    public function getFriendCount($apply_user_id) {
        $apply_friend_model = M('apply_user_friend');
        $map = array();
        $map['apply_user_id'] = $apply_user_id;
        return $apply_friend_model->where($map)->count();
    }

    #根据用户ID，查找该用户已领取的优惠券数目，最大为2

    public function getCartCount($apply_user_id) {
        return 0;
        // $apply_user_cart = M('apply_user_cart');
        // $map = array();
        // $map['apply_user_id'] = $apply_user_id;
        // return $apply_user_cart->where($map)->count();
    }

    #根据用户ID，查找该用户已领取的优惠券数目，最大为2

    public function checkUserIsWinner($apply_user_id) {
        $apply_user_winner = M('apply_user_winner');
        $map = array();
        $map['apply_user_id'] = $apply_user_id;
        return $apply_user_winner->where($map)->getField("batch");
    }

    /**
     * 导出excle
     */
    public function export_user() {
        $model = M('apply_user');
        $realnme = I('realname');
        $nickname = I('nickname');
        $phone = I('phone');
        $create_time = urldecode(I('create_time'));
        $order_type = I('order_type');
        $ba_time_str = I('ba_time_str');
        $map = array();
        if ($create_time) {
            list($time_start, $time_end) = explode('~', $create_time);
            $time_end = date('Y-m-d H:59:59', strtotime($time_end));
            $map['create_time'] = array('between', array(strtotime($time_start), strtotime($time_end)));
        }
        if ($realnme) {
            $map['realname'] = $realnme;
        }
        if ($nickname) {
            $map['nickname'] = $nickname;
        }
        if ($phone) {
            $map['phone'] = array("like", "%" . $phone . "%");
        }
        if ($order_type == 'user') {
            $order = "help_friend_count desc";
        } else {
            $order = "create_time desc";
        }
        if ($ba_time_str) {
            $map['ba_time'] = $ba_time_str;
        }
        //$result=$model->alias('a')->join('eosi_weixin_user b ON b.id=a.user_id','left')->where($map)->field('b.id,b.realname,b.phone,a.test_result,a.create_time,a.award')->order('a.id desc')->select();
        $result = $model->where($map)->order($order)->select();
        $data = array(array('ID', '昵称', '姓名', '性别', '联系电话', '疤痕时间', '创建时间','助力好友数','是否中奖','领取劵数','地址'));

        foreach ($result as $k => $val) {
            $val['ba_time_str'] = $this->ba_time_arr[$val['ba_time']];
//            $val['friend_count'] = $this->getFriendCount($val['id']);
            $val['cart_count'] = $this->getCartCount($val['id']);
            $res = M('apply_user_winner')->where(array('apply_user_id' => $val['id']))->find();
            $val['create_time_str'] = $val['create_time']?date('Y-m-d H:i:s' ,$val['create_time']):'';
            if ($res) {
                $val['is_winner'] = '是';
            } else {
                $val['is_winner'] = '否';
            }
            if($val['sex'] == '1'){
                $val['sex_str'] = '男';
            }else{
                $val['sex_str'] = '女';
            }
            array_push($data, array($val['id'], $val['nickname'], $val['realname'], $val['sex_str'], $val['phone'], $val['ba_time_str'], $val['create_time_str'], $val['help_friend_count'], $val['is_winner'], $val['cart_count'], $val['address']));
        }
        $exeleObject = new \Admin\ORG\Excel();
        $exeleObject->download($data, '用户列表');
    }

}
