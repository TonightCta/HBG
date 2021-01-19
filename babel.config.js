module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  presets: [
     [ "@vue/app", { useBuiltIns: "entry" } ] 
  ],
  plugins: [ '@babel/plugin-transform-runtime' ]
}
