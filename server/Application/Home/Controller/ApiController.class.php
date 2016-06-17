<?php
namespace Home\Controller;

use Think\Controller;

//use Base\FrontController;

class ApiController extends Controller
{

    public function _initialize() {
        // $this->cur_url=$_SERVER["HTTP_HOST"].__ACTION__;
        // if(!in_array(ACTION_NAME, array('index_user','zi_ce_ren_yuan'))){
        //     $this->weixin_user = $_SESSION[C('weixin_session_key')];
        //     $this->checkWxLogin();
        //     $this->usre_id=$this->weixin_user['id'];
        // }
    }
    publicl function ccss(){
        // echo $exc;
        $this->display($exc);
        exit;
    }





    //判断用户是否登陆
    protected function checkWxLogin() {
      if(!$this->weixin_user){
        $redirect_url = C('login_url')."?ret_url=".urlencode($this->cur_url);
        if(IS_AJAX){
          $this->customReturn(0,array('errmsg'=>"您还未登录或登录已失效,请重新登录或注册.",'redirect_url'=>$redirect_url));
        }
        else {
          header('location:' . $redirect_url);
        }
        exit;
      }
    }

    function index(){
        echo "sdsadada";
    }  

    /**
     * 转换session
     * @param 名称 $key
     * @param 值 $value
     */
    private function changeSession($key, $value)
    {
        $_SESSION[$key] = $value;
        session($key, $value);
    }

    public function customReturn($status, $content)
    {
        $data['succ'] = $status;
        if (!$content) {
            $content = array();
        }
        $data['data'] = $content;
        //$this->ajaxReturn($data);
        // echo (json_encode($data,JSON_UNESCAPED_SLASHES));
        echo str_replace("\\/", "/", json_encode($data));
        exit;
    }

    /**自测人员注册接口
     *地址 Home/Api/index_user
     * 传入参数:姓名：realname(格式纯文本)  手机：phone(手机格式11位)  店名：store_name(格式为纯文本)
     * 返回值格式：array('succ'=>a1,'data'=>a2)
     * 如果a1==1时，表示接口成功调用，a2里data包含正确的返回值，
     * 返回值如下：
     * {"succ": 1,"data": {"id": "用户id","store_name": "店名","realname": "姓名"}}
     * a1如果不等于1则表示出错了，返回data值都是错误代码，
     * 返回data值结果如下：array('errcode'=>101, 'errmsg'=>’ Phone格式不对’ 或者未填写)
     * array('errcode'=>102, 'errmsg'=>’未提供realname参数’)
     * array('errcode'=>103, 'errmsg'=>'store_name参数未填写)
     * array('errcode'=>104, 'errmsg'=>’ 手机号已存在’)
     * array('errcode'=>105, 'errmsg'=>’网络原因保存您的注册信息未成功,请稍候再试’)
     */
    public function index_user()
    {
        try {
            $phone = I('phone');
            $realname = I('realname');
            $store_name = I('store_name');
            if (ic_isCellPhone($phone) == ture) {
                $map['phone'] = $phone;
            } else {
                throw new \Exception("手机号码格式有误,请填写正确的号码", 101);
            }
            $phone_wei_yi = M('apply_user')->where($map)->find();//手机号唯一
            if ($phone == $phone_wei_yi['phone']) {
                throw new \Exception("您输入的手机号已被注册,请修改或直接登录哦", 104);
            }
            if (ic_checkUnEmpty($realname)) {

                $map['realname'] = $realname;

            } else {
                throw new \Exception("请输入您的姓名哦", 102);
            }

            if (ic_checkUnEmpty($store_name)) {
                $map['store_name'] = $store_name;
            } else {

                throw new \Exception("请输入店名", 103);
            }
            //添加用户信息
            $map['create_time']=time();
            $map['status']=1;
            $addRe = M('apply_user')->add($map);
            if (!$addRe) {
                throw new \Exception("网络原因保存您的注册信息未成功,请稍候再试", 1999);
            }
            $yong_hu = M('apply_user')->where(array('id' => $addRe))->field('id,realname,store_name')->find();
            $succ = 1;
            $data = array();
            $data['id'] = $yong_hu['id'];
            $data['store_name'] = $yong_hu['store_name'];
            $data['realname'] = $yong_hu['realname'];
            $data['phone'] = $yong_hu['phone'];
            $this->changeSession(C('weixin_session_key'), $data);
            $this->customReturn($succ, $data);
        } catch (\Exception $exc) {
            //返回失败信息
            $succ = $exc->getCode() == 1 ? -1 : $exc->getCode();
            $datas = array('errcode' => $succ, 'errmsg' => $exc->getMessage());
            $this->customReturn($succ, $datas);
        }

    }

