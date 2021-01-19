<template>
  <svg class="icon"
  :style="{'width': `${dealRem}rem`, 'height': `${dealHeight || dealRem}rem`, 'color': color}"
  :class="svgClass" aria-hidden="true">
    <use :xlink:href="`#${icon}`"></use>
  </svg>
</template>

<script>
export default {
  name: 'svg-icon',
  props: {
    svgClass: {
      type: [String, Object]
    },
    icon: {
      type: String
    },
    size: {
      type: Number,
      default: 29
    },
    height:{
      type: Number,
    },
    color: {
      type: String,
      default: ''
    },
  },
  computed: {
    dealRem() {
      return this.size / 75; // 默认750屏幕下字体大小为 75px
    },
    dealHeight() {
      return this.height / 75; // 默认750屏幕下字体大小为 75px
    },
  },
  mounted() {
  }
}
</script>
