package com.braight.dc.admin.web.mapper;

import com.braight.dc.admin.web.entity.AieduClassroomSessionPO;

import java.util.Collection;
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
}
