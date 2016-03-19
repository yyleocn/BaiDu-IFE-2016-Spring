### Task103要求实现中间栏自适应的三栏式布局，可以通过float+margin快速实现，具体过程如下：
#### 首先搭建三栏式框架，这里要用div.content包裹以方便整体调整，注意中间栏代码需要放到左右两栏的后面
```
<div class="content">
    <div id="leftColumn">
        <p>这是左栏</p>
    </div>
    <div id="rightColumn">
        <p>这是右栏</p>
    </div>
    <div id="centerColumn">
        <p>这是中栏</p>
    </div>
</div>
```
#### 设置左右栏的CSS样式，这里可以设置margin
```
#leftColumn {
    width: 200px;
    float: left;
    margin: 20px;
}
#rightColumn {
    width: 120px;
    float: right;
    margin: 20px;
}
```
#### 设置中间栏的CSS样式，注意左右侧margin的计算方法：

左侧margin = 左栏左侧margin + 左栏width + 左栏右侧margin

示例为 20px + 200px + 20px = 240px

注意中间栏不要设置float属性
```
#centerColumn {
    margin: 20px 160px 0 240px;
}
```
#### 对于div.content需要设置overflow来解决margin-top的Bug
```
.content{
    overflow: hidden;
}
```
### 至此中间栏自适应布局已经实现，实例链接：[传送门](https://rawgit.com/yyleocn/BaiDu-IFE-2016-Spring/master/YangLe/1-03/centerColAutoWidth.html)