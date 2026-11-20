---
title: 檢查規則
description: "@google/design.md linter 對 DESIGN.md 執行的檢查規則與嚴重程度。"
appliesTo: DESIGN.md（2026-11-20）
caveat: 儲存庫 README 列出 11 條規則，比 Stitch 文件多 3 條；兩邊都只有 broken-ref 是 error，會讓 lint 以結束碼 1 結束。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Linting rules
    url: https://stitch.google.com/docs/design-md/linting-rules/
  - title: google-labs-code/design.md：README（db977b3）
    url: https://github.com/google-labs-code/design.md/blob/db977b3c1d1f309269f43d5d17ae828d54bd6ae3/README.md
---

## 規則一覽

`@google/design.md` linter 對解析後的 DESIGN.md 執行下列規則。每條規則的嚴重程度是固定的：`error`（結束碼 `1`）、`warning` 或 `info`。執行方式見 [用 CLI 驗證 DESIGN.md](/design-md/cli/)。

Stitch 文件列出 8 條規則；儲存庫 `google-labs-code/design.md` 的 README（commit `db977b3`）列出 11 條，多了 `unknown-key`、`token-like-ignored`、`omitted-rules`。

| 規則 | 嚴重程度 | 檢查什麼 | 只在 README |
| --- | --- | --- | --- |
| `broken-ref` | error | 無法解析的 token 參照；未知的元件 sub-token；README 另列壞掉或超出範圍的外部 `@` 參照 | |
| `missing-primary` | warning | 定義了顏色，但沒有 `primary` | |
| `contrast-ratio` | warning | 元件的 `backgroundColor` 與 `textColor` 對比低於 WCAG AA 的 4.5:1 | |
| `orphaned-tokens` | warning | 定義了但沒有任何元件參照的顏色 token | |
| `missing-typography` | warning | 定義了顏色，但沒有任何字體排印 token | |
| `section-order` | warning | 章節不照標準順序 | |
| `missing-sections` | info | 缺少選用的 `spacing` 或 `rounded` | |
| `token-summary` | info | 各群組定義了多少 token | |
| `unknown-key` | warning | 頂層 YAML 鍵看起來是已知鍵的錯字 | 是 |
| `token-like-ignored` | warning | 未知的頂層鍵帶有像 token 的值 | 是 |
| `omitted-rules` | info | 檢查 `omitted` 設定裡未知或多餘的章節 | 是 |

## broken-ref

**嚴重程度：** error

找出 front matter 裡解析不到任何已定義 token 的參照（`{path.to.token}`），也標出未知的元件 sub-token 屬性名稱。

**何時觸發：**

- 元件參照了不存在的 token 路徑，例如沒有定義 `accent` 顏色卻寫了 `{colors.accent}`。
- 元件用了 linter 無法辨識的屬性名稱。可辨識的有 `backgroundColor`、`textColor`、`typography`、`rounded`、`padding`、`size`、`height`、`width`。

**回報範例：**

```
error  components.button-primary  Reference {colors.accent} does not resolve to any defined token.
```

**修正：** 在 front matter 定義缺少的 token，或改正參照路徑。未知的屬性改用可辨識的 sub-token 名稱。

README 的規則表另外把壞掉或超出範圍的外部 `@` 參照（`Components` 章節裡的 `@<path>[#<fragment>]`）列入這條規則。

[規格](/design-md/specification/)的「未知內容」表把未知的元件屬性列為「接受，但發出警告」，README 的同一張表也這樣寫；這條規則則以 error 回報未知的屬性名稱。

## missing-primary

**嚴重程度：** warning

front matter 定義了顏色，卻沒有名為 `primary` 的 token。沒有 primary 顏色時，agent 會自己產生一個，你對配色的掌控就變少了。

**何時觸發：** `colors` 有一個以上的項目，但沒有一個叫 `primary`。

**回報範例：**

```
warning  colors  No 'primary' color defined. The agent will auto-generate key colors, reducing your control over the palette.
```

**修正：** 在 `colors` 加上 `primary`。

## contrast-ratio

