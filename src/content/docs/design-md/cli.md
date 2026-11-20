---
title: 用 CLI 驗證 DESIGN.md
description: "@google/design.md CLI 驗證 DESIGN.md、比較兩個版本，並匯出 token。"
appliesTo: DESIGN.md（2026-11-20）
caveat: 在 Windows PowerShell 直接執行 npx @google/design.md 可能沒有輸出；改用 npx -p @google/design.md designmd。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Validate with the CLI
    url: https://stitch.google.com/docs/design-md/cli/
  - title: google-labs-code/design.md：README（db977b3）
    url: https://github.com/google-labs-code/design.md/blob/db977b3c1d1f309269f43d5d17ae828d54bd6ae3/README.md
---

## 指令一覽

`@google/design.md` CLI 依規格驗證設計系統、找出無法解析的 token 參照、檢查 WCAG 對比度，並把 token 匯出成其他格式。輸出預設是結構化的 JSON，agent 可以直接據此行動。

| 指令 | 用途 | 結束碼 |
| --- | --- | --- |
| `lint` | 驗證一份 `DESIGN.md` 的結構 | 有 error 時為 `1`，否則為 `0` |
| `diff` | 比較兩份 `DESIGN.md` 的差異 | 新版的 error 或 warning 增加時為 `1` |
| `export` | 把 token 轉成 Tailwind 或 DTCG 格式 | 成功為 `0`；`--format` 無效或輸出出錯為 `1`；讀不到輸入檔為 `2` |
| `spec` | 輸出 DESIGN.md 格式規格 | |

所有指令都接受檔案路徑，或用 `-` 從標準輸入讀取，輸出預設是 JSON。例外是 `spec`：它的選項表沒有輸入檔，`--format` 預設是 `markdown`。

