# 考试资料共享平台

这是一个基于Nuxt 4的考试资料共享平台，包含公务员考试、研究生考试等课程资料和公告信息。

## 项目功能

### 主要页面
- **首页** (`/index/index.vue`)
- **公告信息** (`/gonggao/index.vue` 和 `/gonggao/[gonggao_name].vue`)
- **课程资料**
  - 公务员考试 (`/kecheng/gwy/[category].vue`)
  - 研究生考试 (`/kecheng/yjs/[category].vue`)
- **资料下载**
  - 公务员资料 (`/ziliao/gwy/index.vue`)
  - 研究生资料 (`/ziliao/yjs/index.vue`)
- **关于我们** (`/about/index.vue`)

### 布局
- 默认布局 (`/layouts/default.vue`)
- 全局菜单 (`/components/AppMenu.vue`)

## 开发环境配置

### 依赖安装
```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### 开发服务器
启动开发服务器：
```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### 生产构建
构建生产环境：
```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

### 本地预览
预览生产构建：
```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## 项目结构
```
app/
├── components/       # 公共组件
│   └── AppMenu.vue   # 全局菜单组件
├── composables/      # 组合式函数
├── layouts/          # 布局组件
│   └── default.vue   # 默认布局
├── middleware/       # 中间件
├── pages/            # 页面组件
│   ├── about/        # 关于页面
│   ├── gonggao/      # 公告页面
│   ├── index/        # 首页
│   ├── kecheng/      # 课程页面
│   │   ├── gwy/      # 公务员考试
│   │   └── yjs/      # 研究生考试
│   └── ziliao/       # 资料下载
│       ├── gwy/      # 公务员资料
│       └── yjs/      # 研究生资料
├── plugins/          # 插件
└── utils/            # 工具函数
```

查看更多部署信息：[Nuxt部署文档](https://nuxt.com/docs/getting-started/deployment)