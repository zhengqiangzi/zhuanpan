<?php

/**
 * 验证基类，所有需要登录的Controller都必须继承本类
 */

namespace Base;

class BackController extends BaseController {

    public function _initialize() {
        parent::_initialize();
        $this->checkLogin();
    }

}
