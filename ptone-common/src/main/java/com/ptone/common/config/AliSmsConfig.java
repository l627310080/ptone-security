package com.ptone.common.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @description: 阿里短信配置类
 * @author: wangzhi
 * @create: 2019-04-03 15:50
 **/

@Data
@Component
@ConfigurationProperties(prefix = "ali-sms-config")
public class AliSmsConfig {
    private String regionId;
    private String accessKeyId;
    private String secret;
    private String signName;

    /**
     * 默认模板code
     */
    private String templateCode;
    private String meetingNoticeTemplateCode;

    private String regTemplateCode;
    private String regTemplateName;
    private String findBackPwdTemplateCode;
}

