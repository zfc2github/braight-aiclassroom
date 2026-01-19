package com.braight.dc.admin.web.mapper;

import com.braight.dc.admin.web.entity.AieduClassroomSessionStudentPO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AieduClassroomSessionStudentPOMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(AieduClassroomSessionStudentPO row);

    AieduClassroomSessionStudentPO selectByPrimaryKey(Integer id);

    List<AieduClassroomSessionStudentPO> selectAll();

    int updateByPrimaryKey(AieduClassroomSessionStudentPO row);

    List<AieduClassroomSessionStudentPO> selectJoinedByEntity(AieduClassroomSessionStudentPO entity);

    int updateSelective(AieduClassroomSessionStudentPO studentPO);

    AieduClassroomSessionStudentPO selectJoined(@Param("classroomSessionId") Integer classroomSessionId,
                                                @Param("studentId") String studentId);

    AieduClassroomSessionStudentPO selectStudent(@Param("classroomSessionId") Integer classroomSessionId,
                                                @Param("studentId") String studentId);
}
