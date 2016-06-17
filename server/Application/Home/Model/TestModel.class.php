<?php

/**
 * 测试套题模型
 * @author perry
 */

namespace Home\Model;

use Think\Model;

class TestModel extends Model {


    /**
     * 初始化
     */
    function _initialize() {
        $this->tableName = 'test';
    }
    
    function getTest($map){
    	$u = $this->where($map)->order('id desc')->find();
    	return $u;
    }
    
    function getTestArray($map){
    	$u = $this->getTest($map);
    	if($u){
    		$u['contents']= json_decode($u['contents'],true);
    	}
    	return $u;
    }

    

}
