package com.braight.dc.admin.web.service;

import com.alibaba.fastjson2.JSON;
import com.braight.dc.admin.web.entity.AieduLiteracyClassPO;
import com.google.gson.JsonParser;
import com.google.gson.internal.LinkedTreeMap;
import com.lark.oapi.Client;
import com.lark.oapi.core.utils.Jsons;
import com.lark.oapi.service.bitable.v1.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author Shine
 * @date 2025/12/24
 */
@Service
@Slf4j
public class FeishuFetchService {
    @Resource
    private Client client;
    private static final int PAGE_SIZE = 500;


    public List<AieduLiteracyClassPO> fetchAll(String appToken, String tableId) throws Exception {
        List<AieduLiteracyClassPO> list = new ArrayList<>();
        String pageToken = null;
        do {
            SearchAppTableRecordReq req = SearchAppTableRecordReq.newBuilder()
                    .appToken(appToken)
                    .tableId(tableId)
                    .searchAppTableRecordReqBody(
                            SearchAppTableRecordReqBody.newBuilder().build()
                    )
                    .pageSize(PAGE_SIZE)
                    .pageToken(pageToken)
                    .build();
            SearchAppTableRecordResp resp = client.bitable().v1().appTableRecord().search(req);
            if (!resp.success()) {
                log.error("飞书接口错误：{}", String.format("code:%s,msg:%s,reqId:%s, resp:%s",
                        resp.getCode(), resp.getMsg(), resp.getRequestId(), Jsons.createGSON(true, false).toJson(JsonParser.parseString(new String(resp.getRawResponse().getBody(), StandardCharsets.UTF_8)))));
                throw new RuntimeException("飞书接口错误：" + resp.getMsg());
            }
            SearchAppTableRecordRespBody data = resp.getData();
//            log.info("拉取飞书数据成功：{}", JSON.toJSONString(data));
            pageToken = data.getPageToken();
            AppTableRecord[] items = data.getItems();
            for (AppTableRecord item : items) {
                AieduLiteracyClassPO po = new AieduLiteracyClassPO();
                po.setId(item.getRecordId());
                Map<String, Object> fields = item.getFields();
                fields.forEach((k, v) -> {
                    if ("课程编号".equals(k)) {
                        po.setLessonCode(getText(v));
                    } else if ("课程名称".equals(k)) {
                        po.setTitle(getText(v));
                    } else if ("课程名称-en".equals(k)) {
                        po.setTitleEn(getText(v));
                    } else if ("课程概述".equals(k)) {
                        po.setSummary(getText(v));
                    } else if ("课程概述-en".equals(k)) {
                        po.setSummaryEn(getText(v));
                    } else if ("单元名称".equals(k)) {
                        po.setTopic(getText(v));
                    } else if ("单元名称-en".equals(k)) {
                        po.setTopicEn(getText(v));
                    } else if ("单元".equals(k)) {
                        po.setUnit(getText(v));
                    } else if ("年级".equals(k)) {
                        po.setGrade(getString(v));
                    } else if ("课程类型".equals(k)) {
                        po.setLessonType(getString(v));
                    } else if ("课程类型-en".equals(k)) {
                        po.setLessonTypeEn(getString(v));
                    } else if ("关键词".equals(k)) {
                        po.setKeyConcepts(getText(v));
                    } else if ("关键词-en".equals(k)) {
                        po.setKeyConceptsEn(getText(v));
                    } else if ("相关素养维度".equals(k)) {
                        po.setLiteracy(getMultiTextJoinDot(v));
                    } else if ("相关素养维度-en".equals(k)) {
                        po.setLiteracyEn(getMultiTextJoinDot(v));
                    } else if ("封面图URL".equals(k)) {
                        po.setCoverImage(getText(v));
                    } else if ("PPT嵌入代码".equals(k)) {
                        po.setPptCanvaCode(getText(v));
                    }
                });
                Date now = Date.valueOf(LocalDate.now());
                po.setCreateTime(now);
                po.setUpdateTime(now);
                list.add(po);
            }
        } while (pageToken != null);
        log.info("拉取飞书数据完成，共 {} 条", list.size());
        return list;
    }

    private String getString(Object v) {
        return null == v ? "" : String.valueOf(v);
    }

    private String getMultiTextJoinDot(Object v) {
        ArrayList arr = (ArrayList) v;
        if (arr == null || arr.size() == 0) {
            return "";
        }
        Object text = arr.stream()
                .collect(Collectors.joining(","));
        return getString(text);
    }

    private String getText(Object v) {
        ArrayList arr = (ArrayList) v;
        if (arr == null || arr.size() == 0) {
            return "";
        }
        Object pptHtml = arr.stream()
                .map(m -> ((LinkedTreeMap) m).get("text"))
                .collect(Collectors.joining());
        return getString(pptHtml);
    }

}
