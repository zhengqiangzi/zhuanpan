<?php

/**
 * 测试套题模型
 * @author perry
 */

namespace Home\Logic;

use Think\Model;
use Think\Exception;

class TestLogic extends Model {

	private $model;
    /**
     * 初始化
     */
    function _initialize() {
        $this->model = D('Home/Test');
        $this->testSurveyM = D('Home/TestSurvey');
        $this->testSurveyDetailM = D('Home/TestDetail');
        $this->user  =D('Home/User');
        $this->scoreHistoryLogic=D('Home/ScoreHistory','Logic');
    }
    
    /**
     * @name 判断指定用户是否做过当前活跃测试，如果做过返回做过历史，如果未做过返回套题信息
     * @param unknown $uid
     * @return multitype:string number |multitype:string number NULL |multitype:string number unknown
     */
    function getActiveTest($uid){
    	$map['test_month'] = ic_curMonth();
    	$map['is_active'] = 1;
    	$test = $this->model->getTest($map);
    	
    	if (!$test){
    		return array('msg'=>'本月暂无有效的测试任务','datas'=>null, 'code'=>-1);
    	}
    	//判断当前用户是否已做过这套题，如做过，返回提示信息，已做过本套题
    	$historyDatas = $this->getTestHistory($uid, $test['id']);
    	$historyDatas=change_to_str($historyDatas);
    	
    	if($historyDatas){
    		$test['already_answered']=1;
    		$msg = '您已参与过本月测试任务，不能重复参加哦';
    	}
    	else {
    		$test['already_answered']=0;
    		$msg='';
    	}
    	$test['answer_history']=$historyDatas;
    	
    	return array('msg'=>$msg,'datas'=>$test,'code'=>1);
    	//return  array('msg'=>'','datas'=>$test,'code'=>1);
    }
    
   
    /**
     * @name 根据uid和test主键获取该用户作测试的历史记录
     * @param unknown $uid
     * @param unknown $test_id
     * @return NULL|boolean
     */
    function getTestHistory($uid,$test_id){
    	$exist =  $this->testSurveyM->findRecord($uid,$test_id);
    	if($exist){
    		//获得该用户之前做过的答案选项
    		$historyDatas=$this->testSurveyDetailM->get_test_detail($uid,$exist['id']);
    		
    		//$historyDatas = true;
    		return $historyDatas;
    	}
    	return false;
    }
    
    /**
     * @name 提交用户的测试结果到数据表
     * @param unknown $uid
     * @param unknown $test_id
     * @param unknown $resultStr
     * @return multitype:string number Ambigous <NULL, boolean>
     */
    function submitTestResult($uid, $test_id, $resultStr){
    
    	//参数验证
    	if(!ic_isPosInt($test_id)){
    		return  array('msg'=>'测试任务编码无效，请重试','datas'=>null,'code'=>-1);
    	}
    	if(!ic_isPosInt($uid)){
    		return  array('msg'=>'您的登录信息已失效，请重新登录','datas'=>null,'code'=>-2);
    	}
    	//查找测试套题
    	$test = $this->model->getTestArray(array("id"=>$test_id));
    	if(!$test){
    		return  array('msg'=>'测试任务未找到，请重试','datas'=>null,'code'=>-3);
    	}
    	$testAnswers=$test['contents'];
    	$answerArr=explode('|',$resultStr);
    	
    	$submitLen=count($answerArr)-2;
    
    	$stanLen=count($testAnswers);
    	if($submitLen!=$stanLen){
    		$msg = $stanLen."您似乎没有答完整套题，请检查".$submitLen;
    		return  array('msg'=>$msg,'datas'=>null,'code'=>-4);
    	}
    	//判断当前用户是否已做过这套题，如做过，返回提示信息，已做过本套题
    	$historyDatas = $this->getTestHistory($uid, $test_id);
    	if($historyDatas){
    		return array('msg'=>'您已参与过本月测试任务，不能重复参加哦','datas'=>$historyDatas,'code'=>-2);
    	}
    	//准备提交数据
    	$sdatas['test_id']=$test_id;
    	$sdatas['user_id']=$uid;
    	$sdatas['create_time']=time();
    	try {
    		$this->startTrans();
    		
    		//算分
    		$sdatas['score']=$this->calScore($test_id, $resultStr);
    		
    		$re = $this->testSurveyM->add($sdatas);
    		
    	    if(!$re){throw new Exception('保存分数失败',-79);}
    		
    		// 保存测试每道题选择detail
    		$ans=answerstr_to_answerArr($resultStr);
    		for($i=0;$i<$submitLen;$i++){
    			$sdatas['q_id']=$test_id;
    			$sdatas['q_idx']=$i;
    			$sdatas['a_idx']=$ans[$i];
    			$detail=$this->testSurveyDetailM->add($sdatas);
    		   if(!$detail){throw new Exception('保存答案失败',-80);}
    		}

    		// 根据测试结果给用户加分
    		$map['id']=$uid;
    		$score=$sdatas['score'];
    		$data['score']=array('exp',"score+$score");
    		$ures=$this->user->where($map)->save($data);
    		if(!$ures){throw new Exception('更新用户答题分数失败',-80);}
    		$newsScore=$this->user->where(array('id'=>$uid))->find();
    		
    		// 记录用户积分变化历史
    		$scoreHistory=$this->scoreHistoryLogic->addScoreHistory($uid,$this->scoreHistoryLogic->TYPE_JOIN_TEST,$score,$memo=false,$test_id);
    		if(!$scoreHistory){throw new Exception('记录用户积分变化失败',-81);}
    		$this->commit();
    		
    		
    		$are['score']=$newsScore['score'];
    		return array('msg'=>'','datas'=>$are,'code'=>1);
    	} catch (Exception $e) {
    		$this->rollback();
    		return array('msg'=>$e->getMessage(),'datas'=>null,'code'=>$e->getCode());
    	}
    	
    }
  