    /*自测人员登录接口
      接口地址:Home/Api/zi_ce_ren_yuan
      访问方式:GET,POST
      传入参数:手机：phone(11位手机格式)
      返回值: array('succ'=>a1,'data'=>a2)
      如果a1==1时，表示接口成功调用，a2里data包含正确的返回值，
      {
    "succ": 1,
    "data": {
        "id": "1",
        "store_name": "曹阳店",
        "realname": "杰杰"
    }
}
      a1如果不等于1则表示出错了，返回data值都是错误代码，
      返回data值结果如下：array('errcode'=>106, 'errmsg'=>’ Phone格式不对’ 或者未填写)
      rray('errcode'=>107, 'errmsg'=>’ 您输入的手机号不存在,请检查或重新注册’)
     */

    public function zi_ce_ren_yuan()
    {
        try {
            $phone = I('phone');
            if (ic_isCellPhone($phone) == ture) {
                $map['phone'] = $phone;
            } else {
                throw new \Exception("手机号码格式不对,请填写正确的号码", 106);
            }
            $phone_wei_yi = M('apply_user')->where($map)->find();

            if ($phone_wei_yi) {
                $succ = 1;
                //$ajaxdata['data'] = "登陆成功";
                $data = array();
                $data['id'] = $phone_wei_yi['id'];
                $data['store_name'] = $phone_wei_yi['store_name'];
                $data['realname'] = $phone_wei_yi['realname'];
                $data['phone'] = $phone_wei_yi['phone'];
                $this->changeSession(C('weixin_session_key'), $data);
                $this->customReturn($succ, $data);
            } else {
                throw new \Exception("您输入的手机号不存在,请检查或重新注册", 107);
            }

        } catch (\Exception $exc) {
            //返回失败信息
            $succ = $exc->getCode() == 1 ? -1 : $exc->getCode();
            $datas = array('errcode' => $succ, 'errmsg' => $exc->getMessage());
            $this->customReturn($succ, $datas);
        }
    }

    /*题库获取接口
        接口地址:Home/Api/tiku
        访问方式:GET,  POST
        传入参数:无
        返回值：array('succ'=>a1,'data'=>a2)
        如果a1==1时，表示接口成功调用，a2里data包含正确的返回值，
        {id：xxx，name：xxx}
        Key：id=题库id， name=题库名，
        a1如果不等于1则表示出错了，返回data值都是错误代码，
        返回data值结果如下：array('errcode'=>108, 'errmsg'=>’ 题库获取失败)
        操控表test  select id,name where type=1
      */

    public function tiku()
    {
        try {
            $tiku = M('test')->where('type=1')->field('id,name')->select();
            if ($tiku) {
                $succ = 1;
                $this->customReturn($succ, $tiku);
            } else {
                throw new \Exception("题库获取失败", 108);

            }
        } catch (\Exception $exc) {
            //返回失败信息
            $succ = $exc->getCode() == 1 ? -1 : $exc->getCode();
            $datas = array('errcode' => $succ, 'errmsg' => $exc->getMessage());
            $this->customReturn($succ, $datas);
        }
    }

