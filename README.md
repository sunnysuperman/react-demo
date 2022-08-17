# 编译启动

```
需要Node16+，全局安装n模块，sudo n 16.16.0 切换版本；
npm install && npm start
如果发生编译出错，一般情况下是由于Node版本或者网络问题，保证网络正常后，清除缓存重试
```

# 工程化-代码格式化+代码检查+提交 commit 检查

```
husky作为git hook工具
1)pre-commit: 提交代码前执行lint-staged，lint-staged对暂存区内容进行处理，包括prettier和eslint
2)commit-msg: 检查commit内容，规范详见 https://www.conventionalcommits.org/zh-hans/v1.0.0/
```

# 工程化-打包

```
1.主要可配置参数:
  serverEnv: 服务器环境
  analysis: 分析包大小
  cdn: CDN模式打包
  console: 是否加载控制台插件(移动端项目调试利器)

2.分包加载splitChunks
```

# tsconfig.json

```
指定了编译项目所需的根目录下的文件以及编译选项。
paths指定别名。
```

# 代码结构

```
--src
  --config
  --css
  --assets
  --common
   --commonA
     --css
     --img
     --Component.jsx
  --comp
    --compA
      --css
      --img
      --Component.jsx
```
