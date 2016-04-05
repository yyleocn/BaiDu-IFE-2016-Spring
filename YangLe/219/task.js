"use strict";
var addEvent = function (obj_, eventType_, func_) {
    var args = Array.prototype.slice.call(arguments, 3);
    var cfn = function (eventObj_) {
        func_.apply(obj_, [eventObj_].concat(args));
    };
    if (obj_.addEventListener) {
        obj_.addEventListener(eventType_, cfn, false);
    } else if (obj_.attachEvent) {
        obj_.attachEvent('on' + eventType_, cfn);
    } else {
        obj_['on' + eventType_] = cfn;
    }
};

var dateBase = new Date();

var printArgs = function () {
    console.log(arguments);
    console.log(new Date() - dateBase);
};

var setTimeoutLoop = function (start_, end_, delay_, func_) {
    var args = Array.prototype.slice.call(arguments, 4);
    var cfn = function (args_) {
        func_.apply(null, [args_].concat(args));
    };
    var loopI = start_;
    (function factorial() {
        if (loopI >= end_) {
            return null;
        }
        cfn(loopI);
        loopI++;
        window.setTimeout(factorial, delay_);
    })();
};


function init() {
    var numQueue = document.querySelector('div#numQueue');
    var msgList = document.querySelector('div#msgList');
    var numInput = document.querySelector('input[name=num]');
    var leftInBtn = document.querySelector('button#leftIn');
    var rightInBtn = document.querySelector('button#rightIn');
    var leftOutBtn = document.querySelector('button#leftOut');
    var rightOutBtn = document.querySelector('button#rightOut');
    var randomNumBtn = document.querySelector('button#randomNum');

    if (!numQueue || !numInput || !leftInBtn || !rightInBtn || !leftOutBtn || !rightOutBtn) {
        console.log('初始化失败……');
        return null;
    }

    var msgInsert = function (msg_, insertPos_) {
        if (!insertPos_) {
            console.log('对象错误');
            return null;
        }
        var msgBox = document.createElement('div');
        msgBox.innerHTML = msg_;
        addEvent(
            msgBox,
            'click',
            function () {
                console.log(this.innerHTML);
                this.parentNode.removeChild(this);
            }
        );
        insertPos_.appendChild(msgBox);
    };

    var numBoxRemove = function (numBox_) {
        if (!numBox_) {
            console.log('对象错误');
            return null;
        }
        msgInsert(numBox_.innerText, msgList);
        numBox_.parentNode.removeChild(numBox_);
        return null;
    };

    var numBoxInsert = function (num_, insertPos_, direction_) {
        var numBoxList = insertPos_.querySelectorAll('div');
        if (numBoxList.length >= 60) {
            msgInsert('最多60个数字！', msgList);
            return null;
        }
        var numBox = document.createElement('div');
        numBox.className = 'numBox';
        numBox.style.height = num_ + '%';
        numBox.dataNum = num_;
        //numBox.innerHTML = num_;
        addEvent(numBox, 'click', function () {
            numBoxRemove(this);
        });
        console.log([numBox]);
        if (direction_ === 'right') {
            insertPos_.appendChild(numBox);
            return null;
        } else {
            var numBoxFirst = insertPos_.querySelector('div.numBox');
            if (!numBoxFirst) {
                insertPos_.appendChild(numBox);
                return null;
            }
            insertPos_.insertBefore(numBox, numBoxFirst);
        }
        return null;
    };

    var randomNumBtnEvent = function (event_, insertPos_) {
        var numBoxList = insertPos_.querySelectorAll('div');
        if (numBoxList.length >= 60) {
            msgInsert('最多60个数字！', msgList);
            return null;
        }
        var insertCount = 60 - numBoxList.length < 20 ? 60 - numBoxList.length : 20;
        for (var loopI = 0; loopI < insertCount; loopI++) {
            var num = parseInt(Math.random() * 90 + 10);
            numBoxInsert(num, insertPos_);
        }
        return null;
    };

    var insertBtnEvent = function (event_, numInput_, insertPos_, direction_) {
        if (!numInput_ || !insertPos_) {
            console.log('对象错误');
            return null;
        }

        var numStr = numInput_.value.trim();
        var numberRegex = /\d+/;
        if (!numberRegex.test(numStr) || numberRegex.exec(numStr)[0] !== numStr) {
            msgInsert('不要输入其他字符', msgList);
            return null;
        }

        var num = parseInt(numStr);
        if (num < 10 || num > 100) {
            msgInsert('请输入10-100之间的数字', msgList);
            return null;
        }
        numBoxInsert(
            num, insertPos_, direction_
        )
    };

    var numPop = function (event_, numQueue_, direction_) {
        if (!numQueue_) {
            console.log('对象错误');
            return null;
        }
        var numBoxList = numQueue_.querySelectorAll('div.numBox');
        var numBox = null;
        if (!numBoxList.length) {
            msgInsert('队列中无数字', msgList);
            return null;
        }
        if (direction_ === 'left') {
            numBox = numBoxList[0];
        } else if (direction_ === 'right') {
            numBox = numBoxList[numBoxList.length - 1];
        } else {
            msgInsert('数据错误', msgList);
            return null;
        }
        msgInsert(numBox.dataNum, msgList);
        numBoxRemove(numBox);
        return null;
    };

    var bubbleSortCompare = function(){

    };

    var bubbleSortFlash = function(numQueue_){
        var numList = numQueue_.querySelectorAll('div');
        if(numList.length<2){
            return null;
        }
    };


    addEvent(rightInBtn, 'click', insertBtnEvent, numInput, numQueue, 'right');
    addEvent(leftInBtn, 'click', insertBtnEvent, numInput, numQueue, 'left');
    addEvent(randomNumBtn, 'click', randomNumBtnEvent, numQueue);
    addEvent(rightOutBtn, 'click', numPop, numQueue, 'right');
    addEvent(leftOutBtn, 'click', numPop, numQueue, 'left');
}


window.onload = init;