    /*
        题目获取接口(设计稿6-1.jpg)
        接口地址:Home/Api/timu
        访问方式:GET,  POST
        传入参数:
        题库：tikuid(数字大于0)
        返回值：array('succ'=>a1,'data'=>a2)
        如果a1==1时，表示接口成功调用，a2里data包含正确的返回值，
        {"succ": 1,"data": [{
                "id": "175",
                "name": "题库1_题目1",
                "is_duoxuan": 1,
                "xuanxiang": [
                    {
                        "sub_order":1,
                        "name": "题库1_题目1_选项1"
                    },
                    {
                        "sub_order":2,
                        "name": "题库1_题目1_选项2"
                    },
                    {
                        "sub_order":3,
                        "name": "题库1_题目1_选项3"
                    },
                    {
                        "sub_order":4,
                        "name": "题库1_题目1_选项4"
                    }
                ]
            },}
        key: id=题库id name=题目名  xuanxiang下的name为选项名   xuanxiang下的sub_order为顺序    is_duoxuan=是否多选(1为多选，0为不多选)
        a1如果不等于1则表示出错了，返回data值都是错误代码，
        返回data值结果如下：array('errcode'=>111, 'errmsg'=>题库题目未添加)
        array('errcode'=>110, 'errmsg'=>’题库id未填写)
        操控表test  select id,name,type,parent_id from test where root_id=传入的参数题库id
    */

    public function timu()
    {
        try {
            $sub_order_pei_zhi=C('sub_order');//获取选项配置
            $ti_ku_id = I('tikuid');
            if (ic_isPosInt($ti_ku_id)) {
                $map['parent_id'] = $ti_ku_id;
                $map['type'] = 2;
            } 
            elseif ($ti_ku_id==-3671) {
                //carly要求有综合题库概念,从所有题库中抽取20道题来组成一次测试
                $map['type'] = 2;
            }
            else {
                throw new \Exception("请选择正确的题库哦", 110);
            }
            $ti_mu = M('test')->where($map)->order('sub_order asc')->field('id,name,is_duoxuan')->select();
            
            if (!$ti_mu) {
                throw new \Exception("网络原因,您选择的题库暂无题目哦", 111);
            }
            //carly 要求从题库中随机取20道题返回
            shuffle($ti_mu);
            $len=C('timu_count_max');
            $return_ti_mu=array();
            for($ik=0;$ik<$len;$ik++) {
                $value=$ti_mu[$ik];
                $ti_mu_xuan_xiang = M('test')->where(array('parent_id' => $value['id']))
                    ->field('sub_order,name')->order('sub_order asc')->select();

                foreach($ti_mu_xuan_xiang as $kk=>$vv){
                    $sub_order_d=$ti_mu_xuan_xiang[$kk]['sub_order'];
                    $vv['sub_order']=$sub_order_pei_zhi[$sub_order_d];
                    $ti_mu_xuan_xiang[$kk]=$vv;
                }
                $value['xuanxiang'] = $ti_mu_xuan_xiang;
                $return_ti_mu[]=$value;
            }
            $succ = 1;
            $this->customReturn($succ, $return_ti_mu);
        } catch (\Exception $exc) {
            //返回失败信息
            $succ = $exc->getCode() == 1 ? -1 : $exc->getCode();
            $datas = array('errcode' => $succ, 'errmsg' => $exc->getMessage());
            $this->customReturn($succ, $datas);
        }
    }

