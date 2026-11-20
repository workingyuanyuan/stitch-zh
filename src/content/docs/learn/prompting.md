---
title: 提示詞寫法
description: 先用一句話或一段描述起頭，再逐個畫面用具體、小幅度的提示詞修改設計。
appliesTo: Stitch 網頁版（2026-11-20）
caveat: 修改設計時，每個提示詞只針對一個畫面或元件，做一到兩項調整；例外是 Variations，適合一次做大幅改動。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Effective Prompting
    url: https://stitch.google.com/docs/learn/prompting/
---

## 起頭：概略或詳細

可以從一個大方向開始，也可以一開始就寫出細節。App 比較複雜時，先寫概略的版本，再逐個畫面補細節。

概略的寫法只給一個想法：

```text
An app for night market food lovers.
```

詳細的寫法把核心功能寫出來，初稿的方向會更明確：

```text
An app for night market food lovers to find stalls near them, save favourites, read short reviews, and plan a route for the evening.
```

第二段提示詞描述一個夜市美食 App：找附近攤位、收藏、看短評、規劃當晚路線。

## 用形容詞定調

形容詞用來定義 App 給人的感覺，會影響配色、字體與圖片。

```text
A warm and playful app for ordering bubble tea.
```

```text
A calm and minimal app for tracking daily reading.
```

第一段是溫暖、活潑的手搖飲點餐 App；第二段是沉靜、極簡的閱讀紀錄 App。

## 逐個畫面修改

指令清楚、具體時，Stitch 的結果最好。寫明改什麼、怎麼改。

```text
On the checkout screen, make the "Place order" button full width and use the brand's primary orange.
```

| 提示詞片段 | 作用 |
| --- | --- |
| `On the checkout screen` | 指定畫面 |
| `the "Place order" button` | 指定元件 |
| `full width` | 具體的視覺變更 |
| `the brand's primary orange` | 引用品牌主題裡的顏色 |

描述某個特定畫面時，把它的用途和想要的樣子一起寫進去：

```text
A booking page for a bike rental shop in Hualien. Use a friendly rounded typeface and sky-blue buttons on a white background. The shop rents road bikes and e-bikes by the day.
```

這段提示詞要一個花蓮單車出租店的預約頁：親切的圓體字、白底配天藍色按鈕，並說明店裡按日出租公路車與電動輔助車。

## 指定圖片的風格

圖片的風格和內容也可以用提示詞引導。

```text
For the Qixing Main Peak trail page, use a wide sunrise photo of silver grass along the ridge as the cover, and pick the page's colours from that photo.
```

這段提示詞指定七星山主峰步道頁的封面：日出時用廣角拍攝的稜線與芒草，並要求頁面的顏色取自這張照片。

## 控制主題

| 目標 | 提示詞範例 |
| --- | --- |
| 指定顏色 | `Make deep teal the primary color.` |
| 用氛圍描述配色 | `Pick a cool, calm palette for the whole theme.` |
| 字體風格 | `Set all body text in a rounded sans-serif.` |
| 只改標題字體 | `Use a serif typeface for headings only.` |
| 按鈕樣式 | `Round the corners of every button completely.` |
| 輸入框邊框 | `Outline input fields with a thin dark gray line.` |
| 一次設定字體與顏色 | `Across the app, pair a serif text font with a soft terracotta accent.` |

## 修改圖片

先讓 Stitch 知道是哪一張圖片：用 App 內容裡的字詞描述它。

修改一類圖片：

```text
Use a light gray background for every product photo on the home page.
```

修改某一張圖片：

```text
On the "About" page, find the photo of a barista pouring tea and make the counter white marble.
```

| 提示詞片段 | 作用 |
| --- | --- |
| `On the "About" page` | 指出位置 |
| `the photo of a barista pouring tea` | 描述要找的圖片內容 |
| `make the counter white marble` | 修改指示 |

更改主題顏色時，寫明圖片是否要跟著改：

```text
Switch the theme to soft blue, and recolor the photos and icons to match.
```

## 更換介面文字的語言

用一個提示詞就能把商品文案和按鈕文字換成另一種語言。Stitch 文件的範例是換成西班牙文（Spanish）；下面的提示詞把目標語言改成繁體中文：

```text
Translate every product description and button label in the app into Traditional Chinese.
```

## 寫提示詞的習慣

- 寫得清楚、簡短，避免模稜兩可。
- 一次只做一項主要修改，比較容易看出影響，也方便調整。這個原則的例外是[變化版本（Variations）](/learn/variants/)，那裡適合一次做大幅改動。
- 使用 UI/UX 用語，例如 navigation bar、call-to-action button、card layout。
- 明確指出元件，例如 primary button on the sign-up form、image in the hero section。
- 結果不對時，換個說法，或更明確地指出要修改的元件，再試一次。
