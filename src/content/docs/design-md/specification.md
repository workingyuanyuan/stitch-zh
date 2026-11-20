---
title: DESIGN.md 規格
description: DESIGN.md 的格式規格：YAML front matter 的 design token 與 Markdown 章節。
appliesTo: DESIGN.md（2026-11-20）
caveat: Stitch 文件列出 8 個章節、顏色只用 hex；儲存庫 README 列出 10 個章節、多了 motion 與 omitted 鍵，顏色可用任何 CSS 顏色。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：The DESIGN.md specification
    url: https://stitch.google.com/docs/design-md/specification/
  - title: Stitch Docs：Linting rules
    url: https://stitch.google.com/docs/design-md/linting-rules/
  - title: google-labs-code/design.md：README（db977b3）
    url: https://github.com/google-labs-code/design.md/blob/db977b3c1d1f309269f43d5d17ae828d54bd6ae3/README.md
---

## 兩層結構

| 層 | 內容 | 地位 |
| --- | --- | --- |
| YAML front matter | 機器可讀的 design token，agent 用來維持一致的精確數值 | 規範值 |
| Markdown 內文 | 人可讀的設計理由，分成多個 `##` 章節 | 說明怎麼套用這些數值 |

內文可以用描述性的顏色名稱，例如「Riverside Tea Green」，對應到系統化的 token 名稱，例如 `primary`。

規格是基礎，不是硬性規定：它提供 agent、工具與團隊共同的依據，同時保留依領域需求擴充格式的空間。

## Design token

design token 以 YAML front matter 的形式放在檔案開頭。

| 規則 | 內容 |
| --- | --- |
| 開頭 | 一行只有 `---` |
| 結尾 | 一行只有 `---` |
| 中間 | 依下方 schema 撰寫的 YAML |

