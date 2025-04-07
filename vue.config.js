module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      productName: 'MDEditorLite',
      externals: ['electron'],
      builderOptions: {
        productName: 'MDEditorLite',
        icon: "src/assets/logo.ico",
        mac: {
          icon: "src/assets/logo.png"
        }
      }
    }
  }
}
