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


var printArgs = function () {
    console.log(arguments);
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
    var queueLength = 60;
    var msgList = document.querySelector('div#msgList');
    var numInput = document.querySelector('input[name=num]');
    var leftInBtn = document.querySelector('button#leftIn');
    var rightInBtn = document.querySelector('button#rightIn');
    var leftOutBtn = document.querySelector('button#leftOut');
    var rightOutBtn = document.querySelector('button#rightOut');
    var randomNumBtn = document.querySelector('button#randomNum');
    var sortNumBtn = document.querySelector('button#sortNum');

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
        msgInsert(numBox_.dataNum, msgList);
        numBox_.parentNode.removeChild(numBox_);
        return null;
    };

    var numBoxInsert = function (num_, insertPos_, direction_) {
        var numBoxList = insertPos_.querySelectorAll('div');
        if (numBoxList.length >= queueLength) {
            msgInsert('最多' + queueLength + '个数字！', msgList);
            return null;
        }
        var numBox = document.createElement('div');
        numBox.className = 'numBox';
        numBox.style.height = num_ * 5 + 'px';
        numBox.dataNum = num_;
        //numBox.innerHTML = num_;
        addEvent(numBox, 'click', function () {
            numBoxRemove(this);
        });
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
        var numCount = 10;
        var numBoxList = insertPos_.querySelectorAll('div');
        if (numBoxList.length >= queueLength) {
            msgInsert('最多' + queueLength + '个数字！', msgList);
            return null;
        }
        var insertCount = queueLength - numBoxList.length < numCount ? queueLength - numBoxList.length : numCount;
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
        var numberErrRegex = /[^0-9]/;
        if (!numStr || numberErrRegex.test(numStr)) {
            msgInsert('请输入数字', msgList);
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
        numBoxRemove(numBox);
        return null;
    };

    var selectSortShow = function (event_, numQueue_) {
        var numList = numQueue_.querySelectorAll('div');
        if (numList.length < 2) {
            msgInsert('不用排序了吧', msgList);
            return null;
        }
        var loopI;
        for( loopI in numList){
            console.log( loopI);
        }
        var nodeA = numList[0];
        var nodeB = numList[1];
        var swapNode = document.createElement('div');
        var tempNode;
        var startTime = new Date();
        var loopCount = 0;
        var keepNode = nodeA;
        nodeA.style.backgroundColor = "#00F";
        (function selectSortAction() {
            loopCount++;
            nodeB.style.backgroundColor = '';
            if (keepNode.dataNum > nodeB.dataNum) {
                if (!(nodeA === keepNode)) {
                    keepNode.style.background = '';
                }
                keepNode = nodeB;
                keepNode.style.background = '#00F';
            }

            //循环到头
            if (nodeB.nextSibling) {
                nodeB = nodeB.nextSibling;
            } else {
                nodeA.style.backgroundColor = '';
                keepNode.style.backgroundColor = '';

                if (!(nodeA === keepNode)) {
                    //根据需要交换DOM
                    numQueue_.replaceChild(swapNode, nodeA);
                    numQueue_.replaceChild(nodeA, keepNode);
                    numQueue_.replaceChild(keepNode, swapNode);
                    nodeA = keepNode;
                }
                nodeA.style.backgroundColor = '#700';
                //换个颜色表示下
                nodeA = nodeA.nextSibling;
                //开始下一个
                if (!nodeA.nextSibling) {
                    //没下一个就结束
                    nodeA.style.backgroundColor = '#700';
                    msgInsert('Done! Total ' + loopCount + ' steps,' + (new Date() - startTime) + ' ms.', msgList);
                    return null;
                }
                nodeB = nodeA.nextSibling;
                keepNode = nodeA;
                nodeA.style.backgroundColor = "#00F";
            }
            nodeB.style.backgroundColor = '#0F0';
            //添个颜色表示下
            setTimeout(selectSortAction, 50);
            //延时执行下个循环
        })();
    };


    addEvent(rightInBtn, 'click', insertBtnEvent, numInput, numQueue, 'right');
    addEvent(leftInBtn, 'click', insertBtnEvent, numInput, numQueue, 'left');
    addEvent(randomNumBtn, 'click', randomNumBtnEvent, numQueue);
    addEvent(rightOutBtn, 'click', numPop, numQueue, 'right');
    addEvent(leftOutBtn, 'click', numPop, numQueue, 'left');
    addEvent(sortNumBtn, 'click', selectSortShow, numQueue);
}


window.onload = init;