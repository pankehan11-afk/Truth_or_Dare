# 🎭 真心话大冒险 (Truth or Dare)

一款基于 React 构建的现代化真心话大冒险派对游戏，支持多人同屏互动，拥有精美的 UI 动画和丰富的游戏机制。

## ✨ 功能特性

### 🎮 核心玩法
- **转盘选人** - 动态转盘动画随机选择玩家
- **真心话 / 大冒险** - 双模式挑战，支持自动随机选择
- **积分系统** - 完成挑战获得积分，失败或跳过扣分
- **实时排行榜** - 每轮结束显示玩家排名

### 🃏 道具系统
累计 10 分可抽取道具卡，4 种独特道具：
| 道具 | 名称 | 效果 |
|------|------|------|
| 🔄 | 反转卡 | 指定他人回答这个问题 |
| 🛡️ | 保护卡 | 跳过一轮挑战 |
| 😈 | 捣乱卡 | 指定他人完成额外任务 |
| 🍀 | 幸运卡 | 跳过一轮真心话 |

### 🎨 视觉体验
- 流畅的 Framer Motion 动画
- 3D 卡片翻转效果
- 深色宇宙主题抽卡界面
- 响应式设计，适配各种屏幕

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.x | UI 框架 |
| Vite | 4.x | 构建工具 |
| Tailwind CSS | 3.x | 样式框架 |
| Framer Motion | 12.x | 动画库 |

## 📁 项目结构

```
src/
├── components/
│   ├── GameSetup/          # 游戏设置组件
│   │   ├── WelcomePage.jsx     # 欢迎页
│   │   ├── PlayerSetup.jsx     # 玩家设置
│   │   ├── GameConfig.jsx      # 游戏配置
│   │   └── PlayerConfirm.jsx   # 玩家确认
│   ├── GamePlay/           # 游戏进行组件
│   │   ├── PlayerWheel.jsx     # 转盘选人
│   │   ├── ChallengeSelect.jsx # 挑战选择
│   │   ├── ChallengeDisplay.jsx# 挑战显示
│   │   └── PropDraw.jsx        # 道具抽取
│   └── Results/            # 结果组件
│       └── GameSummary.jsx     # 游戏总结
├── context/
│   └── GameContext.jsx     # 全局状态管理
├── data/
│   ├── truthQuestions.js   # 真心话题库
│   └── dareQuestions.js    # 大冒险题库
├── App.jsx                 # 应用入口
└── main.jsx                # 渲染入口
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0
- npm >= 7.0

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
# 访问 http://localhost:5173
```

### 生产构建
```bash
npm run build
# 输出目录: dist/
```

### 预览构建
```bash
npm run preview
```

## 📦 部署

### Netlify（推荐）
1. 运行 `npm run build`
2. 将 `dist` 文件夹拖拽到 [https://app.netlify.com/drop](https://netlify.com)
3. 即刻获得部署链接

### Vercel
1. 连接 GitHub 仓库
2. 自动识别 Vite 项目并部署

### 静态服务器
将 `dist` 目录部署到任意静态文件服务器即可。

## 🎯 游戏规则

### 计分规则
| 操作 | 积分变化 |
|------|----------|
| 完成真心话 | +2 分 |
| 完成大冒险 | +3 分 |
| 获得"有趣"评价 | +1 分 |
| 使用跳过卡 | -2 分（需≥5分） |
| 大冒险失败 | -4 分 |
| 抽取道具卡 | -10 分 |

### 游戏流程
1. **添加玩家** - 4-10 人参与
2. **配置游戏** - 设置时长、轮数、主题
3. **开始游戏** - 转盘随机选人
4. **完成挑战** - 真心话或大冒险
5. **结算积分** - 其他玩家投票评价
6. **游戏结束** - 查看最终排名


