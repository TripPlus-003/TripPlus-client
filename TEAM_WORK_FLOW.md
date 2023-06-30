# Team Work Flow

## Git setting
請依照您的作業系統針對版本控制換行字元同步做設定。

**Windows**

`git config --global core.autocrlf true`

`git config --global core.safecrlf true`

**Unix-like**

`git config --global core.autocrlf input`

`git config --global core.safecrlf true`

## Github Flow and Branches

### Branch

- 主分支：main
- 開發分支：development，基於 main 創建，用 pull request 併入 main
- 功能分支：feature，基於 development 創建，用 pull request 併入 development
- 錯誤分支
  - hotfix，基於 main 創建，用 pull request 併入 main
  - feature/fix-xxx，基於 development 創建，用 pull request 併入 development

### Commits

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: 持續整合 (Continuous integration)
- **docs**:文件（documentation）
- **feat**: 新增或修改功能（feature）
- **fix**: 修補 bug（bug fix）
- **perf**: 改善效能 (Optimization/performance improvement)
- **refactor**: 重構
    - 不是新增功能，也非修補 bug 的程式碼變動
- **test**: Adding missing tests or correcting existing tests
- **style**: 與格式有關
    - 不影響程式碼運行的變動，例如：white-space, formatting, missing semi colons
- **workflow**: 工作流改善 (Workflow improvements)
- **types**:  改變檔案的類型定義 (Type definition file changes)
- **chore**: maintain
    - 不影響程式碼運行，建構程序或輔助工具的變動，例如修改 config、Grunt Task 任務管理工具
- **revert**: 撤銷回覆先前的 commit