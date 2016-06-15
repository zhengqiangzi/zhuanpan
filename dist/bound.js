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
/******/ 	__webpack_require__.p = "./dist/";

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
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(9)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./../node_modules/sass-loader/index.js!./mainStyle.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./../node_modules/sass-loader/index.js!./mainStyle.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "/*! normalize-scss | MIT/GPLv2 License | bit.ly/normalize-scss */\n/**\r\n     * 1. Change the default font family in all browsers (opinionated).\r\n     * 2. Prevent adjustments of font size after orientation changes in IE and iOS.\r\n     */\nhtml {\n  font-family: sans-serif;\n  /* 1 */\n  -ms-text-size-adjust: 100%;\n  /* 2 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/**\r\n     * Remove the margin in all browsers (opinionated).\r\n     */\nbody {\n  margin: 0; }\n\n/* HTML5 display definitions\r\n       ========================================================================== */\n/**\r\n     * Add the correct display in IE <10.\r\n     * Add the correct display in Edge, IE, and Firefox for `details` or `summary`.\r\n     * Add the correct display in IE for `main`.\r\n     */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\n/**\r\n     * Add the correct display in IE <10.\r\n     */\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block; }\n\n/**\r\n     * Add the correct display and remove excess height in iOS 4-7.\r\n     */\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n/**\r\n     * Add the correct vertical alignment in Chrome, Firefox, and Opera.\r\n     */\nprogress {\n  vertical-align: baseline; }\n\n/**\r\n     * Add the correct display in IE <11, Safari <8, and Firefox <22.\r\n     * 1. Add the correct display in IE.\r\n     */\ntemplate,\n[hidden] {\n  display: none; }\n\n/* Links\r\n       ========================================================================== */\n/**\r\n     * 1. Remove the gray background on active links in IE 10.\r\n     * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\r\n     */\na {\n  background-color: transparent;\n  /* 1 */\n  -webkit-text-decoration-skip: objects;\n  /* 2 */ }\n\n/**\r\n     * Remove the outline on focused links when they are also active or hovered\r\n     * in all browsers (opinionated).\r\n     */\na:active,\na:hover {\n  outline-width: 0; }\n\n/* Text-level semantics\r\n       ========================================================================== */\n/**\r\n     * 1. Remove the bottom border in Firefox <40.\r\n     * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\r\n     */\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */ }\n\n/**\r\n     * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\r\n     */\nb,\nstrong {\n  font-weight: inherit; }\n\n/**\r\n     * Add the correct font weight in Chrome, Edge, and Safari.\r\n     */\nb,\nstrong {\n  font-weight: bolder; }\n\n/**\r\n     * 1. Correct the inheritance and scaling of font size in all browsers.\r\n     * 2. Correct the odd `em` font sizing in all browsers.\r\n     */\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\n/**\r\n     * Add the correct font style in Android <4.4.\r\n     */\ndfn {\n  font-style: italic; }\n\n/**\r\n     * Correct the font size and margin on `h1` elements within `section` and\r\n     * `article` contexts in Chrome, Firefox, and Safari.\r\n     */\nh1 {\n  font-size: 2em;\n  /* Set 1 unit of vertical rhythm on the top and bottom margins. */\n  margin: 0.75em 0; }\n\n/**\r\n     * Add the correct background and color in IE <10.\r\n     */\nmark {\n  background-color: #ff0;\n  color: #000; }\n\n/**\r\n     * Add the correct font size in all browsers.\r\n     */\nsmall {\n  font-size: 80%; }\n\n/**\r\n     * Prevent `sub` and `sup` elements from affecting the line height in\r\n     * all browsers.\r\n     */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsub {\n  bottom: -0.25em; }\n\nsup {\n  top: -0.5em; }\n\n/* Embedded content\r\n       ========================================================================== */\n/**\r\n     * Remove the border on images inside links in IE <11.\r\n     */\nimg {\n  border-style: none; }\n\n/**\r\n     * Hide the overflow in IE.\r\n     */\nsvg:not(:root) {\n  overflow: hidden; }\n\n/* Grouping content\r\n       ========================================================================== */\n/**\r\n     * Add the correct margin in IE 8.\r\n     */\nfigure {\n  margin: 1.5em 40px; }\n\n/**\r\n     * 1. Add the correct box sizing in Firefox.\r\n     * 2. Show the overflow in Edge and IE.\r\n     */\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */ }\n\npre {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\n/* Forms\r\n       ========================================================================== */\n/**\r\n     * Known issues:\r\n     * - By default, Chrome on OS X and Safari on OS X allow very limited styling of\r\n     *   select, unless a border property is set. The default font weight on\r\n     *   optgroup elements cannot safely be changed in Chrome on OSX and Safari on\r\n     *   OS X.\r\n     * - It is recommended that you do not style checkbox and radio inputs as\r\n     *   Firefox's implementation does not respect box-sizing, padding, or width.\r\n     * - Certain font size values applied to number inputs cause the cursor style of\r\n     *   the decrement button to change from default to text.\r\n     * - The search input is not fully stylable by default. In Chrome and Safari on\r\n     *   OSX/iOS you can't control font, padding, border, or background. In Chrome\r\n     *   and Safari on Windows you can't control border properly. It will apply\r\n     *   border-width but will only show a border color (which cannot be controlled)\r\n     *   for the outer 1px of that border. Applying -webkit-appearance: textfield\r\n     *   addresses these issues without removing the benefits of search inputs (e.g.\r\n     *   showing past searches). Safari (but not Chrome) will clip the cancel button\r\n     *   on when it has padding (and textfield appearance).\r\n     */\n/**\r\n     * 1. Change font properties to `inherit` in all browsers (opinionated).\r\n     * 2. Remove the margin in Firefox and Safari.\r\n     * 3. Address `font-family` inconsistency between `textarea` and other form in IE 7\r\n     * 4. Improve appearance and consistency with IE 6/7.\r\n     */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font: inherit;\n  /* 1 */\n  margin: 0;\n  /* 2 */ }\n\n/**\r\n     * Show the overflow in IE.\r\n     */\nbutton {\n  overflow: visible; }\n\n/**\r\n     * Remove the inheritance of text transform in Edge, Firefox, and IE.\r\n     * 1. Remove the inheritance of text transform in Firefox.\r\n     */\nbutton,\nselect {\n  /* 1 */\n  text-transform: none; }\n\n/**\r\n     * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\r\n     *    controls in Android 4.\r\n     * 2. Correct the inability to style clickable types in iOS and Safari.\r\n     */\nbutton,\nhtml [type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */ }\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  /**\r\n       * Remove the inner border and padding in Firefox.\r\n       */\n  /**\r\n       * Restore the focus styles unset by the previous rule.\r\n       */ }\n  button::-moz-focus-inner,\n  [type=\"button\"]::-moz-focus-inner,\n  [type=\"reset\"]::-moz-focus-inner,\n  [type=\"submit\"]::-moz-focus-inner {\n    border-style: none;\n    padding: 0; }\n  button:-moz-focusring,\n  [type=\"button\"]:-moz-focusring,\n  [type=\"reset\"]:-moz-focusring,\n  [type=\"submit\"]:-moz-focusring {\n    outline: 1px dotted ButtonText; }\n\n/**\r\n     * Show the overflow in Edge.\r\n     */\ninput {\n  overflow: visible; }\n\n/**\r\n     * 1. Add the correct box sizing in IE <11.\r\n     * 2. Remove the padding in IE <11.\r\n     * 3. Remove excess padding in IE 7.\r\n     *    Known issue: excess padding remains in IE 6.\r\n     */\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\r\n     * Correct the cursor style of increment and decrement buttons in Chrome.\r\n     */\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\r\n     * 1. Correct the odd appearance in Chrome and Safari.\r\n     * 2. Correct the outline style in Safari.\r\n     */\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n  /**\r\n       * Remove the inner padding and cancel buttons in Chrome and Safari on OS X.\r\n       */ }\n  [type=\"search\"]::-webkit-search-cancel-button, [type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none; }\n\n/**\r\n     * Correct the text style of placeholders in Chrome, Edge, and Safari.\r\n     */\n::-webkit-input-placeholder {\n  color: inherit;\n  opacity: 0.54; }\n\n/**\r\n     * 1. Correct the inability to style clickable types in iOS and Safari.\r\n     * 2. Change font properties to `inherit` in Safari.\r\n     */\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */ }\n\n/**\r\n     * Change the border, margin, and padding in all browsers (opinionated).\r\n     */\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\n/**\r\n     * 1. Correct the text wrapping in Edge and IE.\r\n     * 2. Correct the color inheritance from `fieldset` elements in IE.\r\n     * 3. Remove the padding so developers are not caught out when they zero out\r\n     *    `fieldset` elements in all browsers.\r\n     * 4. Correct alignment displayed oddly in IE 6/7.\r\n     */\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  white-space: normal;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  padding: 0;\n  /* 3 */ }\n\n/**\r\n     * Restore the font weight unset by a previous rule.\r\n     */\noptgroup {\n  font-weight: bold; }\n\n/**\r\n     * Remove the default vertical scrollbar in IE.\r\n     */\ntextarea {\n  overflow: auto; }\n\nbody {\n  margin: 0px;\n  padding: 0px;\n  font-size: 12px; }\n\nimg {\n  max-width: 100%;\n  height: auto; }\n\n* {\n  box-sizing: border-box; }\n\nul {\n  padding: 0px;\n  margin: 0px;\n  list-style-type: none; }\n\na {\n  text-decoration: none; }\n\ninput[placeholder], [placeholder], *[placeholder] {\n  color: #ff7a00;\n  font-size: 12px; }\n\n.main, .home, .luck, .popup, .loading, .cover {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0; }\n\n.main {\n  overflow: hidden; }\n\n.home {\n  background-image: url(" + __webpack_require__(5) + ");\n  background-size: cover; }\n\n.index-bottom {\n  position: absolute;\n  bottom: 0px; }\n  .index-bottom .ib-bg {\n    display: block; }\n  .index-bottom .start-btn {\n    width: 55.78125%;\n    position: absolute;\n    left: 50%;\n    -webkit-transform: translate3d(-50%, 70px, 0px);\n            transform: translate3d(-50%, 70px, 0px); }\n  .index-bottom .index-logo {\n    width: 47.1875%;\n    position: absolute;\n    left: 50%;\n    -webkit-transform: translate3d(-50%, 140px, 0px);\n            transform: translate3d(-50%, 140px, 0px); }\n\n.index-top {\n  position: absolute;\n  top: 0px;\n  width: 100%;\n  overflow: hidden;\n  margin-top: 60px; }\n  .index-top .title {\n    width: 90%;\n    margin-left: auto;\n    margin-right: auto; }\n  .index-top .dai {\n    margin-top: 40px;\n    width: 100%;\n    position: relative; }\n  .index-top .a-dai {\n    position: absolute;\n    width: 41.71875%;\n    left: 17%;\n    top: -35px; }\n\n.caidai {\n  width: 100%;\n  width: 90%;\n  margin-left: auto;\n  margin-right: auto;\n  margin-top: 5px; }\n\n@-webkit-keyframes round {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); }\n  to {\n    -webkit-transform: rotate(3600deg);\n            transform: rotate(3600deg); } }\n\n@keyframes round {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); }\n  to {\n    -webkit-transform: rotate(3600deg);\n            transform: rotate(3600deg); } }\n\n.luck {\n  background-image: url(" + __webpack_require__(6) + ");\n  background-size: cover; }\n  .luck .myAwardBtn {\n    width: 24.21875%;\n    position: absolute;\n    bottom: 20px;\n    right: 20px; }\n  .luck .luck-title {\n    width: 92.03125%;\n    margin-left: auto;\n    margin-right: auto;\n    margin-top: 10px; }\n  .luck .pan {\n    width: 90.625%;\n    margin-left: auto;\n    margin-right: auto;\n    position: relative; }\n    .luck .pan .zhizheng {\n      width: 18.75%;\n      position: absolute;\n      left: 50%;\n      top: 50%;\n      -webkit-transform: translate3d(-50%, -50%, 0px);\n              transform: translate3d(-50%, -50%, 0px);\n      z-index: 10; }\n    .luck .pan .light {\n      position: absolute;\n      left: 0px;\n      top: 0px; }\n  .luck .round-pan {\n    -webkit-transform-origin: 50% 50%;\n            transform-origin: 50% 50%; }\n\n.popup {\n  background-color: rgba(0, 0, 0, 0.5);\n  z-index: 100; }\n\n.write-message {\n  position: absolute;\n  z-index: 101;\n  width: 76.5625%;\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate3d(-50%, -50%, 0px);\n          transform: translate3d(-50%, -50%, 0px); }\n\n.write-item-manager {\n  width: 90%;\n  margin-left: auto;\n  margin-right: auto;\n  overflow: hidden; }\n  .write-item-manager > * {\n    margin-bottom: 7px; }\n\n.write-item {\n  background-color: #fff;\n  border-radius: 5px;\n  width: 100%;\n  overflow: hidden;\n  padding: 5px 5px 5px 5px; }\n  .write-item img {\n    display: block; }\n  .write-item > * {\n    float: left; }\n  .write-item > .write-item-icon > img {\n    width: 20px; }\n  .write-item > .write-item-input {\n    margin-left: 10px; }\n    .write-item > .write-item-input input {\n      border: 0px;\n      outline: 0px; }\n\n.write-form {\n  position: absolute;\n  left: 0px;\n  top: 110px;\n  width: 100%; }\n\n.write-message-submit-btn {\n  width: 90%;\n  margin-left: auto;\n  margin-top: 5px;\n  margin-right: auto; }\n\n.focus {\n  z-index: 101;\n  width: 90.15625%;\n  position: absolute;\n  left: 50%;\n  -webkit-transform: translate3d(-50%, 0px, 0px);\n          transform: translate3d(-50%, 0px, 0px); }\n  .focus > .focus-tips {\n    width: 100%;\n    text-align: center; }\n  .focus .close-btn {\n    position: absolute;\n    right: 35px;\n    top: 100px;\n    width: 30px; }\n\n.realAward {\n  position: absolute;\n  z-index: 101;\n  width: 93.90625%;\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate3d(-50%, -50%, 0px);\n          transform: translate3d(-50%, -50%, 0px); }\n  .realAward .star-manager {\n    position: absolute;\n    width: 90%;\n    left: 50%;\n    -webkit-transform: translate3d(-50%, -50px, 0px);\n            transform: translate3d(-50%, -50px, 0px); }\n    .realAward .star-manager > div:nth-child(1) {\n      position: absolute;\n      width: 40%;\n      left: 5%; }\n    .realAward .star-manager > div:nth-child(2) {\n      position: absolute;\n      width: 40%;\n      left: 30%;\n      top: -10px; }\n    .realAward .star-manager > div:nth-child(3) {\n      position: absolute;\n      width: 40%;\n      left: 55%; }\n  .realAward .realAwardBtn {\n    width: 62.5%;\n    position: absolute;\n    bottom: 10px;\n    left: 50%;\n    -webkit-transform: translate3d(-50%, 0px, 0px);\n            transform: translate3d(-50%, 0px, 0px); }\n  .realAward .realAwardImage {\n    position: absolute;\n    left: 50%;\n    -webkit-transform: translate3d(-50%, 120px, 0px);\n            transform: translate3d(-50%, 120px, 0px);\n    top: 0px; }\n\n.virAward {\n  position: absolute;\n  z-index: 101;\n  width: 93.90625%;\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate3d(-50%, -50%, 0px);\n          transform: translate3d(-50%, -50%, 0px); }\n  .virAward .vir-award-content {\n    width: 67.03125%;\n    position: absolute;\n    left: 50%;\n    -webkit-transform: translate3d(-50%, 100px, 0px);\n            transform: translate3d(-50%, 100px, 0px);\n    top: 0px; }\n  .virAward .star-manager {\n    position: absolute;\n    width: 90%;\n    left: 50%;\n    -webkit-transform: translate3d(-50%, -50px, 0px);\n            transform: translate3d(-50%, -50px, 0px);\n    top: 0px; }\n    .virAward .star-manager > div:nth-child(1) {\n      position: absolute;\n      width: 40%;\n      left: 5%; }\n    .virAward .star-manager > div:nth-child(2) {\n      position: absolute;\n      width: 40%;\n      left: 30%;\n      top: -10px; }\n    .virAward .star-manager > div:nth-child(3) {\n      position: absolute;\n      width: 40%;\n      left: 55%; }\n\n.myAward {\n  position: absolute;\n  z-index: 101;\n  left: 0px;\n  top: 0px; }\n  .myAward .myaward-top {\n    width: 90.3125%;\n    margin-left: auto;\n    margin-right: auto;\n    position: relative; }\n    .myAward .myaward-top img {\n      display: block; }\n    .myAward .myaward-top .close-btn-2 {\n      position: absolute;\n      z-index: 10;\n      right: 25px;\n      top: 45px;\n      width: 30px; }\n  .myAward .myaward-middle {\n    width: 73.28125%;\n    margin-left: auto;\n    margin-right: auto;\n    background-image: url(" + __webpack_require__(7) + ");\n    background-repeat: repeat-y;\n    overflow: hidden; }\n  .myAward .myaward-bottom {\n    width: 73.28125%;\n    margin-left: auto;\n    margin-right: auto;\n    position: relative; }\n    .myAward .myaward-bottom .next-btn {\n      top: 0px;\n      position: absolute;\n      width: 70%;\n      left: 50%;\n      -webkit-transform: translate3d(-50%, 5px, 0px);\n              transform: translate3d(-50%, 5px, 0px); }\n\n.my-award-item {\n  width: 90%;\n  margin-left: auto;\n  margin-right: auto;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  margin-bottom: 10px; }\n  .my-award-item > * {\n    float: left; }\n    .my-award-item > * > img {\n      display: block; }\n  .my-award-item > *:nth-child(1) {\n    width: 18%; }\n  .my-award-item > *:nth-child(2) {\n    width: 60%;\n    background-color: #fff;\n    border-top-left-radius: 5px;\n    border-bottom-left-radius: 5px;\n    margin-left: 5%; }\n  .my-award-item > *:nth-child(3) {\n    width: 20%;\n    background-color: #ffed85;\n    border-top-right-radius: 5px;\n    border-bottom-right-radius: 5px; }\n  .my-award-item .my-award-left {\n    position: relative; }\n    .my-award-item .my-award-left span {\n      position: absolute;\n      top: 0px;\n      left: 0px;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      width: 100%;\n      height: 100%;\n      -webkit-box-align: center;\n          -ms-flex-align: center;\n              align-items: center;\n      -webkit-box-pack: center;\n          -ms-flex-pack: center;\n              justify-content: center;\n      color: #ff7a00;\n      font-weight: bold;\n      font-size: 12px;\n      -webkit-transform: scale(0.8);\n              transform: scale(0.8); }\n  .my-award-item .my-award-middle {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: start;\n        -ms-flex-pack: start;\n            justify-content: flex-start;\n    text-indent: 20px;\n    color: #ff7a00;\n    font-size: 14px;\n    font-weight: bold; }\n  .my-award-item .my-award-right {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    color: #ff7a00;\n    font-size: 14px;\n    font-weight: bold; }\n\n@-webkit-keyframes circle {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); }\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@keyframes circle {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); }\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n.loading {\n  background-image: url(" + __webpack_require__(8) + ");\n  background-size: cover; }\n  .loading .loading-logo {\n    position: absolute;\n    width: 100%;\n    text-align: center;\n    bottom: 30px; }\n    .loading .loading-logo img {\n      width: 47.1875%; }\n  .loading .loading-text {\n    width: 33.28125%;\n    position: relative;\n    overflow: hidden;\n    left: 50%;\n    -webkit-transform: translate3d(-50%, 50px, 0px);\n            transform: translate3d(-50%, 50px, 0px);\n    margin-bottom: 60px; }\n    .loading .loading-text .loading-3 {\n      width: 100%; }\n    .loading .loading-text .loading-2 {\n      width: 90%;\n      position: absolute;\n      left: 5%;\n      top: 5%;\n      -webkit-animation: circle 2s infinite;\n              animation: circle 2s infinite;\n      -webkit-transform-origin: 50% 48%;\n              transform-origin: 50% 48%; }\n    .loading .loading-text .loading-1 {\n      width: 64%;\n      position: absolute;\n      left: 18%;\n      top: 11%; }\n    .loading .loading-text .loading-progress {\n      width: 100%;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      height: 100%;\n      position: absolute;\n      left: 0px;\n      top: 0px;\n      -webkit-box-align: center;\n          -ms-flex-align: center;\n              align-items: center;\n      -webkit-box-pack: center;\n          -ms-flex-pack: center;\n              justify-content: center;\n      color: #fff;\n      font-size: 26px; }\n      .loading .loading-text .loading-progress > span.tag {\n        font-size: 18px; }\n  .loading .loading-tops {\n    width: 100%;\n    text-align: center;\n    color: #fff;\n    font-size: 18px;\n    margin-top: 10px; }\n\n.cover {\n  z-index: 200;\n  background-color: transparent; }\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "image/bg.jpg";

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "image/bg2.jpg";

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAdUAAAAeCAYAAAB64YQ0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozYTdhZWUwOC1hMzA1LTQzOTItOTY4NC1hZjAzMzUzZGZjNGMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0UwQTBDNzkzMjM2MTFFNkFDNDZEMEFCREUwMjEzOTIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0UwQTBDNzgzMjM2MTFFNkFDNDZEMEFCREUwMjEzOTIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTUxNzFkNGQtM2NiZS00MDc0LTljMjktMjFlNjc2YTE2YTc3IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZDgwOWQxMWItNzBmYy0xMTc5LWEyZDYtZWZlMmE1M2RlZDU1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7Q/yzAAAAIZJREFUeNrs1TERACAQxMADpejADFpQ9oiAhpldCWnSamYkWQEAbuyuAQC8YaoAYKoAYKoAYKoAgKkCgKkCgKkCgKkCAKYKAKYKAKYKAJgqAJgqAJgqAJgqAGCqAGCqAGCqAGCqAICpAoCpAoCpAgCmCgCmCgCmCgCmCgCYKgCYKgD86QgwABqXA3UDirTmAAAAAElFTkSuQmCC"

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "image/bg-loading.jpg";

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	function home() {
		return "<div class=\"home\">\n\t\t\t\t<div class=\"index-top\">\n\t\t\t\t\t<div class=\"title\"><img src=\"image/title.png\"/></div>\n\t\t\t\t\t<div class=\"dai\">\n\t\t\t\t\t\t<div class='dai-bg'><img src=\"image/top.png\"/></div>\n\t\t\t\t\t\t<div class=\"a-dai\"><img src=\"image/a-dai.png\"/></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"index-bottom\">\n\t\t\t\t\t<div class=\"start-btn\"><a href='javascript:void(0)'><img src=\"image/btn-index.png\"/></a></div>\n\t\t\t\t\t<div class=\"index-logo\"><img src=\"image/logo-index.png\"/></div>\n\t\t\t\t\t<img src=\"image/index-bottom.png\" class='ib-bg'/>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"caidai\">\n\t\t\t\t\t<div class='dai-bg'><img src=\"image/caidai.png\"/></div>\n\t\t\t\t</div>\n\t\t\t</div>";
	}

	function luck() {

		return "\t <div class=\"luck\">\n\t\t\t<div class=\"luck-title\"><img src=\"image/title2.png\"/></div>\t\n\t\t\n\t\t\t<div class=\"pan\">\n\t\t\t\t<div class=\"round-pan\"><img src=\"image/pan.png\"/></div>\n\t\t\t\t<div class=\"zhizheng\"><img src=\"image/zhizheng.png\"/></div>\n\n\t\t\t\t<div class=\"light\">\n\t\t\t\t\t<img src=\"image/light1.png\"/>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"myAwardBtn\"><a href='javascript:void(0)'><img src=\"image/myAwardBtn.png\"/></a></div>\n\t\t</div>";
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