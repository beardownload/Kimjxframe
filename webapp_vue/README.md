<h2>单页面 手机端模拟App 运行模式的路由框架</h2>


<h3>几个重点问题 问和答 了解整个原理</h3>
问：页面路由 数据 和url 参数存在哪里？<br>
答：seesionStorage内，页面的url参数全部存在此处，存放键值 为 KimMobileAppPageSession<br><br>


问：页面是怎么出来的？<br>
答：通过css样式和div合成的占满全屏的 一个dom点 作为页面 vue实例的挂载点<br><br>


问：VUE页面组件如何自动加载的？<br>
答：该功能全在 app.js 内实现 <br>
Kim.VUE_loader 实现 对vue对象的加载，传入dom和 其他vue的 参数实现实例化。 new Vue(options);<br>
Kim.VUE_AutoLoadComponent 方法 可以自动加载解析 模版内的 所有标记了 K-VUE-COMPONENT 属性的组件<br>
Kim.VUE_useComponent 方法 可以传入组件列表，提前预加载组件<br><br>

组件命名 和 文件夹文件相对应 比如 pages/test/test.html 页面组件文件 则引用它的 方式为 &lt;test-test K-VUE-COMPONENT&gt;&lt;/test-test&gt;