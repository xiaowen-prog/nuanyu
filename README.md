# 暖屿（nuanyu）· AI 桌宠与榜样复盘

## 新人只看这里

1. 打开仓库，点右上角 **Fork** 不用；让管理员把你加成 Collaborator。
2. 把代码拉到电脑：
   ```bash
   git clone https://github.com/xiaowen-prog/nuanyu.git
   cd ai-desktop-pet
   git checkout develop
   ```
3. 改代码前先开自己的分支（把名字换成你的）：
   ```bash
   git pull
   git checkout -b feature/你的名字-干什么
   ```
4. 改完推上去，网页上点黄色按钮 **Compare & pull request**。
5. **base** 必须选 `develop`。填完表格，点 Create。等人点 Approve 再合并。

详细规矩见 [CONTRIBUTING.md](./CONTRIBUTING.md)。不会就 @ 发布负责人。

## 分支记住三句话

- 平时合到 `develop`
- 只有发版才动 `main`
- 禁止直接往 `main` / `develop` 推代码