token 系統參考 [W3C Design Token Format](https://www.designtokens.org/)，可以輕鬆和 `tokens.json`、Figma variables、Tailwind 主題設定互相轉換。

下面是一個淡水河畔茶館訂位 App 的完整 front matter：

```yaml
---
version: alpha
name: Tamsui Tea House
description: Booking app for a riverside tea house in New Taipei
colors:
  primary: "#1F3A2E"
  secondary: "#6E6254"
  tertiary: "#C8553D"
  neutral: "#F6F1E7"
  on-primary: "#FFFFFF"
typography:
  headline-lg:
    fontFamily: Noto Serif TC
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  body-md:
    fontFamily: Noto Sans TC
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label-md:
    fontFamily: Noto Sans TC
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.05em
rounded:
  sm: 4px
  md: 10px
  full: 9999px
spacing:
  sm: 8px
  md: 16px
  lg: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px
  chip:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
  link:
    textColor: "{colors.tertiary}"
---
```

### Schema

```yaml
version: <string>          # optional, current version: "alpha"
name: <string>
description: <string>      # optional
colors:
  <token-name>: <Color>
typography:
  <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <token-name>: <string | token reference>
```

| 鍵 | 值 |
| --- | --- |
| `version` | 字串，選用；目前的版本是 `"alpha"` |
| `name` | 字串，設計系統名稱 |
| `description` | 字串，選用 |
| `colors` | token 名稱對應到 Color |
| `typography` | token 名稱對應到 Typography |
| `rounded` | 級距名稱對應到 Dimension |
| `spacing` | 級距名稱對應到 Dimension 或數字 |
| `components` | 元件名稱對應到一組 sub-token，值是字串或 token 參照 |

schema 只把 `version` 和 `description` 標為選用。

`<scale-level>` 代表級距中的一個具名層級。常見的名稱有 `xs`、`sm`、`md`、`lg`、`xl`、`full`，但任何描述性的字串都可以當鍵。

## Token 類型

| 類型 | 格式 | 例子 |
| --- | --- | --- |
| Color | `#` 加 hex 色碼（sRGB） | `"#1F3A2E"` |
| Dimension | 數字加單位（`px`、`em`、`rem`） | `40px`、`-0.01em` |
| Token Reference | `{path.to.token}` | `{colors.primary}` |
| Typography | 複合物件 | 屬性見下表 |

### Typography 的屬性

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `fontFamily` | string | 字體家族名稱 |
| `fontSize` | Dimension | 字級 |
| `fontWeight` | number | 數字字重，例如 `400`、`700`。在 YAML 裡，不加引號的數字和加引號的字串等價 |
| `lineHeight` | Dimension 或 number | 有單位的值（例如 `24px`）或無單位的倍數（例如 `1.6`）；建議用無單位 |
| `letterSpacing` | Dimension | 字距調整 |
| `fontFeature` | string | 設定 [`font-feature-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-feature-settings) |
| `fontVariation` | string | 設定 [`font-variation-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variation-settings) |

### Token 參照

token 參照用大括號包住，內容是指向 YAML 樹中另一個值的物件路徑。

| 位置 | 可以指向 |
| --- | --- |
| 大多數 token 群組 | 只能指向原始值，例如 `{colors.primary}`，不能指向群組 |
| `components` 裡 | 也可以指向複合值，例如 `{typography.label-md}` |

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
```

## 章節

每份 DESIGN.md 都用同一套結構。和專案無關的章節可以省略，但出現的章節應該照下表的順序排列。所有章節都用 `##` 標題。可以另外加一個 `#` 標題當文件標題，它不會被當成章節解析。

章節結構刻意保持開放：標準章節提供共同詞彙，設計系統可以再加上領域特有的章節。

### 章節順序

| # | 章節 | 別名 | 對應的 token 群組 |
| --- | --- | --- | --- |
| 1 | `Overview` | `Brand & Style` | |
| 2 | `Colors` | | `colors` |
| 3 | `Typography` | | `typography` |
| 4 | `Layout` | `Layout & Spacing` | `spacing` |
| 5 | `Elevation & Depth` | `Elevation` | |
| 6 | `Shapes` | | `rounded` |
| 7 | `Components` | | `components` |
| 8 | `Do's and Don'ts` | | |

順序不對時，linter 的 `section-order` 規則會發出 warning，見 [檢查規則](/design-md/linting-rules/)。

### Overview

別名 `Brand & Style`。整體描述產品的外觀與感覺：品牌個性、目標使用者、介面要喚起的情緒。某條規則或 token 沒有定義時，這一節就是 agent 的基礎依據。

```markdown
## Overview
A quiet, unhurried interface for booking tables at a riverside tea house.
Generous spacing, soft paper tones and large, easy-to-tap time slots.
```

### Colors

定義設計系統的調色盤。至少應該定義 `primary` 調色盤；其他調色盤可以自由命名，常見的慣例是 `primary`、`secondary`、`tertiary`、`neutral`。

```markdown
## Colors

The palette pairs deep tea green with warm paper neutrals and one clay accent.

- **Primary (#1F3A2E):** Riverside Tea Green for headlines, main buttons and key text.
- **Secondary (#6E6254):** Roasted oolong brown for captions, borders and metadata.
- **Tertiary (#C8553D):** Clay red, reserved for links and the booking highlight.
- **Neutral (#F6F1E7):** Rice paper background.
```

token：`map<string, Color>`，token 名稱對應到 hex 值。

```yaml
colors:
  primary: "#1F3A2E"
  secondary: "#6E6254"
  tertiary: "#C8553D"
  neutral: "#F6F1E7"
```

### Typography

定義字體排印的層級。大多數設計系統有 9 到 15 個層級，每個層級有語意角色（headline、body、label）和大小變化（small、medium、large）。

```markdown
## Typography

- **Headlines:** Noto Serif TC Semi-Bold for a calm, literary voice.
- **Body:** Noto Sans TC Regular at 16px with generous line height.
- **Labels:** Noto Sans TC Medium at 13px for times, prices and table numbers.
```

token：`map<string, Typography>`，token 名稱對應到字體排印屬性。

```yaml
typography:
  headline-lg:
    fontFamily: Noto Serif TC
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  body-md:
    fontFamily: Noto Sans TC
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label-md:
    fontFamily: Noto Sans TC
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.05em
```

### Layout

別名 `Layout & Spacing`。說明版面與間距策略：格線模型、間距級距、內容容器的配置原則。

```markdown
## Layout

Phones use a single fluid column; desktop uses a centered column
with a maximum width of 960px. Spacing follows an 8px scale.
```

token：`map<string, Dimension | number>`，間距級距的名稱對應到一個尺寸，或無單位的數字（例如欄數或比例）。

```yaml
spacing:
  base: 16px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  gutter: 20px
  columns: 12
```

### Elevation & Depth

別名 `Elevation`。說明怎麼表現視覺層級。用陰影的設計，在這裡定義陰影屬性；平面設計則說明替代做法，例如邊框、色調分層、顏色對比。front matter 的 schema 沒有這一節專用的 token 群組。

```markdown
## Elevation & Depth

No shadows. Depth comes from tone: the page is rice paper,
cards are pure white with a thin brown outline.
```

### Shapes

說明視覺元素的形狀：圓角、邊緣處理與整體形狀語言。

```markdown
## Shapes

Buttons and cards use a soft 10px radius; chips are fully rounded.
Nothing has sharp corners.
```

token：`map<string, Dimension>`，級距名稱對應到圓角半徑。

```yaml
rounded:
  sm: 4px
  md: 10px
  lg: 16px
  full: 9999px
```

### Components

元件的樣式準則。規格定義了常見的元件類型：Buttons、Chips、Lists、Inputs、Checkboxes、Radio buttons、Tooltips；設計系統可以再定義自己領域需要的元件。

```markdown
## Components
- **Buttons**: 10px radius, primary is a solid tea-green fill with white text
- **Chips**: Fully rounded, rice paper fill, brown text, used for time slots
- **Inputs**: 1px brown outline on white, 12px padding
```

token：`map<string, map<string, string>>`，元件名稱對應到一組 sub-token 屬性。值可以是字面值，也可以是指向先前定義的 token 的參照。

**狀態變化：** 元件在不同 UI 狀態（hover、active、pressed）下的樣式，寫成另一個元件項目，鍵名和原元件相關。

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.tertiary}"
```

#### 元件的屬性

| 屬性 | 類型 |
| --- | --- |
| `backgroundColor` | Color |
| `textColor` | Color |
| `typography` | Typography |
| `rounded` | Dimension |
| `padding` | Dimension |
| `size` | Dimension |
| `height` | Dimension |
| `width` | Dimension |

### Do's and Don'ts

實用的準則與常見錯誤，產生畫面時用來約束設計做法。

```markdown
## Do's and Don'ts

