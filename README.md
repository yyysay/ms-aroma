# MS Aroma

香薰器皿静态展示站点。项目使用 Astro 和 TypeScript，商品数据及图片在构建前生成，线上不需要后端服务。

## 项目结构

```text
.
├── data/                         # 本地源文件，不提交 Git
│   ├── products.xlsx
│   └── images/
└── frontend/
    ├── scripts/                  # Excel 和图片预处理脚本
    ├── public/data/products.json # 生成的商品数据
    ├── public/images/            # 生成的 WebP 图片
    └── src/                      # Astro 应用
```

## 本地开发

需要 Node.js 22.12 或更高版本。

```bash
cd frontend
npm install
npm run dev
```

开发服务器直接使用已经生成的 JSON 和图片。源数据变化时，请先执行 `npm run generate`。

## 更新数据

1. 用新文件替换 `data/products.xlsx`。
2. 将产品原图放入 `data/images/`，图片文件名需与“公司编码”一致。
3. 执行 `cd frontend && npm run generate`。

也可以分别执行：

```bash
npm run generate:images
npm run generate:data
```

生成结果位于：

- `frontend/public/data/products.json`
- `frontend/public/images/*.webp`

图片会转换为 800×800 白底 WebP；源文件未变化时会自动跳过。

## 构建

```bash
cd frontend
npm run build
```

构建产物位于 `frontend/dist/`，可以部署到任意静态文件托管服务。

如需生成数据并立即构建，可以执行 `npm run rebuild`。普通部署只需执行 `npm run build`，不要求部署环境持有未提交的源 Excel 和原图。

如需使用其他源文件位置，可设置：

```bash
PRODUCT_FILE=/path/to/products.xlsx \
IMAGE_SOURCE_DIR=/path/to/images \
npm run build
```
