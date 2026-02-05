package com.braight.dc.admin.web.mapper;

import com.braight.dc.admin.web.entity.AieduQuizQuestionPO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AieduQuizQuestionPOMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(AieduQuizQuestionPO row);

    AieduQuizQuestionPO selectByPrimaryKey(Integer id);

    List<AieduQuizQuestionPO> selectAll();

    int updateByPrimaryKey(AieduQuizQuestionPO row);

    List<AieduQuizQuestionPO> selectListByIds(@Param("ids") List<Integer> ids);

    List<AieduQuizQuestionPO> selectRecommendedList(AieduQuizQuestionPO po);

    List<AieduQuizQuestionPO> selectQuestionBankList();
}
