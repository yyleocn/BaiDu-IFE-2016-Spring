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

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function init() {
    var boxQueue = document.querySelector('div#boxQueue');
    var textInput = document.querySelector('textArea[name=textInput]');
    var leftInBtn = document.querySelector('button#leftIn');
    var rightInBtn = document.querySelector('button#rightIn');
    var leftOutBtn = document.querySelector('button#leftOut');
    var rightOutBtn = document.querySelector('button#rightOut');
    var queryInput = document.querySelector('input[name=queryInput]');
    var queryBtn = document.querySelector('button#query');
    if (!boxQueue || !textInput || !leftInBtn || !rightInBtn || !leftOutBtn || !rightOutBtn) {
        console.log('初始化失败……');
        return undefined;
    }
    var boxRemove = function (boxDom_) {
        if (!boxDom_) {
            console.log('对象错误');
            return undefined;
        }
        alert(boxDom_.innerText);
        boxDom_.parentNode.removeChild(boxDom_);
        return undefined;
    };

    var boxInsert = function (event_, inputStr_, direction_, insertPos_) {
        if (!inputStr_ || !insertPos_) {
            console.log('对象错误');
            return undefined;
        }

        var charRegex = /[A-Za-z0-9,\u2E80-\u9FFF]+/g;
        var inputArray = inputStr_.value.match(charRegex);
        if (!inputArray.length) {
            alert('请输入有效字符');
            return undefined;
        }

        for (var loopI = 0; loopI < inputArray.length; loopI++) {
            var charBox = document.createElement('div');
            charBox.className = 'charBox';
            addEvent(charBox, 'click', function () {
                boxRemove(this);
            });
            if (direction_ === 'right') {
                charBox.innerHTML = inputArray[loopI];
                insertPos_.appendChild(charBox);
            } else {
                charBox.innerHTML = inputArray[inputArray.length - 1 - loopI];
                var boxNodeFirst = insertPos_.querySelector('div.charBox');
                if (!boxNodeFirst) {
                    insertPos_.appendChild(charBox);
                } else {
                    insertPos_.insertBefore(charBox, boxNodeFirst);
                }
            }
        }
        return undefined;
    };

    var boxPop = function (event_, direction_, numQueue_) {
        if (!numQueue_) {
            console.log('对象错误');
            return undefined;
        }
        var numBoxList = numQueue_.querySelectorAll('div.numBox');
        var numBox = null;
        if (!numBoxList.length) {
            alert('队列中无数字');
            return undefined;
        }
        if (direction_ === 'left') {
            numBox = numBoxList[0];
        } else if (direction_ === 'right') {
            numBox = numBoxList[numBoxList.length - 1];
        } else {
            alert('数据错误');
            return undefined;
        }
        boxRemove(numBox);
        return undefined;
    };

    var queryHighLight = function (event_, queryInput_, searchPos_) {
        if (!queryInput_ || !searchPos_) {
            console.log('对象错误');
            return null;
        }
        var queryString = queryInput_.value.trim();
        if(!queryString.length){
            alert('输入为空……');
            return null;
        }
        var loopCount = searchPos_.children.length;
        for (var loopI = 0; loopI < loopCount; loopI++) {
            var tempText = searchPos_.children[loopI].innerHTML.replace(/<[^>].*?>/g, "");
            searchPos_.children[loopI].innerHTML =
                tempText.replaceAll(
                    queryString,
                    '<span class="highLight">' + queryString + '</span>'
                );
        }
    };

    addEvent(rightInBtn, 'click', boxInsert, textInput, 'right', boxQueue);
    addEvent(rightOutBtn, 'click', boxPop, 'right', boxQueue);
    addEvent(leftInBtn, 'click', boxInsert, textInput, 'left', boxQueue);
    addEvent(leftOutBtn, 'click', boxPop, 'left', boxQueue);
    addEvent(queryBtn, 'click', queryHighLight, queryInput, boxQueue);
}


window.onload = init;