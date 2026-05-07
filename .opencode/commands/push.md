---
description: 快速 add/commit/push 到远程仓库
---

执行以下步骤将当前变更提交并推送到远程仓库：

1. 根据你对当前变更的了解，生成一个简洁的 commit message
2. 执行 `git add .`
3. 执行 `git commit -m "<生成的message>"`
4. 执行 `git push`（如果是新分支首次推送，使用 `git push --set-upstream origin <branch>`）

注意：如果工作区干净无变更，直接告知用户。
