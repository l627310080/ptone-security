package com.ptone.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 消息枚举类型
 */
@Getter
@AllArgsConstructor
public enum MsgEnum {
    WECHAT(1,"微信"),
    SMS(2,"短信"),
    EMAIL(3,"邮件");

    private Integer code;
    private String message;

}