Stitch 文件與儲存庫 `google-labs-code/design.md` 的 README（commit `db977b3`）有幾處不一致，整理在最後的[差異表](#stitch-文件與儲存庫-readme-的差異)。README 寫明 CLI 還在積極開發，會隨格式改變。

## 安裝

```bash
npm install @google/design.md
```

不安裝也可以直接執行，`npx` 一律從公開的 npm registry 取得套件：

```bash
npx @google/design.md lint DESIGN.md
```

### Windows

| 情況 | 做法 |
| --- | --- |
| shell 會特別處理 `@`（PowerShell 與部分終端機） | 套件名稱加引號：`npm install "@google/design.md"` |
| PowerShell 用 `npx @google/design.md` 沒有輸出，或用 Markdown 編輯器開啟了 `DESIGN.md` | 改用不含點號的別名 `designmd`，見下方指令 |
| 在 `package.json` 的 script 裡直接呼叫 CLI | 寫 `designmd`，不要寫 `design.md` |

原因是執行檔名稱 `design.md` 結尾的 `.md`，在 Windows 解析指令時會撞上 Markdown 檔案的關聯程式。`designmd` 指向同一個進入點，在所有平台上行為相同。

```bash
npx -p @google/design.md designmd lint DESIGN.md
```

在 `package.json` 的 `scripts` 裡也用 `designmd`：

```json
{
  "scripts": {
    "design:lint": "designmd lint DESIGN.md"
  }
}
```

### 安裝時出現 ENOVERSIONS

`npm error ENOVERSIONS`（No versions available for `@google/design.md`）幾乎都是因為 npm 沒有查詢公開的 registry：`.npmrc` 裡自訂了 `registry=`、公司的鏡像站還沒同步這個套件，或 `@google` scope 的 `@google:registry` 設錯了。

先查目前生效的 registry：

```bash
npm config get registry
```

從網際網路正常安裝時，結果應該是 `https://registry.npmjs.org/`。修正設定後，如果先前的 404 被快取了，執行 `npm cache clean --force` 再重試。

## lint：驗證結構

`lint` 解析 YAML front matter、解析所有 token 參照、執行[檢查規則](/design-md/linting-rules/)，然後回報結果。

```bash
npx @google/design.md lint DESIGN.md
npx @google/design.md lint --format json DESIGN.md
```

輸出範例：

```json
{
  "findings": [
    {
      "severity": "warning",
      "path": "colors",
      "message": "No 'primary' color defined. The agent will auto-generate key colors, reducing your control over the palette."
    },
    {
      "severity": "info",
      "message": "Design system defines 4 colors, 3 typography scales, 2 rounding levels."
    }
  ],
  "summary": { "errors": 0, "warnings": 1, "infos": 1 }
}
```

用程式產生 `DESIGN.md` 時，可以從標準輸入傳入：

```bash
cat DESIGN.md | npx @google/design.md lint -
```

| 選項 | 類型 | 預設 | 說明 |
| --- | --- | --- | --- |
| `file` | 位置參數 | 必填 | `DESIGN.md` 的路徑，或 `-` 代表標準輸入 |
| `--format` | `json`（另見差異表） | `json` | 輸出格式 |

有 error 時結束碼為 `1`，否則為 `0`。warning 和 info 不會讓結束碼變成 `1`。

## diff：比較兩個版本

`diff` 回報哪些 token 被新增、移除或修改，並標出退步：「之後」那份檔案的 error 或 warning 比「之前」多。

```bash
npx @google/design.md diff DESIGN.md DESIGN-v2.md
```

輸出範例：

```json
{
  "tokens": {
    "colors": { "added": ["accent"], "removed": [], "modified": ["tertiary"] },
    "typography": { "added": [], "removed": [], "modified": [] }
  },
  "findings": {
    "before": { "errors": 0, "warnings": 1 },
    "after": { "errors": 0, "warnings": 2 },
    "delta": { "errors": 0, "warnings": 1 }
  },
  "regression": true
}
```

這個例子裡，新版的 warning 多了一個，所以 `regression` 是 `true`。README 的輸出範例另外列出 `rounded`、`spacing`、`components` 三組 token，`before` 與 `after` 也多了 `infos` 計數。

| 選項 | 類型 | 預設 | 說明 |
| --- | --- | --- | --- |
| `before` | 位置參數 | 必填 | 「之前」那份 `DESIGN.md` 的路徑 |
| `after` | 位置參數 | 必填 | 「之後」那份 `DESIGN.md` 的路徑 |
| `--format` | `json`（另見差異表） | `json` | 輸出格式 |

偵測到退步時結束碼為 `1`。

## export：匯出 token

把 `DESIGN.md` 的 token 轉成程式碼可用的格式。

```bash
npx @google/design.md export --format json-tailwind DESIGN.md > tailwind.theme.json
npx @google/design.md export --format css-tailwind DESIGN.md > theme.css
npx @google/design.md export --format dtcg DESIGN.md > tokens.json
```

| `--format` | 輸出 | 內容 |
| --- | --- | --- |
| `json-tailwind` | JSON | Tailwind v3 的 `theme.extend` 設定物件，放進 `tailwind.config.js` |
| `css-tailwind` | CSS | Tailwind v4 的 `@theme { ... }` 區塊，使用 CSS 自訂屬性 |
| `tailwind` | JSON | `json-tailwind` 的別名，為了向下相容 |
| `dtcg` | JSON | 符合 [W3C Design Tokens Format Module](https://tr.designtokens.org/format/) 的 `tokens.json` |

`tailwind` 的 JSON 物件包含由 design token 對應而來的 `colors`、`fontFamily`、`fontSize`、`borderRadius` 與 `spacing`。`css-tailwind` 使用 Tailwind v4 的 CSS 變數命名空間：`--color-*`、`--font-*`、`--text-*`、`--leading-*`、`--tracking-*`、`--font-weight-*`、`--radius-*`、`--spacing-*`。

| 選項 | 類型 | 預設 | 說明 |
| --- | --- | --- | --- |
| `file` | 位置參數 | 必填 | `DESIGN.md` 的路徑，或 `-` 代表標準輸入 |
| `--format` | `json-tailwind`、`css-tailwind`、`tailwind` 或 `dtcg` | 必填 | 匯出的目標格式 |

只要匯出成功，結束碼就是 `0`，不論來源檔案有沒有 lint 問題；要依檢查結果擋下流程，另外執行 `lint`。`--format` 無效或輸出出錯時為 `1`，讀不到輸入檔時為 `2`。

## spec：輸出規格

輸出 DESIGN.md 的格式規格。把它放進給 agent 的提示詞裡，agent 就確切知道要產生什麼結構。

```bash
npx @google/design.md spec
npx @google/design.md spec --rules
npx @google/design.md spec --rules-only --format json
```

| 選項 | 類型 | 預設 | 說明 |
| --- | --- | --- | --- |
| `--rules` | boolean | `false` | 在規格後面附上目前啟用的檢查規則表 |
| `--rules-only` | boolean | `false` | 只輸出檢查規則表 |
| `--format` | `markdown` 或 `json` | `markdown` | 輸出格式 |

規格的內容見 [DESIGN.md 規格](/design-md/specification/)。

## 在程式裡使用

linter 也是一個 TypeScript 函式庫，從 `@google/design.md` 套件的 `@google/design.md/linter` 進入點匯入 `lint`。傳入 `DESIGN.md` 的文字，會得到一份報告：

```typescript
import { lint } from '@google/design.md/linter';

const report = lint(markdownString);

console.log(report.findings);      // Finding[]
console.log(report.summary);
console.log(report.designSystem);  // DesignSystemState
```

報告欄位見下方差異表。

## Stitch 文件與儲存庫 README 的差異

| 項目 | Stitch 文件 | 儲存庫 README |
| --- | --- | --- |
| `lint` 的 `--format` | `json` 或 `text` | 只列 `json` |
| `diff` 的 `--format` | `json` 或 `text` | 只列 `json` |
| `diff` 偵測什麼 | token 層級的變化 | token 層級與內文（prose）的退步 |
| `export` 的 `--format` | `tailwind` 或 `dtcg` | `json-tailwind`、`css-tailwind`、`tailwind`、`dtcg` |
| `export` 的輸入 | 檔案路徑 | 檔案路徑，或 `-` 代表標準輸入 |
| `export` 的結束碼 | 沒有寫 | `0`、`1`、`2`，見上方 |
| `lint` 執行幾條規則 | 8 條 | 11 條，見[檢查規則](/design-md/linting-rules/) |
| `report.summary` | `{ errors, warnings, infos }` | `{ errors, warnings, info }` |
| `report.designSystem` | 解析後（Resolved）的 `DesignSystemState` | 剖析後（Parsed）的 `DesignSystemState` |
| `report.tailwindConfig` | 有，產生的 Tailwind 主題 | 範例裡沒有這個欄位 |
| Windows 的 `designmd` 別名、ENOVERSIONS 排解 | 沒有寫 | 有，見「安裝」 |
