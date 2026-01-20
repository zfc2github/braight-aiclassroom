package com.braight.dc.admin.web.mapper;

import com.braight.dc.admin.web.entity.AieduClassroomSessionStudentWorkPO;
import java.util.List;

public interface AieduClassroomSessionStudentWorkPOMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(AieduClassroomSessionStudentWorkPO row);

    AieduClassroomSessionStudentWorkPO selectByPrimaryKey(Integer id);

    List<AieduClassroomSessionStudentWorkPO> selectAll();

    int updateByPrimaryKey(AieduClassroomSessionStudentWorkPO row);

    List<AieduClassroomSessionStudentWorkPO> selectByClassroomSessionId(String classroomSessionId);
}
