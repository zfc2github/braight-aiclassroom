package com.braight.dc.admin.web.mapper;

import com.braight.dc.admin.web.entity.AieduLiteracyClassPO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author Shine
 * @date 2025/12/24
 */
@Repository
@Slf4j
public class AieduLiteracyClassMapper {
    @Resource
    private JdbcTemplate jdbc;

    public void truncate() {
        jdbc.update("DELETE FROM aiedu_literacy_class");
    }

    public void batchUpsert(List<AieduLiteracyClassPO> list) {
        String sql = "INSERT INTO aiedu_literacy_class(" +
                "id, lesson_code, title, \n" +
                "title_en, grade, lesson_type, \n" +
                "lesson_type_en, literacy, literacy_en, \n" +
                "unit, summary, summary_en, \n" +
                "key_concepts, key_concepts_en, topic, \n" +
                "topic_en, cover_image, create_time, \n" +
                "update_time, ppt_canva_code) " +
                "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) " +
                "ON DUPLICATE KEY UPDATE " +
                "lesson_code=VALUES(lesson_code)," +
                "title=VALUES(title)," +
                "title_en=VALUES(title_en)," +
                "grade=VALUES(grade)," +
                "lesson_type=VALUES(lesson_type)," +
                "lesson_type_en=VALUES(lesson_type_en)," +
                "literacy=VALUES(literacy)," +
                "literacy_en=VALUES(literacy_en)," +
                "unit=VALUES(unit)," +
                "summary=VALUES(summary)," +
                "summary_en=VALUES(summary_en)," +
                "key_concepts=VALUES(key_concepts)," +
                "key_concepts_en=VALUES(key_concepts_en)," +
                "topic=VALUES(topic)," +
                "topic_en=VALUES(topic_en)," +
                "cover_image=VALUES(cover_image)," +
                "ppt_canva_code=VALUES(ppt_canva_code)," +
                "update_time=VALUES(update_time)";
        jdbc.batchUpdate(sql, list, list.size(),
                (ps, dto) -> {
                    ps.setString(1, dto.getId());
                    ps.setString(2, dto.getLessonCode());
                    ps.setString(3, dto.getTitle());
                    ps.setString(4, dto.getTitleEn());
                    ps.setString(5, dto.getGrade());
                    ps.setString(6, dto.getLessonType());
                    ps.setString(7, dto.getLessonTypeEn());
                    ps.setString(8, dto.getLiteracy());
                    ps.setString(9, dto.getLiteracyEn());
                    ps.setString(10, dto.getUnit());
                    ps.setString(11, dto.getSummary());
                    ps.setString(12, dto.getSummaryEn());
                    ps.setString(13, dto.getKeyConcepts());
                    ps.setString(14, dto.getKeyConceptsEn());
                    ps.setString(15, dto.getTopic());
                    ps.setString(16, dto.getTopicEn());
                    ps.setString(17, dto.getCoverImage());
                    ps.setDate(18, dto.getCreateTime());
                    ps.setDate(19, dto.getUpdateTime());
                    ps.setString(20, dto.getPptCanvaCode());
                });
        log.info("批量写入完成");
    }

    public Set<String> selectAllRecordIds() {
        return new HashSet<>(jdbc.queryForList("SELECT id FROM aiedu_literacy_class", String.class));
    }

    public void deleteByIds(Set<String> ids) {
        if (ids.isEmpty()) return;
        String in = ids.stream().collect(Collectors.joining("','"));
        jdbc.update("DELETE FROM aiedu_literacy_class WHERE id IN ('" + in + "')");
    }
}
