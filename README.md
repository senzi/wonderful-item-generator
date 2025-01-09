# 奇妙物品生成器 | Wonderful Item Generator

一个基于 AI 的奇妙物品生成器，可以根据描述生成各种风格的奇妙物品。

## 在线体验

🌐 [Live Demo](https://forge.closeai.moe)

## 功能特性

- 🎨 支持多种主题风格（弄假成真、废土寻迹、诡秘诅咒、江湖逸闻、蒸汽魅影）
- 🔄 基于 AI 的物品生成
- 💾 本地物品存储与管理
- 📱 响应式设计，支持移动端
- 🖼️ 物品卡片导出为图片
- 🌓 支持亮色/暗色主题

## 技术栈

- Vue 3 + Vite
- Element Plus UI
- Pinia 状态管理
- html-to-image 图片导出
- LXGW WenKai Screen Web 字体

## 项目结构

```
src/
├── api/          # API 接口
├── components/   # Vue 组件
│   ├── ConfigDialog.vue    # 配置对话框
│   ├── ItemCard.vue       # 物品卡片
│   └── ItemInventory.vue  # 物品栏
├── stores/       # Pinia 状态管理
│   ├── config.js   # API 配置
│   ├── items.js    # 物品管理
│   └── theme.js    # 主题设置
└── App.vue      # 主应用组件
```

## 本地开发

1. 克隆项目
```bash
git clone [repository-url]
cd wonderful-item-generator
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 配置说明

使用前需要配置：
1. API 基础 URL
2. API 密钥
3. 选择合适的模型

## 许可证

MIT License

## 致谢

- [Element Plus](https://element-plus.org/) - UI 组件库
- [LXGW WenKai](https://github.com/lxgw/LxgwWenKai) - 开源字体
