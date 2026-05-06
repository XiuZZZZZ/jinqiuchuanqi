# 金秋传奇 — EasyClick 安卓自动化脚本

## 项目概览

EasyClick (EC) 安卓自动化脚本，目标手游《传奇》。脚本语言为 **JavaScript ES5**（EC 内置运行时，非 Node.js）。

## 入口与结构

- **脚本入口**: `金秋传奇/src/js/main.js` → `main()` 函数
- **UI 入口**: `金秋传奇/src/layout/ui.js` → `main()`，加载 `main.xml` / `main2.xml`
- **LIBS**: `金秋传奇/libs/` — EC 内置 API（22 个 .js 文件，自动加载）
- **CLI 工具链**: `ec_work_config/android/bin/ec-android-cli.exe`
- **开发者笔记**: `金秋传奇/项目文档/main.md`

## 开发命令

CLI 在仓库根目录执行，模块名始终为 `金秋传奇`：

```bash
$EC = ./ec_work_config/android/bin/ec-android-cli
$EC preview -m 金秋传奇           # 预览 UI
$EC run -m 金秋传奇               # 运行脚本（持续监控日志直到脚本结束）
$EC run -m 金秋传奇 -w false      # 运行脚本（不持续监控日志）
$EC stop -m 金秋传奇              # 停止运行
$EC build -m 金秋传奇             # 编译 IEC（只构建，退出时结束）
$EC capture-screen -m 金秋传奇    # 截图
$EC ocr-screen -m 金秋传奇        # OCR 识别屏幕
```

> 全部子命令及参数见 `ec_work_config/android/bin/SKILL.md`

## 构建产物

- `build -m 金秋传奇` 编译为 `.iec` 文件
- 发布前需用 `obfuscator.json` 混淆（high-obfuscation + rc4 字符串编码）
- 发布脚本须为 release 版本（`isReleaseIec()` 可检测）

## 授权机制

- 脚本启动时 `netcardProcessor()` 验证卡密
- appId/appSecret 需从 http://uc.ieasyclick.com/ 注册获取
- 卡密通过 UI 表单 `cardNo` 字段输入（`readConfigString("cardNo")`）

## 热更新

- 配置: `金秋传奇/src/update.json`（`version` + `update_url`）
- 运行时调用 `hotupdater.updateReq()` + `hotupdater.updateDownload()` 实现

## 自动化服务

脚本执行前必须启动自动化服务：

```javascript
if (!autoServiceStart(3)) { exit(); return; }
```

两种运行模式（在 EC 系统设置中切换）：
- **无障碍模式** — 通过 `acEvent` 模块操作
- **代理模式** — 通过 `agentEvent` 模块操作（需 ADB/Shell 权限）

## UI 参数读取与通信

- 读取表单值: `readConfigString("tag名称")` — 对应 XML 中 `android:tag` 属性
- 脚本→UI 注册函数: `registeScriptFunctionToUI("funcName", callback)`
- 脚本调用 UI 函数: `callUIRegisteFunction("funcName", data)`

## 关键 API 模块

| 模块 | 变量 | 用途 |
|------|------|------|
| 无障碍点击 | `acEvent` | 无障碍模式下模拟点击 |
| 代理点击 | `agentEvent` | 代理模式下模拟点击 |
| 图色查找 | `image` | OpenCV 模板匹配、颜色查找 |
| 设备操作 | `device` | 点击、滑动、按键 |
| 多线程 | `thread` | 创建子线程 |
| HTTP 请求 | `http` | 网络请求 |
| 文件操作 | `file` | 读写文件 |
| Shell 命令 | `shell` | 执行 shell 命令 |

## 日志与调试

- `logd()` / `logi()` / `logw()` / `loge()` — 分级日志
- `console.log()` / `console.error()` — 兼容式控制台日志
- `setSaveLog(true, path, size)` — 日志保存到文件
- CLI 默认以 JSON 格式输出日志到 stderr（`-f text` 可切换为文本格式）

## 注意事项

- `ec_work_config/android/bin/ec-android-cli.exe` **已嵌入仓库**，不依赖全局 PATH
- CLI 依赖 IntelliJ IDEA + EasyClick 插件处于运行状态（插件须能响应命令）
- 多 IDEA 窗口时，需用 `-p <工程根目录>` 指定工程路径以匹配正确实例
- 资源目录 `src/res/` 和插件目录 `src/plugin/` 当前为空
- 不要在代码中硬编码卡密 appId/appSecret
