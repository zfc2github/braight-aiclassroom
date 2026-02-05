package com.braight.dc.admin.web.mapper;

import com.braight.dc.admin.web.entity.AieduClassroomSessionPO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AieduClassroomSessionPOMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(AieduClassroomSessionPO row);

    AieduClassroomSessionPO selectByPrimaryKey(Integer id);

    List<AieduClassroomSessionPO> selectAll();

    int updateByPrimaryKey(AieduClassroomSessionPO row);

    List<AieduClassroomSessionPO> selectActiveSession(AieduClassroomSessionPO po);

    int updateStageStatus(AieduClassroomSessionPO po);

    AieduClassroomSessionPO selectActiveByClassCode(String classCode);

    int updateCurrentStage(@Param("classroomId") Integer classroomId,
                           @Param("currentStage") String currentStage);

    AieduClassroomSessionPO selectActiveByClassId(@Param("classId") Integer classId);

  int updateQuizConfig(AieduClassroomSessionPO po);
}
