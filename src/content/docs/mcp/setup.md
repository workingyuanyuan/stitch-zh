---
title: MCP 設定與驗證
description: 把遠端 Stitch MCP 伺服器接到 Cursor、Claude Code 等 AI 工具，用 API key 或 OAuth 驗證。
appliesTo: Stitch MCP（2026-11-20）
caveat: OAuth 的存取權杖通常一小時就過期；多數 MCP 用戶端不讀 .env，過期後要手動把新權杖貼回設定檔。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Stitch via MCP
    url: https://stitch.google.com/docs/mcp/setup/
  - title: Stitch Docs：Reference（MCP）
    url: https://stitch.google.com/docs/mcp/reference/
---

## Stitch MCP 是遠端伺服器

Stitch MCP（Model Context Protocol）伺服器讓 Cursor、Antigravity、Gemini CLI 等 AI 工具直接操作你的 Stitch 專案。

| 項目 | 多數 MCP 伺服器 | Stitch MCP |
| --- | --- | --- |
| 類型 | Local（本機） | Remote（遠端） |
| 在哪裡執行 | 你的電腦，讀硬碟上的檔案、執行本機指令碼 | 雲端 |

Stitch MCP 的網址是 `https://stitch.googleapis.com/mcp`。因為伺服器在雲端，代替你操作的 AI agent 必須先通過驗證，證明它有權修改你的設計。

## 選擇驗證方式：API key 或 OAuth

