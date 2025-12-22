<template>
  <div>
    <el-row class="t-u-field-line">
      <el-col :span="24" class="field-content">
        <el-form-item label="英文:" label-width="80">
          <el-input size="small"
                    clearable
                    v-model="tagInfo[field.path].en"
                    @change="handleItemChange">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row class="t-u-field-line">
      <el-col :span="24" class="field-content">
        <el-form-item label="中文简体:" label-width="80">
          <custom-input
            v-model="tagInfo[field.path]['zh-Hans']"
            @input="handleItemChange">
          </custom-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row class="t-u-field-line">
      <el-col :span="24" class="field-content">
        <el-form-item label="中文繁体:" label-width="80">
          <custom-input
            v-model="tagInfo[field.path]['zh-Hant']"
            @input="handleItemChange">
          </custom-input>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CustomInput from "@/views/components/CustomInput";

export default {
  name: 'TagUpdateFieldInput',
  components: {
    CustomInput,
  },
  props: {
    field: {
      type: Object,
      default: null
    },
    tagInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {};
  },
  created() {
  },
  methods: {
    handleItemChange() {
      this.$emit('change', true);
    },
  },
};
</script>
<style lang="scss" scoped>
.t-u-field-line {
  .field-content {
    margin-right: 20px;
  }
}
</style>
