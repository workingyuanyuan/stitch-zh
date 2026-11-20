---
title: 擷取執行中的 App
description: 用 stitch capture 擷取本機開發伺服器上的頁面，再上傳到 Stitch Canvas 當作畫面。
appliesTo: Stitch CLI（2026-11-20）
caveat: 擷取和上傳是兩個分開的指令；stitch capture 只把檔案存在本機，要執行 stitch upload screen 才會送到 Stitch。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Capture Live Apps
    url: https://stitch.google.com/docs/cli/capture-and-upload/
---

## 為什麼先擷取

重新設計既有頁面，或在已成形的 App 裡做新功能的原型時，不要從空白畫布開始。先把實際執行中的介面放上 Stitch Canvas，修改就會建立在真正的版面與樣式上。

| 方法 | 做法 |
| --- | --- |
| `/stitch` Skill | 請 coding agent 擷取並上傳，一步完成 |
| 終端機 | `stitch capture` 存到本機，檢查後再用 `stitch upload screen` 上傳 |

## 用 `/stitch` Skill 擷取

裝好 `/stitch` Skill（`stitch agent-skills add`），啟動本機開發伺服器，再請 coding agent 擷取路由：

```text
/stitch I want to redesign the ordering flow of our dumpling shop app starting from what it looks like today. The dev server is up; put the /menu and /order pages on my Stitch Canvas exactly as they render now.
```

這段要 agent 為了從現況改版水餃店 App 的點餐流程，把開發伺服器上的 `/menu` 與 `/order` 兩個頁面照目前的樣子放上 Stitch Canvas。

agent 會自動找出 Vite、Next.js 或 Astro 開發伺服器的連接埠，為每個路由擷取 hydration 後的 DOM 和一張 `1280x800` 驗證截圖，確認頁面沒有被登入視窗擋住，再把畫面上傳到 Stitch 專案。

## 從終端機擷取

CLI 把擷取和上傳分成兩個指令，送出任何東西給 Stitch 之前，都可以先在磁碟上檢查擷取結果。

### 擷取路由

把網址交給 `stitch capture`。它用 headless Chrome 載入頁面，所以需要 JavaScript hydration、WebFonts 與計算後樣式的 React、Next.js、Vite、Vue App 都能擷取。

```bash
stitch capture http://localhost:3000/checkout --wait-for "#checkout-root"
```

| 輸出 | 位置 |
| --- | --- |
| HTML（預設） | `.stitch/captures/<route>.html`，這個例子是 `.stitch/captures/checkout.html` |
| HTML（自訂） | `-o` 指定路徑；`-o -` 印到 stdout |
| 驗證截圖 | `.stitch/` 底下和 HTML 同名的 `1280x800` 截圖，例如 `.stitch/captures/checkout.png` |

### 等待與轉址

| 旗標 | 作用 |
| --- | --- |
| `--wait-until` | 首次繪製後還在載入時，選擇等到什麼時候：`networkidle0`、`networkidle2`、`load` 或 `domcontentloaded` |
| `--settle-timeout` | 等載入動畫與骨架畫面消失的時間 |
| `--allow-redirect` | 頁面轉到別的路由（例如登入頁）時仍然存檔；不加時擷取會失敗，避免存到錯的頁面 |

### 擷取靜態檔案或伺服器渲染的 HTML

傳路徑而不是網址，可以把存好的或預先渲染的 HTML 檔整理成內含所需資源的獨立檔案。加上 `--origin`，路徑以 `/` 開頭的資源會從開發伺服器取來內嵌：

```bash
stitch capture ./dist/index.html --origin http://localhost:3000 -o .stitch/index.html
```

### 進階子指令

| 子指令 | 作用 |
| --- | --- |
| `stitch capture browser` | headless Chrome，多了 `--probe`、`--screenshot` 等旗標 |
| `stitch capture port` | 透過 HTTP 取得伺服器渲染的 HTML，不執行 JavaScript |
| `stitch capture file` | 讀取檔案，也能用 `--stdin` 讀標準輸入 |
| `stitch capture routes` | 列出 CLI 在程式碼庫裡找到的路由 |

## 擷取需要登入的頁面

不要為了擷取而改應用程式的原始碼去跳過登入。`stitch capture` 有三種做法：

| 做法 | 適合 |
| --- | --- |
| `--tab` | 在 `chrome-devtools` CLI 操作的瀏覽器分頁裡直接登入或切到要的頁面，再原樣擷取該分頁，不重新載入 |
| `--auth` | 指向 Playwright 的 `storageState` JSON 檔，帶入存好的 cookie 與 `localStorage` |
| `--prepare` | 擷取 DOM 之前，先在頁面裡執行一小段登入腳本 |

在已開啟的分頁裡登入或切到要的頁面後，擷取該分頁：

```bash
stitch capture --tab -o .stitch/dashboard.html
```

帶入存好的 cookie 與 `localStorage`：

```bash
stitch capture http://localhost:4321/schedule \
  --auth .stitch/storage.json \
  -o .stitch/schedule.html
```

擷取前先執行登入腳本：

```bash
stitch capture http://localhost:4321/login \
  --prepare .stitch/signin.js \
  --wait-for "#dashboard" \
  --allow-redirect \
  -o .stitch/dashboard.html
```

## 上傳到 Stitch Canvas

本機的 `.html` 快照或圖片確認沒問題後，用 `stitch upload screen` 放上 Stitch Canvas 專案：

```bash
stitch upload screen .stitch/captures/checkout.html \
  --route "/checkout" \
  --title "Checkout"
```

這裡的路徑是前面那次擷取的預設輸出位置；擷取時用 `-o` 指定了別的路徑，就換成那個路徑。

| 旗標 | 作用 |
| --- | --- |
| `--route` | 上傳應用程式路由時使用，Stitch 會把這個畫面記為 `/checkout` 的標準參考 |
| `--title` | 畫面名稱 |

存檔或上傳快照之前，CLI 會移除頁面裡找到的機密資料，例如本機 `.env` 檔裡的值、API key、OAuth 權杖，以及嵌在 hydration 資料或行內腳本裡的私鑰。

上傳後，用 `stitch open project` 開啟專案，或用 `stitch edit screen` 開始修改畫面。
