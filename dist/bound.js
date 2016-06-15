/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var style = __webpack_require__(2);
	var template = __webpack_require__(10);
	var webEvents = __webpack_require__(11);
	var layout = __webpack_require__(13);
	var awardData = __webpack_require__(16);
	var preRotate = -1;
	var timer = null;
	/*var a={
		list:[
			{
				date:"03.25",
				award_name:"球衣",
				award_number:1
			},

			{
				date:"03.25",
				award_name:"球衣",
				award_number:1
			},
			{
				date:"03.25",
				award_name:"球衣",
				award_number:1
			},
			{
				date:"03.25",
				award_name:"球衣",
				award_number:1
			},
			{
				date:"03.25",
				award_name:"球衣",
				award_number:1
			}

		]
	}
	console.log(JSON.stringify(a))

	*/

	//主页面
	function addHome() {

		clearTimer();

		$('.main').contents().remove(); //清除掉内容

		var home = template.home();
		$('.main').append(home);
		//点击 开始 按钮
		$('.start-btn').click(function () {

			if (isfans == 1) {

				webEvents.emit('luckEvent');
			} else {
				webEvents.emit('PopupEvent.createFocus');
			}
		});
	}

	//清除摇奖页面的灯计时器
	function clearTimer() {

		if (timer != null) {

			clearInterval(timer);
			timer = null;
		}
	}
	//摇奖页面
	function addluck() {

		clearTimer();

		$('.main').contents().remove();
		var luck = template.luck();
		$('.main').append(luck);

		$('.round-pan').height($('.round-pan').width()); //shit for round fixer

		//查看我的中奖礼品
		$('.myAwardBtn').click(function () {
			webEvents.emit('PopupEvent.myAwardEvent');
		});

		//开始抽奖按钮点击 事件
		$('.zhizheng').click(function () {

			awardData.getAward().then(function (param) {
				preRotate = preRotate == param.rotate + 360 * 10 ? preRotate + 360 * 10 + 360 : param.rotate + 360 * 10;

				webEvents.emit('coverEvent');

				$('.round-pan').animate({ d: preRotate }, {

					step: function step(now, fx) {
						$(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
						$(this).css('-moz-transform', 'rotate(' + now + 'deg)');
						$(this).css('transform', 'rotate(' + now + 'deg)');
					},
					duration: 5000,
					complete: function complete() {

						if (param.data.get == 1) {

							if (param.data.virtual == 1) {
								//中了虚拟的奖品
								setTimeout(function () {
									webEvents.emit('PopupEvent.virAwardEvent', param);
									webEvents.emit('closeCoverEvent');
								}, 1000);
							} else {
								//中了实物奖品
								setTimeout(function () {
									webEvents.emit('PopupEvent.realAward', param);
									webEvents.emit('closeCoverEvent');
								}, 1000);
							}
						} else {

							setTimeout(function () {
								webEvents.emit('closeCoverEvent');
								alert('运气不佳,未中奖,继续加油哦！');
							}, 1000);
						}
					}
				}, 'linear');
			}, function (param) {

				console.log(param);
			});
		});

		//灯闪闪
		var obj = $('.light>img');
		var n = 1;
		timer = setInterval(function () {
			if (n > 3) {
				n = 1;
			}
			obj.attr("src", "image/light" + n + ".png");
			n++;
		}, 100);
	}

	//主页面
	webEvents.on('homeEvent', function () {
		addHome();
	});

	//摇奖页面
	webEvents.on('luckEvent', function () {
		addluck();
	});

	//填写信息弹出窗口
	webEvents.on('PopupEvent.WriteMessage', function (data) {

		layout.createWriteMessage(data);
	});
	//关注弹出窗口
	webEvents.on('PopupEvent.createFocus', function () {
		layout.createFocus();
	});
	//真实 奖品弹出窗口
	webEvents.on('PopupEvent.realAward', function (data) {
		layout.createRealAward(data);
	});
	//虚拟奖品弹出窗口
	webEvents.on('PopupEvent.virAwardEvent', function (data) {

		layout.createVirAward(data);
	});
	//我的奖品弹出窗口
	webEvents.on('PopupEvent.myAwardEvent', function () {
		layout.createMyAward();
	});
	//webEvents.emit('PopupEvent.WriteMessage')

	webEvents.on('coverEvent', function () {

		var cover = $('<div class="cover"></div>');
		$(document.body).append(cover);
	});
	webEvents.on('closeCoverEvent', function () {

		$('.cover').remove();
	});

	window.start = function () {

		webEvents.emit('homeEvent');
	};

	//webEvents.emit('PopupEvent.createFocus')
	//webEvents.emit('PopupEvent.realAward')
	//webEvents.emit('luckEvent')
	//webEvents.emit('PopupEvent.virAwardEvent')
	//webEvents.emit('PopupEvent.myAwardEvent')
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 2 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	"use strict";

	function home() {
		return "<div class=\"home\">\n\t\t\t\t<div class=\"index-top\">\n\t\t\t\t\t<div class=\"title\"><img src=\"image/title.png\"/></div>\n\t\t\t\t\t<div class=\"dai\">\n\t\t\t\t\t\t<div class='dai-bg'><img src=\"image/top.png\"/></div>\n\t\t\t\t\t\t<div class=\"a-dai\"><img src=\"image/a-dai.png\"/></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"index-bottom\">\n\t\t\t\t\t<div class=\"start-btn\"><a href='javascript:void(0)'><img src=\"image/btn-index.png\"/></a></div>\n\t\t\t\t\t<div class=\"index-logo\"><img src=\"image/logo-index.png\"/></div>\n\t\t\t\t\t<img src=\"image/index-bottom.png\" class='ib-bg'/>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"caidai\">\n\t\t\t\t\t<div class='dai-bg'><img src=\"image/caidai.png\"/></div>\n\t\t\t\t</div>\n\t\t\t</div>";
	}

	function luck() {

		return "<div class=\"luck\">\n\t\t\t<div class=\"luck-title\">\n\t\t\t\t<img src=\"image/title2.png\"/>\n\t\t\t\t\n\t\t\t\t<div class=\"jingbi\"><img src=\"image/luck-ani-1.png\"/></div>\n\t\t\t\t<div class=\"bao\"><img src=\"image/luck-ani-2.png\"/></div>\n\t\t\t</div>\t\n\t\t\n\t\t\t<div class=\"pan\">\n\t\t\t\t<div class=\"round-pan\"><img src=\"image/pan.png\"/></div>\n\t\t\t\t<div class=\"zhizheng\"><img src=\"image/zhizheng.png\"/></div>\n\n\t\t\t\t<div class=\"light\">\n\t\t\t\t\t<img src=\"image/light1.png\"/>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"myAwardBtn\"><a href='javascript:void(0)'><img src=\"image/myAwardBtn.png\"/></a></div>\n\t\t</div>";
	}

	module.exports = {

		home: home,
		luck: luck
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var events = __webpack_require__(12);

	var event = new events.EventEmitter();

	module.exports = event;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function (n) {
	  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function (type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events) this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler)) return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++) {
	      listeners[i].apply(this, args);
	    }
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function (type, listener) {
	  var m;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events) this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function (type, listener) {
	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function (type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type]) return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener || isFunction(list.listener) && list.listener === listener) {
	    delete this._events[type];
	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0) return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function (type) {
	  var key, listeners;

	  if (!this._events) return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length) {
	      this.removeListener(type, listeners[listeners.length - 1]);
	    }
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function (type) {
	  var ret;
	  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function (type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function (emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var webEvents = __webpack_require__(11);
	var nets = __webpack_require__(14);
	var pageData = __webpack_require__(15);

	var popup = null;
	/*

		param:
			bgClickClose:bool,true点击背景可以关掉弹出窗口，false反之
	*/
	function createLayOut() {
		var bgClickClose = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];


		popup = $('<div class="popup"></div>');
		$(document.body).append(popup);

		if (bgClickClose) {
			popup.click(function () {
				$(this).remove();
				$('.popup-content').remove();
				popup = null;
			});
		}
	}

	function createWriteMessage(data) {

		var html = '\n\t\t<div class="write-message popup-content">\n\t\t\t<div class="write-message-image"><img src="image/message-bg.png"/></div>\n\t\t\t<div class="write-form">\n\t\t\t\t<input type=\'hidden\' value="' + data.data.gid + '" name=\'gid\'/>\n\t\t\t\t<div class="write-item-manager">\n\t\t\t\t\t<div class="write-item">\n\t\t\t\t\t\t<div class="write-item-icon"><img src="image/icon-1.png"/></div>\n\t\t\t\t\t\t<div class=\'write-item-input\'><input type=\'text\' placeHolder="请输入姓名" name=\'username\'/></div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="write-item">\n\t\t\t\t\t\t<div class="write-item-icon"><img src="image/icon-2.png"/></div>\n\t\t\t\t\t\t<div class=\'write-item-input\'><input type=\'tel\'  placeHolder="请输入手机号码"  name=\'userphone\'/></div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="write-item">\n\t\t\t\t\t\t<div class="write-item-icon"><img src="image/icon-3.png"/></div>\n\t\t\t\t\t\t<div class=\'write-item-input\'><input type=\'text\' placeHolder="请输入地址" name=\'useraddress\'/></div>\n\t\t\t\t\t</div>\n\n\t\t\t\t</div>\n\t\t\t\t<div class=\'write-message-submit-btn\'><a href=\'javascript:void(0)\'><img src="image/submit-message.jpg"/></a></div>\n\t\t\t</div>\n\t\t</div>\n\t';
		createLayOut(false);
		$(document.body).append(html);

		$('.write-message-submit-btn>a').click(function () {

			var gid = $("input[name='gid']").val();
			var username = $("input[name='username']").val();
			var userphone = $("input[name='userphone']").val();
			var useraddress = $("input[name='useraddress']").val();

			if (gid.length <= 0) {
				alert('发生错误！请联系管理员!');
				return;
			}
			if (username.length <= 1) {
				alert('请正确填写姓名');
				return;
			}
			if (!/^1[0-9]{10}$/.test(userphone)) {
				alert("请正确填写手机号码");
				return;
			}
			if (useraddress.length <= 5) {
				alert('请正确填写地址');
				return;
			}
			var object = {
				gid: gid,
				username: username,
				userphone: userphone,
				useraddress: useraddress
			};
			nets.submitMessage(object).then(function (data) {
				closePopup();
				if (data.status == 1) {
					//提交成功
					alert('提交信息成功！');
				} else {
					alert(data.info);
				}
			}, function () {
				closePopup();
				console.log('提交信息发生异常');
			});
		});
	}

	function createFocus() {

		var html = '\n\t\t<div class="focus popup-content">\n\t\t\t<div class=\'focus-tips\'><img src="image/focus.png"/></div>\n\n\t\t\t<div class="close-btn"><img src="image/close-btn.jpg"/></div>\n\t\t</div>\n\t';
		createLayOut();
		$(document.body).append(html);

		$('.close-btn').click(function () {
			closePopup();
		});
	}

	function createVirAward(data) {

		var html = '\n\t\t<div class="virAward popup-content">\n\t\t\t<div class="vir-bg"><img src="image/vir_bg.png"/></div>\n\t\t\t<div class="vir-award-content">\n\t\t\t\t<img src="' + data.data.pic + '"/>\n\t\t\t</div>\n\t\t\t\t<div class="star-manager">\n\t\t\t\t\t<div><img src="image/star-left.png"/></div>\n\t\t\t\t\t<div><img src="image/star-middle.png"/></div>\n\t\t\t\t\t<div><img src="image/star-right.png"/></div>\n\t\t\t\t</div>\n\t\t</div>\n\n\t';
		$(document.body).append(html);

		createLayOut();
	}

	function createRealAward(data) {

		var html = '\n\t\t\t<div class="realAward popup-content">\n\t\t\t\t<div class="star-manager">\n\t\t\t\t\t<div><img src="image/star-left.png"/></div>\n\t\t\t\t\t<div><img src="image/star-middle.png"/></div>\n\t\t\t\t\t<div><img src="image/star-right.png"/></div>\n\t\t\t\t</div>\n\t\t\t\t<div class="realAward-image"><img src="image/award_bg.png"/></div>\n\t\t\t\t<div class="realAwardImage"><img src="image/quan.png"/></div>\n\t\t\t\t<div class="realAwardBtn"><img src="image/btn.png"/></div>\n\t\t\t<div>\n\t';
		createLayOut(false);
		$(document.body).append(html);
		//关闭自己，并且跳到填写弹出窗口页面
		$('.realAwardBtn').click(function () {
			closePopup();
			webEvents.emit('PopupEvent.WriteMessage', data);
		});
	}
	//创建我的中奖纪录
	function createMyAward() {
		nets.getMyAward().then(function (data) {

			var source = pageData(data.list); //中奖数据实翻页实例

			var item = '<div class="my-award-item">\n\t\t\t\t\t\t<div class="my-award-left"><img src="image/award-item-left.png"/><span>3.25</span></div>\n\t\t\t\t\t\t<div class="my-award-middle">雨伞</div>\n\t\t\t\t\t\t<div class="my-award-right">3</div>\n\t\t\t\t\t</div>';

			var html = '\n\t\t\t<div class="myAward popup-content">\n\t\t\t\t<div class="myaward-top"><img src="image/my-top.png"/><span class="close-btn-2"><img src="image/close-btn2.png"/></span></div>\n\t\t\t\t<div class="myaward-middle">\n\t\t\t\t\t\n\t\t\t\t</div>\n\t\t\t\t<div class="myaward-bottom"><img src="image/my-bottom.png"/>\n\t\t\t\t\t<div class="next-btn"><img src="image/next.png"/></div>\n\t\t\t\t</div>\n\t\t\t<div>\n\t\t\t';

			createLayOut();
			$(document.body).append(html);

			//下一页数据
			$('.next-btn').click(function () {
				var data = source.next();
				if (data) {
					$('.myaward-middle').contents().remove();
					for (var i = 0; i < data.length; i++) {
						var d = $(item);
						d.find('.my-award-left span').text(data[i].date);
						d.find('.my-award-middle').text(data[i].award_name);
						d.find('.my-award-right').text(data[i].award_number);
						$('.myaward-middle').append(d);
					}
				}
			});

			$('.next-btn').trigger('click');

			//关闭按钮
			$('.close-btn-2').click(function () {
				closePopup();
			});
		}, function (e) {
			console.log('error in my award data');
		});
	}

	function closePopup() {
		if (popup) {
			popup.remove();
			$('.popup-content').remove();
			popup = null;
		}
	}

	module.exports = {

		createWriteMessage: createWriteMessage,
		createFocus: createFocus,
		createRealAward: createRealAward,
		createVirAward: createVirAward,
		createMyAward: createMyAward

	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	function ajax(url) {
		var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];


		return $.ajax({
			type: 'GET',
			url: url,
			data: data,
			dataType: 'json'

		});
	}

	function getMyAward() {

		return ajax("myaward.json");
	}

	function getAward() {

		return ajax("one.json");
	}

	function submitMessage(data) {

		return ajax("setAward.json", data);
	}

	module.exports = {
		getMyAward: getMyAward,
		getAward: getAward,
		submitMessage: submitMessage
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PageData = function () {
		function PageData(data) {
			_classCallCheck(this, PageData);

			this._data = data;
			this._pagesize = 3;
			this._index = -1;
		}

		_createClass(PageData, [{
			key: 'next',
			value: function next() {
				this._index++;
				var result = this.getData();

				if (!result) {
					this._index--;
				}
				return result;
			}
		}, {
			key: 'pre',
			value: function pre() {
				this._index--;
				var result = this.getData();
				if (!result) {

					this._index++;
				}
				return result;
			}
		}, {
			key: 'hasNext',
			value: function hasNext() {

				var start = this._index * this._pagesize;
				var end = start + this._pagesize - 1;
				return end + 1 >= this._data.length ? false : true;
			}
		}, {
			key: 'hasPrev',
			value: function hasPrev() {

				if (this._index > 0) {

					return true;
				}

				return false;
			}
		}, {
			key: 'getData',
			value: function getData() {

				var result = [];
				var start = this._index * this._pagesize;
				var end = start + this._pagesize - 1;
				for (var i = start; i <= end; i++) {
					if (typeof this._data[i] != 'undefined') {
						result.push(this._data[i]);
					} else {
						break;
					}
				}
				return result.length > 0 ? result : false;
			}
		}]);

		return PageData;
	}();

	module.exports = function (data) {

		return new PageData(data);
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	var net = __webpack_require__(14);
	var local_award_info = {
		award_mapping: [{
			id: 1,
			name: "10元微店优惠券",
			rotate: 315
		}, {
			id: 2,
			name: "手机壳",
			rotate: 275
		}, {
			id: 3,
			name: "阳伞",
			rotate: 180
		}, {
			id: 4,
			name: "5元微店优惠券",
			rotate: 135
		}, {
			id: 5,
			name: "球衣",
			rotate: 45
		}
		/*{
	 	id:-1,
	 	name:"没有中奖",
	 	rotate:[90,0,230]
	 }*/
		]
	};

	function getRotateById(param) {

		var data = local_award_info.award_mapping;

		var rotate = null;

		if (param.get == 1) {
			//中奖
			for (var i = 0; i < data.length; i++) {
				if (data[i].id == param.id) {
					rotate = data[i].rotate;
				}
			}
		} else {
			//未中奖
			var g = [90, 0, 230];
			return g[Math.floor(Math.random() * 3)];
		}
		return rotate;
	}

	function getAward() {

		var defer = $.Deferred();

		net.getAward().then(function (data) {

			var pan_rotate = getRotateById(data);

			return defer.resolve({ rotate: pan_rotate, data: data });
		}, function () {

			defer.reject('摇奖接口发生异常');
		});

		return defer.promise();
	}

	module.exports = {
		local_award_info: local_award_info,
		getAward: getAward
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
/******/ ]);