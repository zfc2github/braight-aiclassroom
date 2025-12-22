<template>
  <div class="dashboard-editor-container">

    <panel-group id="panel-group"/>


  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup';
export default {
  name: 'Index',
  components: {
    PanelGroup,
  },
  data() {
    return {
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px 300px 32px 150px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
