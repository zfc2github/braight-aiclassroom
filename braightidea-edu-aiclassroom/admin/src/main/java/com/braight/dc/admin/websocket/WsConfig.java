package com.braight.dc.admin.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket配置类
 *
 * @author Shine
 * @date 2026/1/15
 */
@Configuration
@EnableWebSocketMessageBroker
public class WsConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/api/classroom-websocket")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // 允许使用SockJS协议，兼容老浏览器
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app"); // 设置应用程序目标前缀，用于客户端向服务器发送消息
        registry.enableSimpleBroker("/topic", "/queue"); // 启用简单消息代理，用于向客户端广播消息
//        registry.setUserDestinationPrefix("/user");
    }

    /*@Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && SimpMessageType.CONNECT.equals(accessor.getMessageType())) {
                    try {
                        // 从 header 或 query 参数获取认证信息
                        String authorization = accessor.getFirstNativeHeader("Authorization");
                    } catch (Exception e) {
                        // 认证失败，拒绝连接
                        throw new RuntimeException("Authentication failed", e);
                    }
                }
                return message;
            }
        });
    }*/
}