    /*整套题答完,答案提交接口(设计稿6-3.jpg)
        接口地址:Home/Api/da_an_tj
        访问方式:
        GET,POST
        传入参数:answers 参数范例：timuid|2,3|timuid|4,5
        其中 2,3表示题目一用户选择的答案序号（序号范围永远是1-10）
        4,5表示题目二用户选择的答案序号（序号范围永远是1-10）
        …………………………
        返回值: array('succ'=>a1,'data'=>a2)
        如果a1==1时，表示接口成功调用，a2里data包含正确的返回值，
        {
        "succ": 1,
        "data": {
            "benchidefen": 5
        }
    }
        Key；benchidefen=本题答题得分；
        a1如果不等于1则表示出错了，返回data值都是错误代码，
        返回data值结果如下：array('errcode'=>112, 'errmsg'=>’"题目id不存在)
                            array('errcode'=>302, 'errmsg'=>’题目来自不同的题库哦无法提交答案,请检查)
        操控表：test_history，  select, answers, from test_history where q_ id,name =传入题目一id|2,3|题二id|4,5并判断是否答对，
        Update  apply_user_month_points， points
        Update   apply_user_quarter_points  points
    */
    public function da_an_tj()
    {

        try {
            $jin_r_dati_shu = D('Api');//实例化模型
            $user_id = $this->usre_id;
            $jin_r_dati_shu = $jin_r_dati_shu->ranking_points($user_id);//答题次数
            $answers = I('answers');
            $lines = explode("|", $answers);
            $timu = array();
            foreach ($lines as $k => $value) {
                if ($k % 2 == 0) {
                    $single_timu = array();
                    $single_timu['id'] = $value;
                    $single_timu['answers'] = $lines[$k + 1];
                    $timu[] = $single_timu;
                }
            }
            //安全验证: 题库id赋值给变量test_id,用来验证本次提交的所有题目必须属于同一个题库
            //carly要求有综合题库概念,题目可能来自不同题库,所以此安全验证去掉
            //$test_id = 0;
            $zhongfen = 0;
            $test_modle = M('test');
            //开启事务
            $test_modle->startTrans();
//             dump($test_modle);
            foreach ($timu as $kk => $vv) {
                $ma['id'] = $vv['id'];
                $ma['type'] = 2;
                $right_answer_parent_id = $test_modle->where($ma)->field('parent_id,right_answer')->find();
                if (!$right_answer_parent_id) {
                    throw new \Exception("题目id不存在", 112);
                }
                // if ($test_id == 0) {
                //     $test_id = $right_answer_parent_id['parent_id'];
                // } else if ($test_id != $right_answer_parent_id['parent_id']) {
                //     //题目不是来自同1题库,出错了
                //     throw new \Exception("题目来自不同的题库哦,无法提交答案,请检查", 302);
                // }
                $add['user_id'] = $this->usre_id;
                $add['test_id'] = $right_answer_parent_id['parent_id'];
                $add['q_id'] = $vv['id'];
                $add['answers'] = $vv['answers'];
                $add['created_at']=time();
                if ($vv['answers'] == $right_answer_parent_id['right_answer']) {
                    $add['is_right'] = 1;
                    $add['score'] = 5;
                    $zhongfen += 5;
                } else {
                    $add['is_right'] = 3;
                    $add['score'] = 0;
                }
                if(!$jin_r_dati_shu) {
                    M('test_history')->add($add);
                }
            }
            $thismonth = date('Ym'); //得到201606
            $thism = date('Y');//年份
            $updat = array();
            $add = array();
            $updat['month'] = $thismonth;
            $updat['user_id'] = $this->usre_id;
            $yue_fen = M('apply_user_month_points')->where($updat)->find();
            if ($yue_fen) {
                $ufendata['points']=array('exp','points+'.$zhongfen);
                $ufendata['updated_at']= time();
                if(!$jin_r_dati_shu) {
                    M('apply_user_month_points')->where($updat)->save($ufendata);//更新月度表积分
                }
            } else {
                $add['month'] = $thismonth;
                $add['user_id'] = $this->usre_id;
                $add['points'] = $zhongfen;
                $add['updated_at'] = time();
                if(!$jin_r_dati_shu) {
                    M('apply_user_month_points')->add($add);//没有查到月份就新增一条
                }
            }
            $ji_du = date('m');//月份
            $updatt = array();
            $updattadd = array();
            $updatt['user_id'] = $this->usre_id;
            if ($ji_du == '01' || $ji_du == '02' || $ji_du == '03') {
                $updatt['quarter'] = $thism . '1';
            } elseif ($ji_du == '04' || $ji_du == '05' || $ji_du == '06') {
                $updatt['quarter'] = $thism . '2';
            } elseif ($ji_du == '07' || $ji_du == ' 08' || $ji_du == '09') {
                $updatt['quarter'] = $thism . '3';
            } elseif ($ji_du == '10' || $ji_du == '11' || $ji_du == '12') {
                $updatt['quarter'] = $thism . '4';
            }
            $ji_du_zbz = M('apply_user_quarter_points')->where($updatt)->find();
            if ($ji_du_zbz) {
                $ufendata['points']=array('exp','points+'.$zhongfen);
                $ufendata['updated_at']= time();
                if(!$jin_r_dati_shu) {
                    M('apply_user_quarter_points')->where($updatt)->save($ufendata);//更新季度表积分
                }
            } else {
                $updattadd['points'] = $zhongfen;
                $updattadd['quarter'] = $updatt['quarter'];
                $updattadd['user_id'] = $updatt['user_id'];
                $updattadd['updated_at'] = time();
                if(!$jin_r_dati_shu) {
                    M('apply_user_quarter_points')->add($updattadd);//没有查到月份就新增一条
                }
            }
            $succ = 1;
            $data['benchidefen'] = $zhongfen;
            $test_modle->commit();
            //20160612 sunny要求根据得分返回鼓励话语
            $inspire_text = C('inspire_text');
            $data['inspire_text']='';
            foreach ($inspire_text as $key => $value) {
                if($zhongfen<=$key){
                    $ra = rand(0,count($value)-1);
                    $data['inspire_text'] = $value[$ra];
                    break;
                }
            }
            $this->customReturn($succ, $data);
        } catch (\Exception $exc) {
            $test_modle->rollback();
            //返回失败信息
            $succ = $exc->getCode() == 1 ? -1 : $exc->getCode();
            $datas = array('errcode' => $succ, 'errmsg' => $exc->getMessage());
            $this->customReturn($succ, $datas);
        }

    }

