var addEvent = function (obj_, eventType_, fn_) {
    var args = Array.prototype.slice.call(arguments, 3);
    var cfn = function (eventObj_) {
        fn_.apply(obj_, [eventObj_].concat(args));
    };
    if (obj_.addEventListener) {
        obj_.addEventListener(eventType_, cfn, false);
    } else if (obj_.attachEvent) {
        obj_.attachEvent('on' + eventType_, cfn);
    } else {
        obj_['on' + eventType_] = cfn;
    }
};

var setTimeoutLoop = function(  ){

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

    function numBoxRemove(numBox_) {
        if (!numBox_) {
            console.log('对象错误');
            return null;
        }
        alert(numBox_.innerText);
        numBox_.parentNode.removeChild(numBox_);
        return null;
    }

    function numBoxInsert(num_, insertPos_, direction_) {
        var numBoxList= insertPos_.querySelectorAll('div');
        if(numBoxList.length>=60){
            alert('最多60个数字！');
            return null;
        }
        var numBox = document.createElement('div');
        numBox.className = 'numBox';
        numBox.innerHTML = num_;
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
    }

    function randomNumBtnEvent(event_, insertPos_) {
        for(var loopI=0; loopI<20; loopI++){
            var num = parseInt(Math.random()*90+10);
            numBoxInsert(num,insertPos_);
        }
        return null;
    }

    function insertBtnEvent(event_, numInput_, insertPos_, direction_) {
        if (!numInput_ || !insertPos_) {
            console.log('对象错误');
            return null;
        }

        var numStr = numInput_.value.trim();
        var numberRegex = /\d+/;
        if (!numberRegex.test(numStr) || numberRegex.exec(numStr)[0] !== numStr) {
            alert('不要输入其他字符');
            return null;
        }

        var num = parseInt(numStr);
        if (num < 10 || num > 100) {
            alert('请输入10-100之间的数字');
            return null;
        }
        numBoxInsert(
            num, insertPos_, direction_
        )
    }

    function numPop(event_, direction_, numQueue_) {
        if (!numQueue_) {
            console.log('对象错误');
            return null;
        }
        var numBoxList = numQueue_.querySelectorAll('div.numBox');
        var numBox = null;
        if (!numBoxList.length) {
            alert('队列中无数字');
            return null;
        }
        if (direction_ === 'left') {
            numBox = numBoxList[0];
        } else if (direction_ === 'right') {
            numBox = numBoxList[numBoxList.length - 1];
        } else {
            alert('数据错误');
            return null;
        }
        numBoxRemove(numBox);
        return null;
    }

    addEvent(rightInBtn, 'click', insertBtnEvent, numInput, numQueue, 'right');
    addEvent(leftInBtn, 'click', insertBtnEvent, numInput, numQueue, 'left');
    addEvent(randomNumBtn, 'click', randomNumBtnEvent, numQueue);
    addEvent(rightOutBtn, 'click', numPop, numQueue, 'right');
    addEvent(leftOutBtn, 'click', numPop, numQueue, 'left');
}


window.onload = init;