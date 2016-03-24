/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

//----------event绑定
var addEvent = function(obj$,eventType$,fn$){
    var args = Array.prototype.slice.call(arguments, 3);
    var cfn = function(eventObj$){
        fn$.apply(obj$,[eventObj$].concat(args));
    };
    if(obj$.addEventListener){
        obj$.addEventListener(eventType$,cfn,false);
    }else if(obj$.attachEvent){
        obj$.attachEvent('on'+eventType$,cfn);
    }else{
        obj$['on'+eventType$] = cfn;
    }
};


//function addEvent(obj$, event$, fn$) {
//    (obj$.attachEvent) ?//ie
//        obj$.attachEvent('on' + event$, function () {
//            fn$.call(obj$);
//        }) :
//        obj$.addEventListener(event$, fn$, 0);
//}

function logError(err$){
    console.log(err$);
    return undefined;
}

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var cityInput = document.querySelector('input#aqi-city-input');
    var AQIInput = document.querySelector('input#aqi-value-input');
    if (!cityInput || !AQIInput) {
        return logError('组件错误');
    }

    var cityStr = cityInput.value.trim();
    //只接受英语跟东亚字符
    var cityRegex = /[A-Z,a-z，\u2E80-\u9FFF]+/;
    if (!cityRegex.test(cityStr) || cityRegex.exec(cityStr)[0] != cityStr) {
        alert('城市名无效');
        return undefined;
    }
    //判断下城市是否存在
    if(aqiData[cityStr]){
        alert('城市已存在！');
        return undefined;
    }

    var AQIStr = AQIInput.value.trim();
    //只接受数字
    var numberRegex = /\d+/;
    if (!numberRegex.test(AQIStr) || numberRegex.exec(AQIStr)[0] != AQIStr) {
        alert('AQI数值无效');
        return undefined;
    }
    aqiData[cityStr] = parseInt(AQIStr);
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var AQITable = document.querySelector('table#aqi-table');
    if(!AQITable){
        return logError('组件错误');
    }
    AQITable.innerHTML='';
    for( var cityName$ in aqiData){
        var tableRow = document.createElement('tr');

        var cityBox = document.createElement('td');
        cityBox.innerHTML = cityName$;
        tableRow.appendChild(cityBox);

        var AQIBox = document.createElement('td');
        AQIBox.innerHTML = aqiData[cityName$];
        tableRow.appendChild(AQIBox);

        var btnBox = document.createElement('td');
        var deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '删除';
        addEvent(deleteBtn,'click',delBtnHandle,cityName$);
        btnBox.appendChild(deleteBtn);
        tableRow.appendChild(btnBox);

        AQITable.appendChild(tableRow);
    }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(event$,cityName$) {
    if(!aqiData.hasOwnProperty(cityName$)){
        alert('数据错误！');
        return undefined;
    }
    delete( aqiData[cityName$] );
    renderAqiList();
}

function init() {
    var inputButton = document.querySelector('button#add-btn');
    if (!inputButton) {
        return logError('组件错误');
    }
    addEvent(inputButton, 'click', addBtnHandle);
}

window.onload = function () {
    init();
};