    /*接口(设计稿7.jpg)
      接口地址:Home/Api/ranking_points
      访问方式:GET,  POST
      传入参数:不需要
      返回值: array('succ'=>a1,'data'=>a2)
      如果a1==1时，表示接口成功调用，a2里data包含正确的返回值，
   {
      "succ": 1,
      "data": {
          "points": "54",
          "quan_guo_pai_ming": 4,
          "ji_bai_duo_shao_r": 3

      }
  }
    key:points=本月积分 quan_guo_pai_ming=全国排名 ji_bai_duo_shao_r=击败多少人 jin_r_dati_shu=当用户答题次数超过指定答题次数时，data里会返回
      a1如果不等于1则表示出错了，返回data值都是错误代码，
      返回data值结果如下：array('errcode'=>112, 'errmsg'=>’数据返回失败)
      操控表：，本次答题得分：select test_history score  where user id =用户id
      全国排名：Select count(1) from apply_user_month_points where points>当前用户points
    */

    public function ranking_points()
    {
        $data = array();
        try {
            $ma['user_id'] = $this->usre_id;
            $thismonth = date('Ym'); //得到本月
            $ma['month'] = $thismonth;
            $points = M('apply_user_month_points')->where($ma)->field('points')->find();//本月积分
            $map['points'] = array('gt', $points['points']);
            $map['month'] = $ma['month'];
            $data_id = M('apply_user_month_points')->where($map)->count();
            $total_number_people = M('apply_user_month_points')->where(array('month' => $map['month']))->count('user_id');//当月一共多少人
            $pai_ming = $data_id + 1;//当月当前排名
            $ji_bai = $total_number_people - $pai_ming;//击败多少人
            $succ = 1;
            $data['points'] = $points['points'];
            $data['quan_guo_pai_ming'] = $pai_ming;
            $data['ji_bai_duo_shao_r'] = $ji_bai;
            $jin_r_dati_shu = D('Api');//实例化模型
            $user_id = $this->usre_id;
            $jin_r_dati_shu = $jin_r_dati_shu->ranking_points($user_id);
            if ($jin_r_dati_shu) {
                $data['jin_r_dati_shu'] = $jin_r_dati_shu;
            }
            //根据排名返回鼓励话语
            // //20160612 sunny要求根据得分返回鼓励话语
            // $inspire_text = C('inspire_text');
            // $data['inspire_text']='';
            // foreach ($inspire_text as $key => $value) {
            //     if($data['quan_guo_pai_ming']<=$key){
            //         $ra = rand(0,count($value)-1);
            //         $data['inspire_text'] = $value[$ra];
            //         break;
            //     }
            // }
            $this->customReturn($succ, $data);
        } catch (\Exception $exc) {
            //返回失败信息
            $succ = $exc->getCode() == 1 ? -1 : $exc->getCode();
            $datas = array('errcode' => $succ, 'errmsg' => $exc->getMessage());
            $this->customReturn($succ, $datas);
        }

    }

