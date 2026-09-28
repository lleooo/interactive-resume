# Leo Liu｜互動式履歷

一個以 React + TypeScript 打造的個人互動式履歷網站，包含 3D 角色首頁、中英雙語切換、深淺色主題，以及一個只根據履歷內容回答問題的 AI 聊天助手。

## 功能

- **3D 角色首頁**：使用 React Three Fiber 載入 GLB 模型，桌機上角色的頭會跟著滑鼠轉動，燈光也會隨游標移動
- **A4 履歷面板**：點擊「RESUME」後履歷卡片從下方滑入；可用 Esc、右上角 ✕ 或點擊空白處關閉
- **中英雙語**：所有文字（含履歷內容）都以 `{ en, zh }` 格式維護，一鍵切換
- **深色 / 淺色主題**
- **大頭照放大**：點擊大頭照以共享版面動畫（Motion）放大檢視
- **AI 履歷助手**：右下角聊天室，透過 Claude API 回答關於經歷、技能與專案的問題
  - 只根據 `resume-data.ts` 的內容回答
  - 提供建議問題，已問過的會變淡並移到後面
  - 前端每日提問上限 20 次，後端另有每 IP 每分鐘 10 次的限流
- **無障礙考量**：支援 `prefers-reduced-motion`、關閉的面板使用 `inert`、鍵盤可操作

## 技術棧

| 類別 | 使用技術 |
|---|---|
| 前端框架 | React 19、TypeScript、Vite |
| 樣式 | Tailwind CSS v4 |
| 3D | three.js、@react-three/fiber、@react-three/drei |
| 動畫 | Motion、tsParticles（背景粒子） |
| 資料請求 | TanStack Query、axios |
| 後端 | Vercel Function（`api/chat.ts`）+ Claude API（Haiku 4.5） |
| 品質工具 | Oxlint |

## 專案結構

```
api/
  chat.ts              # 聊天 API：組合履歷內容作為 context，呼叫 Claude API
public/
  model/me.glb         # 3D 角色模型
  headshot/            # 大頭照
src/
  App.tsx              # 在 landing / resume 兩個畫面之間切換
  components/          # 首頁、履歷面板、各履歷區塊、頂部控制列
  chatbot/             # 聊天室 UI、API 呼叫
    model/             # 3D 角色（CharacterHost、CharacterModel、滑鼠追蹤）
  data/resume-data.ts  # 履歷內容（唯一資料來源，前端與聊天 API 共用）
  i18n/                # 語系 Context 與介面文字
  theme/               # 主題 Context
```

## 本機開發

需要 Node.js 22 以上。

```bash
npm install
npm run dev        # 啟動 Vite 開發伺服器
```

`npm run dev` 只會啟動前端，**聊天室的 `/api/chat` 不會運作**。要在本機測試聊天功能，請改用 Vercel CLI：

```bash
npm i -g vercel
vercel dev
```

並在專案根目錄建立 `.env.local`：

```
ANTHROPIC_API_KEY=你的_API_金鑰
```

## 其他指令

```bash
npm run build      # 型別檢查 + 產出正式版到 dist/
npm run preview    # 在本機預覽正式版
npm run lint       # 執行 Oxlint
```

## 修改履歷內容

所有履歷資料都在 [`src/data/resume-data.ts`](src/data/resume-data.ts)，修改後網頁與 AI 助手會同步使用新內容，不需要另外改其他地方。介面上的固定文字（按鈕、標題等）則在 [`src/i18n/ui-strings.ts`](src/i18n/ui-strings.ts)。

## 部署

專案設計為部署在 Vercel：前端為 Vite 靜態網站，`api/` 目錄會自動成為 Vercel Function。部署前請在 Vercel 專案設定中加入環境變數 `ANTHROPIC_API_KEY`。