- Do keep clay red for links and the single booking highlight on each screen
- Don't add drop shadows to cards
- Do maintain WCAG AA contrast (4.5:1 for normal text)
- Don't use more than two font weights on one screen
```

## 遇到未知內容時

規格本來就預期被擴充。讀取 DESIGN.md 的程式遇到規格沒有定義的內容時，應該這樣處理：

| 情況 | 處理方式 | 例子 |
| --- | --- | --- |
| 未知的章節標題 | 保留，不報錯 | `## Iconography` |
| 未知的顏色 token 名稱 | 值有效就接受 | `surface-container-high: '#ede7dd'` |
| 未知的字體排印 token 名稱 | 當作有效的字體排印接受 | `telemetry-data` |
| 未知的間距值 | 接受；不是有效尺寸時存成字串 | `grid-columns: '5'` |
| 未知的元件屬性 | 接受，但發出警告 | `borderColor` |
| 重複的章節標題 | 錯誤，拒絕整個檔案 | 兩個 `## Colors` 標題 |

`@google/design.md` linter 的 `broken-ref` 規則會把未知的元件屬性名稱以 error 回報，見 [檢查規則](/design-md/linting-rules/)。

## 儲存庫 README 的寫法

DESIGN.md 的開放原始碼儲存庫 `google-labs-code/design.md` 在 README 裡附了一份精簡版規格（完整版在儲存庫的 `docs/spec.md`）。README 寫明格式版本是 `alpha`，規格、token schema 和 CLI 都還在積極開發，格式會隨之改變。

