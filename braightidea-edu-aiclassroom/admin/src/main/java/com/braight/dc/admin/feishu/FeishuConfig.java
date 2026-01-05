package com.braight.dc.admin.feishu;

import com.lark.oapi.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Shine
 * @date 2025/12/24
 */
@Configuration
public class FeishuConfig {
    @Value("${feishu.app-id}")
    private String appId;
    @Value("${feishu.app-secret}")
    private String appSecret;

    @Bean
    public Client feishuClient() {
        return Client.newBuilder(appId, appSecret).build();
    }
}
