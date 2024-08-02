/**
 * 飞书自定义机器人消息
 * 
 * Lark custom robot message
 * 
 * ```ts
 * await send("webHookUrl", "secret", { msg_type: "text", text: { content: "Hello~" } })
 * ```
 * 
 * @module
 */

import crypto from "node:crypto";

export function send(webHookUrl: string, secret: string, msg: FeishuMessage): Promise<Response> {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const sign = crypto.createHmac("sha256", `${timestamp}\n${secret}`).digest("base64");

    console.log(timestamp, sign);

    return fetch(webHookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify({ ...msg, timestamp, sign }),
    });
}

type TextMessage = {
    msg_type: "text";
    text: { content: string };
};

type PostMessage = {
    msg_type: "post";
    content: {
        post: {
            [k in "zh_cn" | "en_us"]?: {
                title: string;
                content: Array<PostMessageParagraph>
            }
        }
    }
}

type PostMessageParagraphPart =
    | { tag: "text"; text: string; un_escape?: boolean }
    | { tag: "a"; text: string; href: string }
    | { tag: "at"; user_id: string }
    | { tag: "img"; image_key: string }

type PostMessageParagraph = PostMessageParagraphPart[]

type ImageMessage = {
    msg_type: "image";
    image: { image_key: string };
}

type FeishuMessage = | TextMessage | PostMessage | ImageMessage;