    /*2.7	月度冠军获取接口
        接口地址:Home/Api/ydu_g_ju
        访问方式:GET,  POST
        传入参数:月份：month（数字大于0 范例201605）
        返回值: array('succ'=>a1,'data'=>a2)
        如果a1==1时，表示接口成功调用，a2里data包含正确的返回值，
        {
       "succ": 1,
       "data": {
           "realname": "知道",
           "store_name": "龙德路店",
           "month": "201606"
       }
   }
    key:  realname=月度冠军姓名   store_name=店名  month=当前月份
        a1如果不等于1则表示出错了，返回data值都是错误代码，
        返回data值结果如下：array('errcode'=>113, 'errmsg'=>’月份格式不对，或者未填写)
        操控表：
       月度冠军：select *from apply_user_month_points，where （month= 当前月） order by points desc limit 1;
       用户id，店名，姓名：Selec store_name,, realname  from t apply_user  where id, =用户id
   */
    public function ydu_g_ju()
    {
        try {
            $month = I('month');
            if (ic_checkUnEmpty($month)) {
                $map['month'] = $month;
            } else {
                throw new \Exception("月份格式不对，或者未填写", 113);
            }
            $points = M('apply_user_month_points')->where($map)->order('points desc')->find();//本月冠军
            $fan_hui_yong_hu_zl = M('apply_user')->where(array('id' => $points['user_id']))->field('realname,store_name')->find();//返回月度冠军姓名和店名
            $fan_hui_yong_hu_zl['month'] = $points['month'];
            $succ = 1;
            $this->customReturn($succ, $fan_hui_yong_hu_zl);
        } catch (\Exception $exc) {
            //返回失败信息
            $succ = $exc->getCode() == 1 ? -1 : $exc->getCode();
            $datas = array('errcode' => $succ, 'errmsg' => $exc->getMessage());
            $this->customReturn($succ, $datas);
        }
    }

    /*我的成绩查询接口(设计稿11.jpg)
       接口地址:Home/Api/cheng_ji
       访问方式:GET,  POST
       传入参数:  不需要
       返回值: array('succ'=>a1,'data'=>a2)
       如果a1==1时，表示接口成功调用，a2里data包含正确的返回值，
       {
       "succ": 1,
       "data": {
           "points": "54",
           "realname": "杰杰",
           "store_name": "曹阳店",
           "phone": "18117364672",
           "quan_guo_pm": 3,
           "yong_hu_zf": "107",
           "xiang_cha_ts": 435
       }
   }
    key: points=本月积累分数 realname=用户姓名 store_name=店名 phone=手机号 quan_guo_pm=全国排名 yong_hu_zf=用户总分 xiang_cha_ts=距离月度第一还差多少题
       a1如果不等于1则表示出错了，返回data值都是错误代码，
       返回data值结果如下：array('errcode'=>0, 'errmsg'=>’数据返回失败)
       操控表：姓名店名手机：Select   apply_user id，store_name，realname，phone
       我的成绩全国排名：
       Select count(1) from apply_user_month_points where points>当前用户points
       本月累计积分：select  points  from apply_user_month_points
       where user_id =当前用户id and month = 当前月
       总分：select sum(points) from apply_user_month_points
       where user_id =当前用户id
       距离第一名只差答对：
       先查当月第一名分数 select  max(points)  from apply_user_month_points
       Where month = 当前月
       第一名分数减去当去用户的分说除以5 即相差题数
       *
   */

