module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      productName: 'Memo Simple Client',
      externals: ['electron'],
      builderOptions: {
        productName: 'Memo Simple Client',  // 添加这行
        icon: "src/assets/logo.ico",
        mac: {
          icon: "src/assets/logo.png"
        }
      }
    }
  }
}
