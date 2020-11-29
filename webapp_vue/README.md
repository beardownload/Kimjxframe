<h2>VUE 单页面 手机端模拟App 运行模式的路由框架</h2>

<h3>
  <a style="color:#0ae" href="http://yima.dev.vihost.cn/web/application/kim/webapp_vue/" target="_blank">查看演示demo</a>
  <br><br>
  <a style="color:#0ae" href="http://ghs.mybear.ga" target="_blank">熊熊下载项目</a>
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
Kim.VUE_loader 实现 对vue对象的加载，传入dom和 其他vue的 参数实现实例化。 new Vue(options);<br>
Kim.VUE_AutoLoadComponent 方法 可以自动加载解析 模版内的 所有标记了 K-VUE-COMPONENT 属性的组件<br>
Kim.VUE_useComponent 方法 可以传入组件列表，提前预加载组件<br>

组件命名 和 文件夹文件相对应 比如 pages/test/test.html 页面组件文件 则引用它的 方式为 &lt;test-test K-VUE-COMPONENT&gt;&lt;/test-test&gt; 该方式在 组件内作为子组件引入 会自动进行加载处理，我们只需要 把标签加好即可<br><br>


问：组件页面书写 和 脚手架书写的模式区别
答：大致差不多，<br>
由一个 头部 style 标签组件，中间如果引入 layui的laytpl模版语言，则可在 css内使用 js，<br>
使用方法即 laytpl的模版语言 .test-test{color:{{ 输出的变量 }};} {{# 运行js代码 }}<br>
样式命名规范 强烈建议 使用 组件地址前缀 作为样式头  pages/test/test.html   则样式全部 使用 .test-test 开头作为前缀<br>

一个 script type="text/html" 页面内容

最后是一个 js 代码 script标签  __COMPONENT__ 和 __TEMPLATE__ 为固定值，app内处理后替换为 路径组件名称和 模版代码
<pre>
  //首页底部菜单
  Vue.component(__COMPONENT__, {
    props:["appid"],

    template:__TEMPLATE__,

    data:function(){
      return {
        url:"",

        Gdata:RootApp.F_getVueDefaultData(),
      };
    },

    created:function(){
      
    },

    mounted:function(){
      var app = App[this.appid];


    },

    methods:{
      //测试方法
      F_test:function(){
        alert(11111);
      },
    },
  });
</pre>


<br><br>
<h2>几个重要文件</h2><br>
pages/main/main.html 框架初始化控制 此处定义全局函数 和 控制初始化，登录函数 等处理 RootApp 仅作演示，其他可自行定义<br>
Kim.MainpageInitCallback(); 该函数 控制 app层的 框架初始化 完成必要的业务数据初始化后 初始化加载 pages/main/index.html页面<br><br>


pages/main/index.html 该页面 控制 第一层appid 的初始化，可控制检测登录，显示登录，拦截用户展示其他页面。