    public function cheng_ji()
    {
        try {
            $ma['user_id'] = $this->usre_id;
            $thismonth = date('Ym'); //得到本月
            $ma['month'] = $thismonth;
            $points = M('apply_user')->where("id=$this->usre_id")->field('realname,store_name,phone')->find();
            $points1 = M('apply_user_month_points')->where($ma)->field('points')->find();//本月累积积分
            if (!$points1['points']) {
                $points1['points'] = 0;
            }
            $map['points'] = array('gt', $points1['points']);
            $map['month'] = $ma['month'];
            $data_id = M('apply_user_month_points')->where($map)->count();
            $pai_ming = $data_id + 1;//当月当前全国排名
            $zhong_fen = M('apply_user_month_points')->where(array('user_id' => $this->usre_id))->sum('points');//用户总分
            if (!$zhong_fen) {
                $zhong_fen = 0;
            }
            $di_yi_fen_shu = M('apply_user_month_points')->where(array('month' => $map['month']))->max('points');//当月第一名分数
            $xiang_cha_fen_shu = $di_yi_fen_shu - $points1['points'];
            $xiang_cha_ti_shu = $xiang_cha_fen_shu / 5;
            $xiang_cha_ti_shuu = floor($xiang_cha_ti_shu);
            $points['points'] = $points1['points'];
            $points['quan_guo_pm'] = $pai_ming;
            $points['yong_hu_zf'] = $zhong_fen;
            $points['xiang_cha_ts'] = $xiang_cha_ti_shuu;
            $succ = 1;
            $this->customReturn($succ, $points);
        } catch (\Exception $exc) {
            //返回失败信息
            $succ = $exc->getCode() == 1 ? -1 : $exc->getCode();
            $datas = array('errcode' => $succ, 'errmsg' => $exc->getMessage());
            $this->customReturn($succ, $datas);
        }
    }

    /*获得当前用户的当月排名,并计算处于前50%还是后50%
    为微信分享使用
    return 1  未注册未登录的用户或者说虽已注册和登录,但一次题目也没答过,没有排名
    return 2  以往有过测试结果且目前排名前50%
    return 3  以往有过测试结果且目前排名后50%
   */
    public function global_paiming(){
        // $this->usre_id=338;
        if(!$this->usre_id){
            $this->customReturn(1, array('re'=>1));
        }
        $ma['user_id'] = $this->usre_id;
        $thismonth = date('Ym'); //得到本月
        $ma['month'] = $thismonth;
        //$points = M('apply_user')->where("id=$this->usre_id")->field('realname,store_name,phone')->find();
        $cur_user_points = M('apply_user_month_points')->where($ma)->field('points')->find();//本月累积积分
        // dump(M('apply_user_month_points')->getLastSql());
        if (!$cur_user_points) {
            $this->customReturn(1, array('re'=>1));
        }
        // dump(111);
        $map['points'] = array('gt', $cur_user_points['points']);
        $map['month'] = $ma['month'];
        $pai_ming = M('apply_user_month_points')->where($map)->count();
        $pai_ming = $pai_ming + 1;//当月当前全国排名
        //当月一共多少人
        $total_number_people = M('apply_user_month_points')->where(array('month' => $map['month']))->count('user_id');
        $percent=$pai_ming/$total_number_people;
        // dump($total_number_people);
        if($percent<=0.5){
            $this->customReturn(1, array('re'=>2));
        }
        $this->customReturn(1, array('re'=>3));

    }
}
