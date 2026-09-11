package com.braight.dc.admin.feishu;

import cn.hutool.core.date.DateUtil;
import com.braight.dc.admin.Application;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@SpringBootTest(classes = Application.class)
public class TempTest {

    @Resource
    private JdbcTemplate jdbcTemplate;
    @Test
    public void test() throws Exception {
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
            System.out.println(formattedErrorRate);
        }
    }
}