    /**
     * @name 根据$test_id和resultStr算了当前用户答题得分
     * @param int $test_id
     * @param str $resultStr
     * @param $core 用户答题最终得分
     * @return int;
     */
    function calScore($test_id,$resultStr){

    	$test = $this->model->getTestArray(array("id"=>$test_id));
    	$answer=$test['contents'];
    	
    	//用户传过来的答案数组
    	$resultArr=answerstr_to_answerArr($resultStr);
    	$len=count($resultArr);
  
    	//正确答案数组
    	$right_answer_arr=$this->changeAnswer_str($answer);

        for($i=0;$i<$len;$i++){
        	
        	/* if($resultArr[$i]===substr($right_answer_arr[$i], 0,-1)){
        		$core+=C('testCore');
        	} */
        	
        	if($resultArr[$i]===$right_answer_arr[$i]){
        		$core+=C('testCore');
        	}
        }
        //dump($core);
    	return $core;
    }
    
    
    /**
     * 查找出当前月的上两个月的所有测试套题
     * 返回测试套量 id数组
     * return string "17,18,19,20"
     */
    function test_Subject(){
//     	$where['test_month']=ic_curMonth()-2;
    	$where['test_month']=ic_theMonthBeforeLastMonth();
    	$res=$this->where($where)->field('id')->select();
    	foreach($res as $v){
    		$str.=$v['id'].',';
    	}
    	
    	$str=substr($str,0,-1);
    	return $str;
    }
    
    /**
     * 查找出当前月的上两个月的所有测试套题
     * 返回测试套量 id数组
     * return string "17,18,19,20"
     */
    function test_History(){
//     	$where['test_month']=ic_curMonth()-1;
    	$where['test_month']=ic_lastMonth();
    	$res=$this->model->where($where)->field('id')->select();
     
    	foreach($res as $v){
    	
    			$str.=$v['id'].',';
    		
    		
    	}
    	 
    	$str=substr($str,0,-1);
       
    	return $str;
    }
    
    /**
     * 将数据里预存的套题正确答案转换成前端传过来格式的字符串
     * 便于比较用户是否答题正确
     * @param array $answer
     * @return multitype:string
     */
    function changeAnswer_str($answer){
    	
    	$str2=array();
    	$str3='';
    	foreach ($answer as $value){
    		$str1='';
    		 
    		  foreach ($value['answer'] as $v){
    		  	  
    		  	   if($v['is_right']==1){
    		  	   	  $str1.=($v['desc']-1).',';
    		  	   }
    		  }
    		
    		   $str2[]=$str1;
    	}
        return $str2;
    	
    }
    

}