**嚴重程度：** warning

檢查元件的 `backgroundColor` 與 `textColor` 組合是否符合 WCAG 對比度，低於 AA 最低標準 4.5:1 時發出警告。

**何時觸發：** 元件同時定義了 `backgroundColor` 和 `textColor`，而解析後的兩個顏色對比低於 4.5:1。只定義其中一個時不檢查。

**回報範例：**

```
warning  components.card-dark  textColor (#999999) on backgroundColor (#333333) has contrast ratio 3.48:1, below WCAG AA minimum of 4.5:1.
```

**修正：** 調整背景色或文字色，讓對比至少達到 4.5:1。

## orphaned-tokens

**嚴重程度：** warning

找出定義了、但沒有任何元件參照的顏色 token。這種 token 只會增加雜訊，也可能表示設計系統還沒寫完。

**何時觸發：** `colors` 裡的某個 token 沒有被任何元件的屬性參照。只有在至少定義了一個元件時才會觸發。

**回報範例：**

```
warning  colors.tertiary  'tertiary' is defined but never referenced by any component.
```

**修正：** 在某個元件裡參照這個 token；不再需要就刪除。

## missing-typography

**嚴重程度：** warning

定義了顏色，卻沒有任何字體排印 token。沒有字體排印 token 時，agent 會改用自己選的字體。

**何時觸發：** `colors` 有項目，但 `typography` 是空的。

**回報範例：**

```
warning  typography  No typography tokens defined. Agents will use default font choices, reducing your control over the design system's typographic identity.
```

**修正：** 在 front matter 至少加一個字體排印 token，例如 `body-md`。

## section-order

**嚴重程度：** warning

Markdown 章節沒有照規格的[標準順序](/design-md/specification/#章節順序)排列時發出警告。順序是 `Overview`、`Colors`、`Typography`、`Layout`、`Elevation & Depth`、`Shapes`、`Components`、`Do's and Don'ts`。

README 的規格列出 10 個章節，在 `Shapes` 與 `Components` 之間多了 `Motion & Micro-interaction` 和 `Voice & Content Strategy`。

**何時觸發：** 一個可辨識的章節標題，出現在另一個本應排在它前面的可辨識章節之前。檢查前會先把別名換成標準名稱，例如 `Elevation` 視為 `Elevation & Depth`。

**回報範例：**

```
warning  Section 'Components' appears before 'Typography', which is out of order. Expected order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts
```

**修正：** 調整 Markdown 內文的章節順序，符合標準順序。

## missing-sections

**嚴重程度：** info

檔案已經定義了其他 token，卻沒有選用的 `spacing` 或 `rounded` 群組。這兩個群組不是必要的，但缺少時 agent 會改用預設值。

**何時觸發：** `colors` 有項目，但 `spacing` 或 `rounded` 沒有項目。

**回報範例：**

```
info  spacing  No 'spacing' section defined. Layout spacing will fall back to agent defaults.
```

**修正：** 想自己控制這些數值時，在 front matter 加上 `spacing` 或 `rounded`。

## token-summary

**嚴重程度：** info

回報每個群組定義了多少 token，純粹提供資訊。

**回報範例：**

```
info  Design system defines 4 colors, 3 typography scales, 2 rounding levels, 6 spacing tokens, 3 components.
```

## unknown-key

**嚴重程度：** warning（只在 README 列出）

頂層 YAML 鍵看起來像某個已知 schema 鍵的錯字時發出警告，例如把 `colors:` 寫成 `colours:`。自訂的擴充鍵不會觸發。

## token-like-ignored

**嚴重程度：** warning（只在 README 列出）

未知的頂層鍵帶有像 token 的值，例如 hex 色碼、字體家族或尺寸時發出警告，表示這些值可能因為鍵名拼錯而被丟掉了。

## omitted-rules

**嚴重程度：** info（只在 README 列出）

檢查 `omitted` 設定，找出其中未知或多餘的章節。`omitted` 是 README 版 schema 的選用頂層鍵，列出刻意省略的章節，見 [DESIGN.md 規格](/design-md/specification/)。
