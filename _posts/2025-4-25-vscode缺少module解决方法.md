问题定位：
```shell
PS C:\Users\god> python -u "c:\Users\god\Desktop\gold.py"
Traceback (most recent call last):
  File "c:\Users\god\Desktop\gold.py", line 1, in <module>
    import requests
ModuleNotFoundError: No module named 'requests'
```

明明已经在conda中安装了 `requests`，却依旧报错找不到，下面给出解决方案：



1. 使用 “Python: 清除工作区解释器设置” 命令以清除当前设置的解释器上下文。
   * 步骤：1. 按 `Ctrl+Shift+P` 打开命令面板；2. 输入“Python: 清除工作区解释器设置”；3. 回车执行命令。

2. 使用 “开发人员: 重新加载窗口” 命令重启 VS Code，从而刷新解释器上下文。
   * 步骤：1. 按 `Ctrl+Shift+P` 打开命令面板；2. 输入“开发人员: 重新加载窗口”；3. 回车执行命令。

3. 使用 “Python: 选择解释器” 命令重新选择正确的 Python 解释器。
   * 步骤：1. 按 `Ctrl+Shift+P` 打开命令面板；2. 输入“Python: 选择解释器”；3. 回车执行命令。

