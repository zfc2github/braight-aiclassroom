package com.braight.dc.admin.web.controller;

import cn.hutool.core.date.DateUtil;
import com.braight.master.common.annotation.Login;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * @author Shine
 * @date 2026/3/4
 */
@RestController
@RequestMapping("/api/interfaceMonitor")
public class InterfaceMonitorController extends BaseController {
  @Resource
  private JdbcTemplate jdbcTemplate;

  /**
   * 获取接口耗时 Top20 列表
   * GET /api/interfaceMonitor/top20CostTime
   * 逻辑：查询近1个月数据，按 title 去重，按 max(costTime) 倒序，取前20
   */
  @Login
  @GetMapping("/top20CostTime")
  public AjaxResult getTopCostTimeInterfaces() {
    // 计算开始时间：当前时间往前推 1 个月
    LocalDateTime startTime = LocalDate.now().minusMonths(1).atStartOfDay();

    List<Map<String, Object>> resultList = jdbcTemplate.queryForList("select\n" +
            "  title,\n" +
            "  max(cost_time) as mct\n" +
            "  from sys_oper_log \n" +
            "  where oper_time >= '"+ DateUtil.format(startTime, "yyyy-MM-dd HH:mm:ss") +"'\n" +
            "  and status = 0\n" +
            "  group by title\n" +
            "  order by mct desc\n" +
            "  limit 20");

    return success(resultList);
  }

  /**
   * 获取异常接口 Top20 列表
   * GET /api/interfaceMonitor/top20Error
   * 逻辑：查询近1个月数据，按 title 去重，按 max(costTime) 倒序，取前20
   */
  @Login
  @GetMapping("/top20Error")
  public AjaxResult getTopErrorInterfaces() {
    // 计算开始时间：当前时间往前推 1 个月
    LocalDateTime startTime = LocalDate.now().minusMonths(1).atStartOfDay();

    List<Map<String, Object>> resultList = jdbcTemplate.queryForList("select\n" +
            "  title,\n" +
            "  max(cost_time) as mct,\n" +
            "  max(error_msg) as errorMsg\n" +
            "  from sys_oper_log \n" +
            "  where oper_time >= '"+ DateUtil.format(startTime, "yyyy-MM-dd HH:mm:ss") +"'\n" +
            "  and status = 1\n" +
            "  group by title\n" +
            "  order by mct desc\n" +
            "  limit 20");

    return success(resultList);
  }

  /**
   * 获取登录失败率
   * GET /api/interfaceMonitor/loginErrorRate
   * 逻辑：查询近1个月数据
   */
  @Login
  @GetMapping("/loginErrorRate")
  public AjaxResult getLoginErrorRate() {
    // 计算开始时间：当前时间往前推 1 个月
    LocalDateTime startTime = LocalDate.now().minusMonths(1).atStartOfDay();

    List<Map<String, Object>> resultList = jdbcTemplate.queryForList("select\n" +
            "  title,\n" +
            "  status,\n" +
            "  count(1) as cnt\n" +
            "  from sys_oper_log \n" +
            "  where oper_time >= '" + DateUtil.format(startTime, "yyyy-MM-dd HH:mm:ss") + "'\n" +
            "  and title = '用户登录'\n" +
            "  and status is not null\n" +
            "  group by title, status");
    Map<String, Object> normalItem = resultList.stream().filter(item -> item.get("status").equals(0)).findFirst().orElse(null);
    Map<String, Object> errorItem = resultList.stream().filter(item -> item.get("status").equals(1)).findFirst().orElse(null);
    if (normalItem != null) {
      long normalCnt = (long) normalItem.get("cnt");
      long errorCnt = 0;
      if (errorItem != null) {
        errorCnt = (long) errorItem.get("cnt");
      }
      double errorRate = errorCnt * 100 / (double) (normalCnt + errorCnt);
      String formattedErrorRate = String.format("%.2f%%", errorRate);
      return success(formattedErrorRate);
    }

    return success("0%");
  }
}
