package com.braight.dc.admin.web.excel;

import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.read.listener.ReadListener;
import com.alibaba.excel.util.ListUtils;
import com.braight.dc.admin.web.entity.AieduStudentPO;
import com.braight.dc.admin.web.mapper.AieduStudentPOMapper;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author Shine
 * @date 2026/1/13
 */
@Slf4j
public class StudentDataListener implements ReadListener<AieduStudentPO> {

    /**
     * 每隔5条存储数据库，实际使用中可以100条，然后清理list，方便内存回收
     */
    private static final int BATCH_COUNT = 100;

    private final AtomicInteger successCount = new AtomicInteger(0);
    private final AtomicInteger failedCount = new AtomicInteger(0);
    private final List<ImportError> errors = new ArrayList<>();

    private final Integer classId;
    private final AieduStudentPOMapper aieduStudentPOMapper;

    /**
     * 缓存的数据
     */
    private List<AieduStudentPO> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

    public StudentDataListener(Integer classId, AieduStudentPOMapper aieduStudentPOMapper) {
        this.classId = classId;
        this.aieduStudentPOMapper = aieduStudentPOMapper;
    }

    /**
     * 每一条数据解析都会来调用
     */
    @Override
    public void invoke(AieduStudentPO data, AnalysisContext context) {
        // 当前行号，从0开始
        int rowIndex = context.readRowHolder().getRowIndex();
        int actualRow = rowIndex + 1; // Excel行号从1开始

        // 验证数据
        List<String> validationErrors = validateData(data, actualRow);
        if (!validationErrors.isEmpty()) {
            for (String error : validationErrors) {
                errors.add(new ImportError(actualRow, data.getStudentId(), error));
            }
            failedCount.incrementAndGet();
            return;
        }

        // 检查学号是否已存在
        if (checkStudentIdExists(data.getStudentId())) {
            errors.add(new ImportError(actualRow, data.getStudentId(), "学号已存在"));
            failedCount.incrementAndGet();
            return;
        }

        // 将数据加入缓存
        cachedDataList.add(data);

        // 达到BATCH_COUNT了，需要去存储一次数据库，防止数据几万条数据在内存，容易OOM
        if (cachedDataList.size() >= BATCH_COUNT) {
            saveData();
            // 存储完成清理 list
            cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
        }
    }

    /**
     * 所有数据解析完成了 都会来调用
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        // 这里也要保存数据，确保最后遗留的数据也存储到数据库
        saveData();
        log.info("所有数据解析完成！");
    }

    /**
     * 加上存储数据库
     */
    private void saveData() {
        log.info("存储数据到数据库，数据行数:{}", cachedDataList.size());

        for (AieduStudentPO student : cachedDataList) {
            try {
                // 这里需要根据实际的学生表实体和映射器进行调整
                Date now = new Date();
                student.setClassId(classId);
                student.setCreatedAt(now);
                student.setUpdatedAt(now);
                aieduStudentPOMapper.insert(student);
                successCount.incrementAndGet();
            } catch (Exception e) {
                log.error("保存学生信息失败: {}", e.getMessage(), e);
                errors.add(new ImportError(-1, student.getStudentId(), "保存失败：" + e.getMessage()));
                failedCount.incrementAndGet();
            }
        }

        cachedDataList.clear();
    }

    /**
     * 验证数据
     */
    private List<String> validateData(AieduStudentPO data, int row) {
        List<String> errors = new ArrayList<>();

        if (data.getStudentId() == null || data.getStudentId().trim().isEmpty()) {
            errors.add("学号不能为空");
        }

        if (data.getName() == null || data.getName().trim().isEmpty()) {
            errors.add("姓名不能为空");
        }

        return errors;
    }

    /**
     * 检查学号是否已存在
     */
    private boolean checkStudentIdExists(String studentId) {
        // 这里需要根据实际的数据库查询逻辑实现
        return aieduStudentPOMapper.selectListByStudentIdAndClassId(studentId, classId).size() > 0;
    }


    /**
     * 获取导入结果
     */
    public ImportResult getImportResult() {
        return new ImportResult(
                successCount.get(),
                failedCount.get(),
                successCount.get() + failedCount.get(),
                this.errors
        );
    }

    /**
     * 导入结果类
     */
    public static class ImportResult {
        private int success;
        private int failed;
        private int total;
        private List<ImportError> errors;

        public ImportResult(int success, int failed, int total, List<ImportError> errors) {
            this.success = success;
            this.failed = failed;
            this.total = total;
            this.errors = errors;
        }

        // Getters and setters
        public int getSuccess() { return success; }
        public void setSuccess(int success) { this.success = success; }

        public int getFailed() { return failed; }
        public void setFailed(int failed) { this.failed = failed; }

        public int getTotal() { return total; }
        public void setTotal(int total) { this.total = total; }

        public List<ImportError> getErrors() { return errors; }
        public void setErrors(List<ImportError> errors) { this.errors = errors; }
    }

    /**
     * 导入错误类
     */
    static class ImportError {
        private int row;
        private String studentId;
        private String reason;

        public ImportError(int row, String studentId, String reason) {
            this.row = row;
            this.studentId = studentId;
            this.reason = reason;
        }

        // Getters and setters
        public int getRow() { return row; }
        public void setRow(int row) { this.row = row; }

        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}
