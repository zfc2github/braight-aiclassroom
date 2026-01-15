package com.braight.dc.admin.web.mapper;

import com.braight.dc.admin.web.entity.AieduAiToolPO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AieduAiToolPOMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(AieduAiToolPO row);

    AieduAiToolPO selectByPrimaryKey(Integer id);

    List<AieduAiToolPO> selectAll();

    int updateByPrimaryKey(AieduAiToolPO row);

    List<AieduAiToolPO> selectListByCategory(@Param("category") String category);
}
