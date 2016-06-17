<?php

/**
 * 接口模型
 * @author perry
 */

namespace Home\Model;

use Think\Model;

class ApiModel extends Model {
    protected $tableName = 'test_history';
    function _initialize() {
        $this->test_history = M("test_history");
    }
    public function ranking_points($user_id){
        $time1= date("Y-m-d 00:00:00",time());   //  这里输出 xxxx-xx-xx 00:00:00
        $time2= date("Y-m-d 23:59:59",time());  //  这里输出 xxxx-xx-xx 23:59:59
        $times[0] = date('Y-m-d H:00:00', strtotime($time1));
        $times[1] = date('Y-m-d H:59:59', strtotime($time2));
        $maa['user_id']=$user_id;
        $maa['created_at'] = array(array('egt', strtotime($times[0])), array('elt', strtotime($times[1])));
        // $chi_shu=$this->test_history->where($maa)->field('id')->group("test_id")->select();//查询统计用户答题次数
        // $yong_hu_ci_shu=count($chi_shu);
        $chi_shu=$this->test_history->where($maa)->count();//查询统计用户答题次数
        //dump($this->test_history->getLastSql());
        //carly 要求每次测试都是20道题,从题库中随机取20道题返回
        $count_per_test=C('timu_count_max');
        $yong_hu_ci_shu=$chi_shu/$count_per_test;
        $dati_cishu=C('dati_cishu');//配置文件用户答题权限次数
        if($yong_hu_ci_shu>=$dati_cishu){
           $jin_r_dati_shu="今日答题次数已累积".$dati_cishu."次!";
           return  $jin_r_dati_shu;
        }
        return 0;
    }
}
