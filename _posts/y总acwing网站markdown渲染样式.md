#### 找到正在使用的主题CSS文件（例如 gitHub.css),下面是我从acwing网站上源代码分析爬取下来的关于*单行*代码渲染的css样式，直接在刚刚找到的css文件的底部，添加下面的样式即可：



```py
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

