<h2>单页面 手机端模拟App 运行模式的路由框架</h2>

<h3>
  <a style="color:#0ae" href="http://yima.dev.vihost.cn/web/application/kim/webapp_react/" target="_blank">查看演示demo</a>
</h3>


<h3>几个重点问题 问和答 了解整个原理</h3>
问：页面路由 数据 和url 参数存在哪里？<br>
答：seesionStorage内，页面的url参数全部存在此处，存放键值 为 KimMobileAppPageSession 如需修改 可在app.js 内修改配置<br><br>


问：页面是怎么出来的？<br>
答：通过css样式和div合成的占满全屏的 一个dom点 作为页面 vue实例的挂载点<br>
每个实例上层 都有一个 app层控制的，页面组件内prop接收 appid 来找到App[this.appid]<br>
App[this.appid] 下面 有 GET 对象 为url 参数解析后的数据<br>

通过修改 App[this.appid].url = "test/test?id=1234&testcode=5555";  可实现 在当前窗口 跳转新的页面组件，并带参数<br>
<br><br>


问：VUE页面组件如何自动加载的？<br>
答：该功能全在 app.js 内实现 <br>

后续补文档 嘻嘻