### 和 Stitch 文件不同的地方

| 項目 | Stitch 文件 | 儲存庫 README |
| --- | --- | --- |
| token 放在哪裡 | 檔案開頭的 YAML front matter | front matter，或穿插在各個 `##` 章節裡的 `yaml` 程式碼區塊 |
| Color 的格式 | `#` 加 hex 色碼（sRGB） | 任何 CSS 顏色：hex、`rgb()`、`oklch()`、具名顏色等，例如 `"oklch(62% 0.18 250)"` |
| token 類型 | Color、Dimension、Token Reference、Typography | 另有 Duration（數字加 `ms`，例如 `250ms`）與 Motion（含 `duration`、`delay`、`timingFunction` 的物件） |
| 頂層鍵 | `version`、`name`、`description`、`colors`、`typography`、`rounded`、`spacing`、`components` | 另有選用的 `omitted`（刻意省略的章節清單）和 `motion` |
| token 分組 | 沒有分組的寫法 | `colors`、`typography`、`rounded`、`spacing` 可以再包一層選用的群組 |
| 章節 | 8 個 | 10 個：在 `Shapes` 與 `Components` 之間多了第 7 節 `Motion & Micro-interaction`（別名 `Motion & Micro-interactions`、`Motion`）和第 8 節 `Voice & Content Strategy` |
| 章節順序 | 出現的章節應該（should）照順序 | 出現的章節必須（must）照順序 |

### README 的 schema

```yaml
version: <string>          # optional, current: "alpha"
name: <string>
description: <string>      # optional
omitted: <string[] | OmittedSection[]> # optional, list of sections to intentionally omit
colors:
  <token-name>: <Color>
  <group-name>:            # optional nested group
    <token-name>: <Color>
typography:
  <token-name>: <Typography>
  <group-name>:            # optional nested group
    <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
  <group-name>:            # optional nested group
    <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
  <group-name>:            # optional nested group
    <scale-level>: <Dimension | number>
motion:
  <token-name>: <Motion>
components:
  <component-name>:
    <token-name>: <string | token reference>
```

分組後的 token 用點號路徑參照，例如 `{colors.light.surface}`、`{typography.sm.headline-lg}`。

### 外部參照

README 說 `Components` 章節可以在行內程式碼裡寫 `@<path>[#<fragment>]`，指向元件的進一步說明，例如 HTML 元件範本或 JSX 原始碼：

```markdown
## Components

- **Buttons** → `@components/button.html` — `button-primary`, `button-primary-hover`
- **Chips** → `@ui/Chip.jsx` — `chip`, `chip-selected`
```

### README 多列的未知內容處理

除了上面「遇到未知內容時」表裡的情況，README 還列了這些：

| 情況 | 處理方式 |
| --- | --- |
| 未知的 motion token 名稱 | 當作有效的 motion 接受 |
| 分組的 token 子對應 | 攤平成以點號分隔的 token 路徑 |
| 不分組與分組的 token 名稱衝突 | 錯誤，拒絕衝突的 token |
| 內文裡的外部 `@` 參照 | 保留，需要時才解析被參照的檔案 |
| 不支援的檔案類型帶了外部 `@` 參照片段 | 忽略片段、改用整個檔案，不當成壞掉的參照 |
| 重複的頂層 YAML 鍵 | 錯誤，拒絕整個檔案 |

## 建議的 token 名稱

下列名稱在各設計系統中很常見。不是必要的，用來維持一致。

| 群組 | 名稱 |
| --- | --- |
| Colors | `primary`、`secondary`、`tertiary`、`neutral`、`surface`、`on-surface`、`error` |
| Typography | `headline-display`、`headline-lg`、`headline-md`、`body-lg`、`body-md`、`body-sm`、`label-lg`、`label-md`、`label-sm` |
| Rounded | `none`、`sm`、`md`、`lg`、`xl`、`full` |
