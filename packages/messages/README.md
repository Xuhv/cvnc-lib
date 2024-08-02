# @cvnc/messages

钉钉、飞书 自定义机器人消息

Send Dingtalk and Lark custom robot message

```ts
import { send } from "@cvnc/messages/lark";

await send("webHookUrl", "secret", { msg_type: "text", content: { text: "Hello~" } })
```
