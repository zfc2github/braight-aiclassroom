package com.braight.dc.admin.feishuo;

import com.braight.dc.admin.web.entity.AieduLiteracyClassPO;
import com.braight.dc.admin.web.mapper.AieduLiteracyClassMapper;
import com.braight.dc.admin.web.service.FeishuFetchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author Shine
 * @date 2025/12/24
 */
@Component
@Slf4j
public class AieduLiteracyClassSyncJob {
    @Value("${feishu.app-token}")
    private String appToken;
    @Value("${feishu.table-id}")
    private String tableId;

    @Resource
    private FeishuFetchService fetchService;
    @Resource
    private AieduLiteracyClassMapper mapper;

    /**
     * 每小时同步一次
     */
    @Scheduled(cron = "0 0 0/1 * * ?")
    public void sync() {
        log.info("【AieduLiteracyClassSyncJob 同步开始】");
        try {
            List<AieduLiteracyClassPO> latest = fetchService.fetchAll(appToken, tableId);
            Set<String> latestIds = latest.stream()
                    .map(AieduLiteracyClassPO::getId)
                    .collect(Collectors.toSet());

            Set<String> localIds = mapper.selectAllRecordIds();

            // 1. 删除本地多余
            Set<String> toDel = new HashSet<>(localIds);
            toDel.removeAll(latestIds);
            if (!toDel.isEmpty()) {
                mapper.deleteByIds(toDel);
                log.info("删除多余 {} 条", toDel.size());
            }

            // 2. 批量 Upsert
            mapper.batchUpsert(latest);
            log.info("【AieduLiteracyClassSyncJob 同步结束】成功");
        } catch (Exception e) {
            log.error("AieduLiteracyClassSyncJob 同步失败", e);
        }
    }

}
