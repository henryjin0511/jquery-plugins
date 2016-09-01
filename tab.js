'use strict';
/**
 * tab切换
 * 依赖 jquery
 * introduce:tab切换插件 支持自动运行，且鼠标移入响应容器后会自动停止 跳出重新运行
 * author:JM
 * Released on: August 31, 2016
 * @param {Object} [config.root= document ] - 事件触发节点的根节点 必须为jQuery对象
 * @param {String} [config.curClass = 'active'] - 触发节点变化class 默认为active
 * @param {Object,String} config.oTriggers - 事件触发节点 可以为jQuery对象或者节点的class
 * @param {Object,String} config.oTargets - 事件相应节点 可以为jQuery对象或者节点的class
 * @param {String} [config.fnTrigger = 'click'] 事件触发函数 默认为click
 * @param {Function} config.handler 回调处理函数，返回 节点次序 触发节点 响应节点 三个参数
 * @param {Boolean} [config.isReset = true] 是否初始化整个状态
 * @param {String} [config.curIndex = 0] 当isReset为true 此处应填写第一个展示的对象，注意 次序从0开始
 * @param {Boolean} [config.autoPlay = false] 是否自动切换 默认为否
 * @param {Boolean} [config.overPause = true] 鼠标移入容器是否停止自动切换 默认为是
 * @param {playTime} [config.playTime = 3000] 当config.autoPlay = true 此处为自动运行间隔时间
 */
function Tab(config){
    this.root = config.root || $(document);
    this.curClass = config.curClass || 'active';
    this.oTriggers = typeof config.oTriggers == 'string'?$('.'+config.oTriggers,this.root):config.oTriggers;
    this.oTargets = typeof config.oTargets == 'string'?$('.'+config.oTargets,this.root):config.oTargets;
    this.handler = config.handler;
    this.curIndex = typeof config.curIndex == 'undefined'?0:config.curIndex;
    this.timer = null;
    var fnTrigger = config.fnTrigger || 'click';
    var autoPlay = typeof config.autoPlay == 'undefined'? false:config.autoPlay;
    var overPause = typeof config.overPause == 'undefined'? true:config.overPause;
    var playTime = config.playTime || 3000;
    var isReset = typeof config.isReset == 'undefined' ? true:config.isReset;
    var _this = this;
    if(isReset){
        this.showItem(this.curIndex,this.oTriggers[this.curIndex],this.oTargets[this.curIndex]);
    }
    if(autoPlay){
        this.timer = setInterval(function(){_this.autoHandler();},playTime)
    }
    this.oTriggers.each(function(index){
        $(this).on(fnTrigger,function(){
            _this.showItem(index);
            _this.curIndex = index;
        });
        if(autoPlay && overPause){
            _this.oTargets.eq(index).on('mouseover mouseout',function (e) {
                if(e.type == 'mouseover'){
                    clearInterval(_this.timer);
                }else if(e.type == 'mouseout'){
                    _this.timer = setInterval(function(){_this.autoHandler();},playTime)
                }
            })
        }
    });
}
Tab.prototype = {
    constructor:Tab,
    showItem:function (n) {
        this.oTriggers.removeClass(this.curClass);
        this.oTriggers.eq(n).addClass(this.curClass);
        this.oTargets.hide();
        this.oTargets.eq(n).show();
        if(this.handler){
            this.handler(n,this.oTriggers.eq(n),this.oTargets.eq(n));
        }
    },
    autoHandler:function () {
        this.curIndex ++;
        if(this.curIndex >= this.oTriggers.length){
            this.curIndex = 0;
        }
        this.showItem(this.curIndex);
    }
};