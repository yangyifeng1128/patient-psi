# 快速开始

## 1. 克隆项目代码

```sh
git clone https://github.com/yangyifeng1128/patient-psi.git
cd patient-psi
```

## 2. 初始化 Python 开发环境

```sh
uv init
uv venv
.venv\Scripts\activate
uv pip install -r requirements.txt
```

## 3. 初始化 Node.js 开发环境

```sh
pnpm i -g vercel
pnpm i -g ts-node
```

## 4. 下载 Vercel 环境变量

```sh
vercel env pull .env.local
```

## 5. 上传环境变量至 Vercel

```sh
vercel env add AUTH_SECRET
vercel env add AZURE_API_KEY
vercel env add AZURE_RESOURCE_NAME
```
