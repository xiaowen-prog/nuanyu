# 协作规范（7 人小队）

适用仓库：AI 桌宠 / 榜样复盘。目标：少冲突、当天能合、每周能发。

## 1. 角色（开干前先认领）

| 角色 | 人数 | 职责 |
|------|------|------|
| 发布负责人 | 1 | 管发版窗口、打 tag、写发版说明 |
| 架构守门 | 1 | 公共接口、目录结构、依赖变更说了算；跨模块 PR 必审 |
| 模块负责人 | 其余 5 | 认领下表模块，本模块 PR 优先审 |

模块边界（按仓库目录认领，改 README 同步更新）：

| 模块 | 目录建议 | 负责人 |
|------|----------|--------|
| 桌宠壳 / UI | `electron/`、`pet.html`、前端资源 | （填名字） |
| 复盘对话 / Agent | `agent/`、prompt、原则蒸馏 | （填名字） |
| 记忆与本地存储 | `memory/`、SQLite / localStorage 封装 | （填名字） |
| 数据与指标 | `metrics/`、埋点、周报卡片 | （填名字） |
| 文档与规范 | `docs/`、本文件、PR 模板 | （填名字） |

一人可兼两模块；**公共契约**（接口字段、原则卡 JSON schema）变更必须架构守门 + 相关模块负责人双审。

## 2. 分支模型

```
main          ← 可发布；受保护，禁止直接 push
develop       ← 日常集成；功能先合这里
feature/*     ← 新功能（短命）
fix/*         ← 非紧急修 bug
hotfix/*      ← 线上紧急修（从 main 拉）
release/*     ← 发版冻结（只修 bug）
```

命名：

- `feature/<谁>-<简述>` 例：`feature/zhang-nightly-review`
- `fix/<谁>-<简述>`
- `hotfix/<简述>`
- `release/v1.2.0`

规则：

1. 禁止在 `main` / `develop` 上直接开发。
2. 分支寿命尽量 **≤ 3 天**；超 3 天必须 rebase 一次最新 `develop`。
3. 合完立刻删远程分支。
4. 同一文件大改：先在群里喊一声「我锁 `agent/prompt.ts` 到周五」，避免两人同改。

## 3. 日常开发流程（每人每天）

```bash
# 1. 从最新 develop 开分支
git fetch origin
git checkout develop
git pull origin develop
git checkout -b feature/你的名字-功能简述

# 2. 小步提交（一次一个意图）
git add …
git commit -m "feat: 晚间三问复盘入口"

# 3. 推远程并开 PR（目标分支 = develop）
git push -u origin HEAD
# 在 GitHub/GitLab 开 PR → base: develop
```

Commit 前缀（Conventional Commits）：

- `feat:` 新功能
- `fix:` 修 bug
- `docs:` 文档
- `refactor:` 重构（行为不变）
- `test:` 测试
- `chore:` 工具 / 依赖 / CI

## 4. Pull Request 规矩

**必须：**

- 用仓库自带 PR 模板填完再 @ 审查人
- 至少 **1 个 Approve**；改公共模块 / schema / 发版相关 → **2 个**（含架构守门）
- CI 全绿才能合
- 合之前本地：

```bash
git fetch origin
git rebase origin/develop
# 有冲突：自己解决 → git add → git rebase --continue
git push --force-with-lease
```

**不要：**

- PR 挂超过 **48 小时**（审查人或作者当天推进）
- 一个 PR 塞多个无关功能
- 用 `git push --force`（没有 lease）推共享分支
- 审查人只说「LGTM」不看：至少跑通作者写的验证步骤，或指出具体风险

**合入方式：** prefer **Squash merge** 进 `develop`（历史干净）；`release` → `main` 用 merge commit 保留发版节点。

## 5. 版本与发版

语义化版本：`主.次.补丁`（例 `1.2.3`）

- 破坏兼容 / 数据迁移不兼容 → 主版本 +1
- 新功能、兼容旧数据 → 次版本 +1
- 只修 bug → 补丁 +1

### 周发版（固定窗口，建议周五）

1. 发布负责人从 `develop` 开：`release/vX.Y.Z`
2. 只收 bugfix，**禁止塞新功能**
3. 跑通发版 checklist（见下）
4. PR：`release/vX.Y.Z` → `main`，双人审
5. 合入后：

```bash
git checkout main
git pull
git tag -a vX.Y.Z -m "release: vX.Y.Z"
git push origin main --tags
```

6. 把 `main` 合回 `develop`，避免分叉
7. 在 Releases 页贴发版说明（从 `feat`/`fix` commit 生成）

### 热修（线上挂了）

```bash
git checkout main && git pull
git checkout -b hotfix/简述
# 修 → PR → main（双审）→ 打补丁 tag
# 再 cherry-pick / merge 回 develop
```

### 发版 checklist（贴进 PR）

- [ ] 核心路径手测：开宠 → 晚间 3 问 → 出判断卡 → 次晨追问（可 mock）
- [ ] 原则卡 JSON 仍符合 schema；有迁移则写了迁移步骤
- [ ] 无密钥 / 个人数据进仓库
- [ ] CHANGELOG 或 Release 草稿已写
- [ ] 版本号已改（若项目有 `package.json` / 关于页）

## 6. 代码整理（防 7 人搅成一锅粥）

1. **目录即边界**：跨目录改动写在 PR「影响面」；架构守门有权要求拆 PR。
2. **接口先于实现**：改 Agent / 记忆契约，先提一个只含类型 / schema 的 PR，再提实现。
3. **每周 15 分钟清理会**：删废弃分支、关掉僵尸 PR、核对模块负责人是否还对。
4. **大文件 / 生成物**：截图、模型权重、本地 DB 进 `.gitignore`，不要 commit。

## 7. 冲突与升级

| 情况 | 怎么处理 |
|------|----------|
| 文本冲突 | 作者 rebase 自解；解不了找「后改的人」当面 10 分钟定 |
| 产品分歧（做不做某功能） | 不在 PR 里吵；开 issue，产品/你拍板后再改代码 |
| 公共模块两人都要大改 | 架构守门排期，串行，不并行硬刚 |
| CI 红 | 禁止「先合再说」；谁推红谁修 |

## 8. 第一天落地清单（仓库管理员做一次）

- [ ] 建好 `main`、`develop`，默认分支可先 `develop`
- [ ] 打开 Branch protection：`main` / `develop` 禁止 force push；`main` 要求 PR + 1～2 审
- [ ] 放入本文件 `CONTRIBUTING.md` 与 `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] 填上表「模块负责人」名字，钉在群公告
- [ ] （可选）加最简 CI：install → lint → test
- [ ] 全员读完本文件，回复「已读」；不读不给写权限

---

有问题先搜本文件，再问架构守门。规范本身也走 PR 改，别口头改规矩。
