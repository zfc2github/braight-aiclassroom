package com.braight.dc.admin.web.utils;

import okhttp3.OkHttpClient;

import javax.net.ssl.*;
import java.security.cert.X509Certificate;
import java.time.Duration;

public class UnsafeOkHttpClient {
    public static OkHttpClient createUnsafeOkHttpClient() {
        try {
            // 创建一个不验证证书的TrustManager
            final TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {
                        @Override
                        public void checkClientTrusted(X509Certificate[] chain, String authType) {
                            // 不进行客户端证书验证
                        }

                        @Override
                        public void checkServerTrusted(X509Certificate[] chain, String authType) {
                            // 不进行服务器证书验证
                        }

                        @Override
                        public X509Certificate[] getAcceptedIssuers() {
                            return new X509Certificate[]{};
                        }
                    }
            };

            // 创建一个不验证主机名的HostnameVerifier
            final HostnameVerifier hostnameVerifier = new HostnameVerifier() {
                @Override
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            };

            // 创建SSLContext
            final SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

            // 创建SSLSocketFactory
            final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

            // 创建OkHttpClient
            return new OkHttpClient.Builder()
                    .sslSocketFactory(sslSocketFactory, (X509TrustManager) trustAllCerts[0])
                    .hostnameVerifier(hostnameVerifier)
                    .connectTimeout(Duration.ofSeconds(10))
                    .readTimeout(Duration.ofMinutes(2))
                    .writeTimeout(Duration.ofMinutes(2))
                    .build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}