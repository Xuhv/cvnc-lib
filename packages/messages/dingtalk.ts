/**
 * 钉钉自定义机器人消息
 * 
 * Dingtalk custom robot message
 * 
 * ```ts
 * await send("webHookUrl", "secret", { msgtype: "text", text: { content: "Hello~" } })
 * ```
 * 
 * @module
 */

import crypto from "node:crypto";

function signature(secret: string, content: string) {
    const str = crypto.createHmac("sha256", secret).update(content)
        .digest()
        .toString("base64");
    return encodeURIComponent(str);
}

/**
 * @see https://open.dingtalk.com/document/orgapp/customize-robot-security-settings
 */
export function send(webHookUrl: string, secret: string, msg: DingtalkMessage): Promise<Response> {
    const timestamp = new Date().getTime();
    const sign = signature(secret, `${timestamp}\n${secret}`);
    const url = `${webHookUrl}&timestamp=${timestamp}&sign=${sign}`;
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(msg),
    });
}

type AtInfo = { atMobiles: string[]; atUserIds: string[]; isAtAll: boolean };

type TextMessage = { at?: AtInfo; text: { content: string }; msgtype: "text" };

type LinkMessage = {
    msgtype: "link";
    link: { text: string; title: string; picUrl: string; messageUrl: string };
};

type MarkdownMessage = {
    msgtype: "markdown";
    markdown: { title: string; text: string };
    at?: AtInfo;
};

type ActionCardMessage = {
    actionCard: {
        title?: string;
        text: string;
        btnOrientation: string;
        singleTitle?: string;
        singleURL?: string;
        btns?: { title: string; actionURL: string }[];
    };
    msgtype: "actionCard";
};

type FeedCardLink = { title: string; messageURL: string; picURL: string };

type FeedCardMessage = {
    msgtype: "feedCard";
    feedCard: { links: FeedCardLink[] };
};

type DingtalkMessage =
    | TextMessage
    | LinkMessage
    | MarkdownMessage
    | ActionCardMessage
    | FeedCardMessage;
