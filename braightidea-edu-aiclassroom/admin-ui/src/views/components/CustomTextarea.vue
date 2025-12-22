<template>
  <div>
    <el-input type="textarea"
              :rows="rows"
              :readonly="readonly"
              size="small" :value="value" @input="handleInput"></el-input>
  </div>
</template>

<script>
export default {
  name: "CustomTextarea",
  props: {
    value: {
      type: String,
      default: '',
    },
    rows: {
      type: Number,
      default: 3
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
    },
  }
}
</script>
