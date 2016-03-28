var addEvent = function (obj$, eventType$, fn$) {
    var args = Array.prototype.slice.call(arguments, 3);
    var cfn = function (eventObj$) {
        fn$.apply(obj$, [eventObj$].concat(args));
    };
    if (obj$.addEventListener) {
        obj$.addEventListener(eventType$, cfn, false);
    } else if (obj$.attachEvent) {
        obj$.attachEvent('on' + eventType$, cfn);
    } else {
        obj$['on' + eventType$] = cfn;
    }
};
function init() {
    var numQueue = document.querySelector('div#numQueue');
    var numInput = document.querySelector('input[name=num]');
    var leftInBtn = document.querySelector('button#leftIn');
    var rightInBtn = document.querySelector('button#rightIn');
    var leftOutBtn = document.querySelector('button#leftOut');
    var rightOutBtn = document.querySelector('button#rightOut');
    if (!numQueue || !numInput || !leftInBtn || !rightInBtn || !leftOutBtn || !rightOutBtn) {
        console.log('初始化失败……');
        return undefined;
    }
    function numBoxRemove(numBox$){
        if(!numBox$){
            console.log('对象错误');
            return undefined;
        }
        alert(numBox$.innerText);
        numBox$.parentNode.removeChild(numBox$);
        return undefined;
    }

    function numInert(event$, numInput$, direction$, insertPos$) {
        if (!numInput$ || !insertPos$) {
            console.log('对象错误');
            return undefined;
        }

        var numStr = numInput$.value.trim();
        var numberRegex = /\d+/;
        if (!numberRegex.test(numStr) || numberRegex.exec(numStr)[0] !== numStr) {
            alert('不要输入其他字符');
            return undefined;
        }
        
        var num = parseInt(numStr);
        var numBox = document.createElement('div');
        numBox.className = 'numBox';
        numBox.innerHTML = num;
        addEvent(numBox,'click',function(){
            numBoxRemove(this);
        });
        if (direction$ === 'right') {
            insertPos$.appendChild(numBox);
            return undefined;
        }
        if (direction$ === 'left') {
            var numBoxFirst = insertPos$.querySelector('div.numBox');
            if (!numBoxFirst) {
                insertPos$.appendChild(numBox);
                return undefined;
            }
            insertPos$.insertBefore(numBox, numBoxFirst);
        }
        return undefined;
    }

    function numPop(event$, direction$, numQueue$) {
        if (!numQueue$) {
            console.log('对象错误');
            return undefined;
        }
        var numBoxList = numQueue$.querySelectorAll('div.numBox');
        var numBox = null;
        if (!numBoxList.length) {
            alert('队列中无数字');
            return undefined;
        }
        if (direction$ === 'left') {
            numBox = numBoxList[0];
        } else if (direction$ === 'right') {
            numBox = numBoxList[numBoxList.length - 1];
        } else {
            alert('数据错误');
            return undefined;
        }
        numBoxRemove(numBox);
        return undefined;
    }

    addEvent(rightInBtn, 'click', numInert, numInput, 'right', numQueue);
    addEvent(rightOutBtn, 'click', numPop, 'right', numQueue);
    addEvent(leftInBtn, 'click', numInert, numInput, 'left', numQueue);
    addEvent(leftOutBtn, 'click', numPop, 'left', numQueue);
}


window.onload = init;