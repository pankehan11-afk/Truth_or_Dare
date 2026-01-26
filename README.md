如何运行和部署
方式1：本地开发运行（当前状态）
```
cd d:\Desktop\truth_or_dare
npm run dev
# 访问 http://localhost:5173
```

方式2：打包为静态文件
```bash
npm run build
# 生成的 dist 文件夹即为可部署的静态文件
```

方式3：部署到免费托管平台
Netlify：
运行``` npm run build```
将 dist 文件夹拖拽到 netlify.com
即刻获得部署链接
