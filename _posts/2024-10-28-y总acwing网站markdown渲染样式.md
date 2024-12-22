#### 找到正在使用的主题CSS文件（例如 gitHub.css),下面是我从acwing网站上源代码分析爬取下来的关于*单行*代码渲染的css样式，直接在刚刚找到的css文件的底部，添加下面的样式即可：



```shell
/* 自定义 code 标签的样式 */
code {
    background-color: #f8f8f8;
    color: #c7254e; /* 设为红色 */
    padding: 0 5px;
    border: 1px solid #eaeaea;
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    border-radius: 3px;
    white-space: nowrap;
}
```

#### 下面是我从csdn爬下来的，感觉更紧凑一点，和y总的区别也不算大

```shell
/* 自定义 code 标签的样式 */
code {
    background-color: #F9F2F4; /* 背景颜色 */
    color: #C7254E; /* 字体颜色 */
    padding: 2px 4px; /* 内边距，符合图片的 2px 4px */
    font-size: 10px; /* 字体大小 */
    font-family: "Source Code Pro", "comic code", "DejaVu Sans Mono", Menlo, Monaco, Consolas, "Courier New", monospace; /* 字体设置 */
    border-radius: 3px; /* 边框圆角 */
    white-space: nowrap; /* 防止换行 */
    border: none; /* 去除边框 */
}

```

