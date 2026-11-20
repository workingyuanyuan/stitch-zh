---
title: 循環建站：stitch-loop
description: stitch-loop 用接力棒檔案一頁一頁產生整個網站，並自動串好頁面之間的導覽。
appliesTo: Stitch Agent Skills（2026-11-20）
caveat: 每執行一次只產生一頁；要用同一個提示詞重複執行，由 .stitch/next-prompt.md 這個接力棒檔案帶出下一頁。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Build in a loop
    url: https://stitch.google.com/docs/skills/build-in-a-loop/
---

## 接力棒循環怎麼運作

`stitch-loop` 一頁一頁自動產生整個網站。你先定好網站的方向和設計系統，其餘交給這個 Skill：產生每一頁、串好導覽，再排好下一個工作。

核心是一個接力棒檔案 `.stitch/next-prompt.md`，寫著目前要產生的頁面。每產生完一頁，Skill 就把下一個工作寫回接力棒，循環就能一直走下去。

| Skill 管理的狀態檔 | 用途 |
| --- | --- |
| `.stitch/next-prompt.md` | 目前的工作（接力棒） |
| `.stitch/SITE.md` | 網站方向、網站地圖與後續規劃 |
| `.stitch/DESIGN.md` | 設計系統，讓各頁的視覺一致 |
| `.stitch/metadata.json` | Stitch 專案 ID 與畫面 ID |

以下範例是阿里山一家茶園的網站。

## 步驟 1：定義網站方向

建立 `.stitch/SITE.md`，描述這個網站：

```markdown
# Site: Cloud Ridge Tea Garden

## Vision
A 5-page website for a family-run oolong tea garden in Alishan.

## Sitemap
- [ ] index — Landing page with a misty hillside hero and this season's harvest
- [ ] story — Three generations of the family and how they process tea
- [ ] teas — Tea list grouped by roast level, with prices per 150 g
- [ ] visit — Tea tasting visits with a map and directions from Chiayi
- [ ] contact — Contact form and opening hours
```

`Sitemap` 用核取方塊列出每一頁；Skill 每產生完一頁就更新它。

## 步驟 2：建立設計系統

產生任何頁面之前，先定下視覺的一致性。建議的做法是用 `taste-design` 產生一份設計系統：

```text
Cloud Ridge sells hand-roasted Alishan oolong to buyers who care about craft. With the taste-design skill, write a DESIGN.md that feels quiet and unhurried, like early morning on the mountain.
```

這段提示詞先說明品牌（賣手工焙火阿里山烏龍茶、客群重視工藝），再請 `taste-design` 寫一份像山上清晨一樣安靜從容的 DESIGN.md。

已經有網站時，也可以從現有程式碼擷取：

```text
Our old website's code is in ./old-site/src. Record its colors, fonts and spacing in .stitch/DESIGN.md
```

這段提示詞請 agent 從 `./old-site/src` 的舊網站程式碼整理出顏色、字體與間距，記在 `.stitch/DESIGN.md`。

## 步驟 3：建立第一個接力棒檔案

為第一頁建立 `.stitch/next-prompt.md`：

```markdown
---
page: index
---
A calm, airy landing page for Cloud Ridge Tea Garden.

**DESIGN SYSTEM (REQUIRED):**
[Paste from .stitch/DESIGN.md]

**Page Structure:**
1. Header with the garden's name and navigation links to story, teas, visit, contact
2. Hero section: the tea terraces at dawn behind one short line about the garden, with a Book a tasting button
3. This season's harvest: the spring and winter teas side by side, each with roast level and price
4. A strip of three photos from the tasting room
5. Footer with opening hours, the farm address in Alishan, and a link to the booking form
```

| 部分 | 作用 |
| --- | --- |
| frontmatter 的 `page` | 這次要產生的頁面，這裡是 `index` |
| `**DESIGN SYSTEM (REQUIRED):**` | 貼上 `.stitch/DESIGN.md` 的內容 |
| `**Page Structure:**` | 依序編號的頁面區塊 |

## 步驟 4：執行循環

```text
Using .stitch/next-prompt.md as the baton, execute the stitch-loop build cycle.
```

這段提示詞請 agent 以 `.stitch/next-prompt.md` 為接力棒，執行一輪 `stitch-loop`。

每一輪，Skill 會：

1. 透過 Stitch 產生畫面。
2. 下載 HTML 與截圖。
3. 把 HTML 移到 `site/public/`。
4. 更新網站地圖。
5. 寫下下一根接力棒。

之後每一頁都用同一個提示詞再執行一次，接力棒會推動循環往下走。

## 導覽與一致性

Skill 會自動串好各頁之間的內部連結，把新頁面加進全站導覽，並讓頁首與頁尾保持一致。

產生幾頁後導覽開始不一致時：

```text
The navigation has drifted between pages. Give every page the same header, with links to index, story, teas, visit and contact.
```

這段提示詞指出各頁導覽已不一致，請 agent 讓每一頁用同一個頁首，連到這五頁。

## 讓結果更好

| 做法 | 原因 |
| --- | --- |
| 修改，不要重新產生 | 頁面大致符合需求、仍需調整時，針對性的修改比從頭來保留更多脈絡 |
| 檢查設計系統 | 視覺走樣通常是提示詞裡沒有放 DESIGN.md |
| 比對截圖 | 產生幾頁後，請 agent 比較各頁的視覺是否一致 |

## 推動循環的方式

| 方式 | 做法 |
| --- | --- |
| 手動 | 用同一個提示詞重複執行 agent |
| 人工把關（Human-in-loop） | 每一頁都先檢查再繼續 |
| CI/CD | 在 `.stitch/next-prompt.md` 有變動時觸發 |
| Agent 串接 | 一個 agent 透過接力棒檔案把工作交給另一個 agent |
