package com.braight.dc.admin.web.mapper;

import com.braight.dc.admin.web.entity.AieduQuizQuestionRelPO;
import java.util.List;

public interface AieduQuizQuestionRelPOMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(AieduQuizQuestionRelPO row);

    AieduQuizQuestionRelPO selectByPrimaryKey(Integer id);

    List<AieduQuizQuestionRelPO> selectAll();

    int updateByPrimaryKey(AieduQuizQuestionRelPO row);

    List<AieduQuizQuestionRelPO> selectList(AieduQuizQuestionRelPO po);
}
