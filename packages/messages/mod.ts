/**
 * 钉钉自定义机器人消息
 * 
 * Dingtalk custom robot message
 * 
 * @module
 */

import crypto from "node:crypto";


/**
 * 只支持签名加密
 * 
 * Only support signature encryption
 * 
 * @see https://open.dingtalk.com/document/orgapp/customize-robot-security-settings
 */
export class Bot {
    private base_url: string;
    private access_token: string;
    private secret: string;

    constructor(
        access_token: string,
        secret: string,
        base_url = "https://oapi.dingtalk.com/robot/send",
    ) {
        this.access_token = access_token;
        this.secret = secret;
        this.base_url = base_url;
    }

    private calculateUrl() {
        const timestamp = new Date().getTime();
        const sign = calculateSign(this.secret, `${timestamp}\n${this.secret}`);
        return `${this.base_url}?access_token=${this.access_token}&timestamp=${timestamp}&sign=${sign}`;
    }

    send(msg: DingtalkMessage): Promise<Response> {
        return fetch(this.calculateUrl(), {
            method: "POST",
            headers: { "Content-Type": "application/json;charset=utf-8" },
            body: JSON.stringify(msg),
        });
    }
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

function calculateSign(secret: string, content: string) {
    const str = crypto.createHmac("sha256", secret).update(content)
        .digest()
        .toString("base64");
    return encodeURIComponent(str);
}
