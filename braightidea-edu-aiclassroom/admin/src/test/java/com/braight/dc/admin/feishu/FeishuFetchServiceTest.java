package com.braight.dc.admin.feishu;

import com.braight.dc.admin.Application;
import com.braight.dc.admin.web.entity.AieduLiteracyClassPO;
import com.braight.dc.admin.web.mapper.AieduLiteracyClassPOMapper;
import com.braight.dc.admin.web.service.FeishuFetchService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;
import java.util.List;

@SpringBootTest(classes = Application.class)
public class FeishuFetchServiceTest {
    @Resource
    private FeishuFetchService feishuFetchService;
    @Value("${feishu.app-token}")
    private String appToken;
    @Value("${feishu.table-id}")
    private String tableId;

    @Resource
    private AieduLiteracyClassPOMapper poMapper;
    @Test
    public void test2() {
        List<AieduLiteracyClassPO> all = poMapper.selectAll();
        Assertions.assertTrue(all.size() > 0);
    }

    @Resource
    private AieduLiteracyClassSyncJob aieduLiteracyClassSyncJob;
    @Test
    public void test1() throws Exception {
        aieduLiteracyClassSyncJob.sync();
    }

    @Test
    public void test() throws Exception {
        List<AieduLiteracyClassPO> list = feishuFetchService.fetchAll(appToken, tableId);
        Assertions.assertTrue(list.size() > 0);
    }
}
