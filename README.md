# 何悦的产品经理作品集

纯静态 HTML / CSS / JavaScript 网站，无后端、无环境变量、无需构建。

## 部署到 Vercel

推荐将本文件所在的 portfolio-web 目录内容作为独立 GitHub 仓库上传：

```
index.html
styles.css
script.js
assets/             # 图片及 resume.pdf，必须完整上传
vercel.json
.vercelignore
.gitignore
README.md
package.json        # 仅提供可选验证工具
verify.mjs
```

1. GitHub 新建仓库并上传目录内容（保留 assets 文件夹结构）。
2. Vercel → Add New → Project → 导入该 GitHub 仓库。
3. Framework Preset 选择 Other。
4. 若 index.html 位于仓库根目录，Root Directory 使用 ./；若上传的是包含 portfolio-web 的父目录，则选 portfolio-web。
5. Build Command 和 Install Command 留空，Output Directory 使用 .；项目的 vercel.json 已保存这些配置。
6. Deploy 后复制生产环境域名分享。后续推送到生产分支将自动更新网站。

不要上传整个“作品集”父目录中的其他简历和工作材料。预览截图和本地工具由忽略文件排除，已存在的源文件保留用于编辑。

## 路径与功能

- CSS、JS、所有图片与 PDF 均使用项目内相对路径，文件名大小写一致。
- 简历文件是 assets/resume.pdf：首页“下载简历”使用 download 属性；其他简历入口在新标签页预览。
- 导航使用 /#projects 等原生锚点，刷新保留定位，无需 SPA 全路径重写。/projects 不是本网站路由。
- 轮播支持前后切换和首尾循环，手机端导航可展开及关闭。
- 邮件入口为 mailto:heyue092@gmail.com，打开设备已配置的邮箱客户端；不在网站内发送邮件。
- 首页无需任何外部字体、脚本或图片服务；“打开作品”链接仍指向已有飞书项目，其访问权限由该项目控制。

## 本地或线上验证

安装 Node.js 后在此目录执行（仅开发验证需要，Vercel 不执行）：

```
npm install
npx playwright install chromium
npm test
```

脚本自行启动临时 HTTP 服务，检查桌面和手机尺寸下的资源、图片解码、锚点刷新、五组轮播循环、邮件地址、真实 PDF 下载、技能切换及页面错误。可用 TEST_URL 指定已部署的网站地址（包含结尾 /），进行线上复验；也可用 CHROME_PATH 指向已安装浏览器。

上线后请用未登录浏览器和手机移动网络打开生产链接复核。自动化检查能证明页面实现工作，但不能保证所有地区、运营商或内置浏览器的访问情况。

## 分享方案建议

如果主要给国内 HR 分享，并且旧飞书妙搭应用仍可管理，优先检验它的“互联网公开访问 / 不需登录”设置及移动网络打开效果。旧站是否可修改取决于原账号和项目权限，并不取决于当时使用的电脑。本目录可以作为独立代码备份与 Vercel 版本。

若希望直接维护当前代码、通过 GitHub 自动发布，优先 GitHub + Vercel；无需迁移页面到妙搭。未实测前，不承诺 Vercel 默认域名在国内所有网络都稳定。

参考：
- https://vercel.com/docs/builds/configure-a-build
- https://vercel.com/docs/git
- https://www.feishu.cn/content/article/7597741503372512473