| 方式 | 是什麼 |
| --- | --- |
| API key | 在 [Stitch 設定頁](https://stitch.google.com/settings)產生、長期有效的金鑰 |
| OAuth | 透過瀏覽器登入的驗證流程 |

多數情況用 API key 最簡單、最快接上。下列情況值得多花一分鐘設定 OAuth：

| 考量 | 用 API key | 用 OAuth |
| --- | --- | --- |
| 用戶端支援 | 工具可以在設定檔或環境變數裡填 API key，例如 Cursor、Antigravity、Gemini CLI | 工具（例如網頁型工具）只提供登入流程，無法手動輸入金鑰 |
| 存放規定 | 在私人電腦上，把金鑰存在本機的 `.json` 或 `.env` 檔是常規做法 | 在 Zero-Trust 或短期使用的環境，把長期有效的金鑰存到硬碟被禁止或有風險 |
| 撤銷 | 願意到 [Stitch 設定頁](https://stitch.google.com/settings)刪除金鑰，再自己找出並移除本機檔案裡的金鑰 | 想在 [Stitch 設定頁](https://stitch.google.com/settings)「登出」就立刻讓工具失去權限，不必去找本機檔案 |
| 連線期限 | 要一直有效，直到手動更換 | 偏好以工作階段為單位的連線，可以設定過期，或閒置一段時間後要重新核准 |

## 用 API key 連線

### 1. 產生 API key

1. 開啟 [Stitch 設定頁](https://stitch.google.com/settings)。
2. 捲動到 `API Keys` 區塊。
3. 按 `Create API Key` 產生新的金鑰。
4. 複製金鑰，存到安全的地方。

### 2. 保管金鑰

- 不要把金鑰放在公開看得到的地方。
- 不要把金鑰 commit 到公開的儲存庫。
- 不要把金鑰寫進別人看得到的用戶端程式碼。

### 3. 設定 MCP 用戶端

以下設定裡的 `YOUR-API-KEY`（Claude Code 指令裡是 `api-key`）換成你自己的金鑰。

| 用戶端 | 設定位置 | 伺服器網址的鍵名 |
| --- | --- | --- |
| Gemini CLI | 安裝 Stitch 擴充功能 | — |
| Cursor | `.cursor/mcp.json` | `url` |
| Antigravity | Agent Panel 的 raw config | `serverUrl` |
| VSCode | `mcp.json` | `url`，另加 `"type": "http"` |
| Claude Code | `claude mcp add` 指令 | 指令的參數 |

#### Gemini CLI

安裝 Gemini CLI 的 [Stitch 擴充功能](https://github.com/gemini-cli-extensions/stitch)：

```shell
gemini extensions install https://github.com/gemini-cli-extensions/stitch
```

#### Cursor

建立 `.cursor/mcp.json`，內容如下：

```json
{
  "mcpServers": {
    "stitch": {
      "url": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "YOUR-API-KEY"
      }
    }
  }
}
```

#### Antigravity

1. 在 Agent Panel 右上角按三個點，選 `MCP Servers`。
2. 按 `Manage MCP Servers`。
3. 選 `View raw config`，加入下列項目：

```json
{
  "mcpServers": {
    "stitch": {
      "serverUrl": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "YOUR-API-KEY"
      }
    }
  }
}
```

#### VSCode

1. 開啟 Command Palette（`Cmd+Shift+P`），輸入 `MCP: Add Server`。
2. 選 `Add MCP Server`，再選 `HTTP`（遠端 MCP 伺服器）。
3. 輸入 Stitch MCP 網址 `https://stitch.googleapis.com/mcp`。
4. 名稱設為 `stitch`，確認。
5. 編輯 `mcp.json`，加上 API key：

```json
{
  "servers": {
    "stitch": {
      "url": "https://stitch.googleapis.com/mcp",
      "type": "http",
      "headers": {
        "Accept": "application/json",
        "X-Goog-Api-Key": "YOUR-API-KEY"
      }
    }
  }
}
```

#### Claude Code

用 `claude mcp` 指令加入伺服器：

```shell
claude mcp add stitch --transport http https://stitch.googleapis.com/mcp --header "X-Goog-Api-Key: api-key" -s user
```

## 用 OAuth 連線

OAuth 需要兩個值，讓 MCP 用戶端能和 Stitch 溝通：

| 值 | 用途 |
| --- | --- |
| Project ID | Google Cloud 專案，存放你的工作的容器 |
| Access Token | 存取權杖，短期有效，用來為這個專案完成驗證 |

### 1. 安裝 Google Cloud SDK

Stitch 的驗證靠 `gcloud` CLI。已經有就跳過這一步，沒有就選一種方式安裝。

獨立安裝：

```bash
# Download and install (simplified for standard environments)
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Set local configuration to avoid prompts
export CLOUDSDK_CORE_DISABLE_PROMPTS=1
```

用 Homebrew 安裝：

```bash
brew install --cask google-cloud-sdk
```

### 2. 登入兩次

要以兩種身分各登入一次：一次是你本人（使用者），一次是應用程式（你的本機程式碼或 MCP 用戶端）。第二次登入的 Application Default Credentials（ADC）讓 MCP 伺服器能安全地代表你。

```bash
# 1. User Login (Opens Browser)
gcloud auth login

# 2. Application Default Credentials (ADC) Login
# This allows the MCP server to "impersonate" you securely.
gcloud auth application-default login
```

### 3. 設定專案與權限

選定專案、啟用 Stitch API，並給你的帳號使用服務的權限（`roles/serviceusage.serviceUsageConsumer`）。把 `[YOUR_PROJECT_ID]` 換成你的 Google Cloud Project ID。

```bash
# Replace [YOUR_PROJECT_ID] with your actual Google Cloud Project ID
PROJECT_ID="[YOUR_PROJECT_ID]"

gcloud config set project "$PROJECT_ID"

# Enable the Stitch API
gcloud beta services mcp enable stitch.googleapis.com --project="$PROJECT_ID"

# Grant Service Usage Consumer role
USER_EMAIL=$(gcloud config get-value account)
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="user:$USER_EMAIL" \
    --role="roles/serviceusage.serviceUsageConsumer" \
    --condition=None
```

### 4. 產生權杖，存進 .env

這段指令會覆寫目前資料夾裡已有的 `.env` 檔。

```bash
# Print the token
TOKEN=$(gcloud auth application-default print-access-token)

# Note: This overwrites any existing .env file
echo "GOOGLE_CLOUD_PROJECT=$PROJECT_ID" > .env
echo "STITCH_ACCESS_TOKEN=$TOKEN" >> .env

echo "Secrets generated in .env"
```

### 5. 權杖過期時更新

存取權杖是暫時的，通常約一小時有效。MCP 用戶端沒有回應或回報 `Unauthenticated` 時：

1. 重新執行步驟 4 的指令，更新 `.env`。
2. 把 `.env` 裡新的 `STITCH_ACCESS_TOKEN` 值複製到 MCP 用戶端的設定檔。

多數 MCP 用戶端不會自動讀 `.env`，所以每次權杖過期，都要手動更新設定檔裡的 `Authorization` 標頭。

### 6. 設定 MCP 用戶端

把下列設定裡的預留位置換成 `.env` 裡的值：

| 預留位置 | 換成 `.env` 裡的 |
| --- | --- |
| `<YOUR_PROJECT_ID>` | `GOOGLE_CLOUD_PROJECT` 的值 |
| `<YOUR_ACCESS_TOKEN>` | `STITCH_ACCESS_TOKEN` 的值 |

#### Cursor

建立 `.cursor/mcp.json`，內容如下：

```json
{
  "mcpServers": {
    "stitch": {
      "url": "https://stitch.googleapis.com/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_ACCESS_TOKEN>",
        "X-Goog-User-Project": "<YOUR_PROJECT_ID>"
      }
    }
  }
}
```

#### Antigravity

在 Agent Panel 右上角按三個點，選 `MCP Servers`，按 `Manage MCP Servers`，選 `View raw config`，加入：

```json
{
  "mcpServers": {
    "stitch": {
      "serverUrl": "https://stitch.googleapis.com/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_ACCESS_TOKEN>",
        "X-Goog-User-Project": "<YOUR_PROJECT_ID>"
      }
    }
  }
}
```

#### VSCode

照 API key 的 VSCode 步驟 1 到 4 加入名為 `stitch` 的 `HTTP` 伺服器，再編輯 `mcp.json`，加上標頭：

```json
{
  "servers": {
    "stitch": {
      "url": "https://stitch.googleapis.com/mcp",
      "type": "http",
      "headers": {
        "Accept": "application/json",
        "Authorization": "Bearer <YOUR_ACCESS_TOKEN>",
        "X-Goog-User-Project": "<YOUR_PROJECT_ID>"
      }
    }
  }
}
```

#### Claude Code

```shell
claude mcp add stitch \
  --transport http https://stitch.googleapis.com/mcp \
  --header "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  --header "X-Goog-User-Project: <YOUR_PROJECT_ID>" \
  -s user

# -s user: saves to $HOME/.claude.json
# -s project: saves to ./.mcp.json
```

#### Gemini CLI

和 API key 一樣，安裝 [Stitch 擴充功能](https://github.com/gemini-cli-extensions/stitch)：

```shell
gemini extensions install https://github.com/gemini-cli-extensions/stitch
```

## 連線後可用的工具

驗證完成後，AI 助理可以用下列工具管理 Stitch 工作。完整結構與欄位見 [Stitch MCP 工具參考](/mcp/reference/)，那一頁另外列出兩個 DESIGN.md 工具。

| 分類 | 工具 | 用途 | 主要參數 |
| --- | --- | --- | --- |
| 專案 | `create_project` | 建立新專案 | `title` |
| 專案 | `get_project` | 取得一個專案的詳細資料 | `name` |
| 專案 | `list_projects` | 列出專案 | `filter`（自己擁有或分享給你的） |
| 畫面 | `list_screens` | 列出專案裡的所有畫面 | `projectId` |
| 畫面 | `get_screen` | 取得一個畫面的詳細資料 | `name` |
| AI 產生 | `generate_screen_from_text` | 用文字提示詞產生新設計 | `projectId`、`prompt`、`modelId`（`GEMINI_3_FLASH` 或 `GEMINI_3_1_PRO`） |
| AI 產生 | `edit_screens` | 用文字提示詞修改現有畫面 | `projectId`、`selectedScreenIds`、`prompt` |
| AI 產生 | `generate_variants` | 為現有畫面產生變化版本 | `projectId`、`selectedScreenIds`、`prompt`、`variantOptions` |
| 設計系統 | `create_design_system` | 建立新的設計系統與基礎 design token | `designSystem`、`projectId`（選用） |
| 設計系統 | `update_design_system` | 更新現有的設計系統 | `name`、`projectId`、`designSystem` |
| 設計系統 | `list_design_systems` | 列出專案的設計系統 | `projectId`（選用） |
| 設計系統 | `apply_design_system` | 把設計系統套用到一個或多個畫面 | `projectId`、`selectedScreenInstances`（取自 `get_project`）、`assetId`（取自 `list_design_systems`） |

## 服務條款

使用 Stitch MCP 即表示同意 [Google APIs Terms of Service](https://console.cloud.google.com/tos?id=universal)。
