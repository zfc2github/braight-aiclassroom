<template>
  <div>
    <el-input size="small"
              clearable
              :value="value"
              @input="handleInput"></el-input>
  </div>
</template>

<script>
export default {
  name: "CustomInput",
  props: {
    value: {
      type: [String, Number],
      default: '',
    }
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
    },
  }
}
</script>
