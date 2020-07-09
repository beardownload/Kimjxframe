<h2>返璞归真，简单优雅</h2>

无需编译，无插件依赖，直接开撸。<br>

框架大小 8Kb emmmm反正很小，大家可以看源码<br>

初始页面基本 只需加载框架 8kb<br>


<br><br>
<h3>可实现框架功能</h3><br>
1.前后端文件分离，接口域名不分离，入口文件和后端放一起即可。<br>
2.手机端单页面，多窗口功能，封装了hsah处理，页面参数传递，页面通信。<br>
3.单页面后台管理系统开发。<br>


<br><br>
<h3>开发web服务使用</h3><br>

服务目录为demo的 Kimjxframe.js 框架文件 目录
项目目录为 单页面后台管理 目录 中文名可以自行修改为其他名称

<br><br>
linux 下 可以使用 phython 起web服务
<pre>
  python3 -m http.server
</pre>


<br><br>
windows下推荐 PHPupupw 一键包 启动ngix web服务<br>
https://www.upupw.net/


<br><br>
<h3>文件目录说明</h3><br>
单页面后台管理项目目录<br>
 -index.html 入口文件<br>
 -pages 页面目录<br>
 -app.js 项目业务 框架实现 加载js 样式 页面路由等 我们会提供多种业务框架选择 也可自己实现<br>
Kimjxframe.js 框架<br>


<br><br>
<h3>内置函数库</h3>
<table width="100%">
  <tbody>
    <tr>
      <td>KJ.Fnuse</td>
      <td>
        加载js和css插件，加载完成后回调，可以重复使用，如果已经被加载，则不会重复加载。<br>
        KJ.Fnuse([
          ["js文件地址","js"],
          ["css文件地址","css"]
        ]);
      </td>
    </tr>
    <tr>
      <td>KJ.FngetGet</td>
      <td>
        解析url 参数为对象
        KJ.FngetGet("text.html?a=1&b=2");
        返回对象 {a:1,b:2}
      </td>
    </tr>
    <tr>
      <td>KJ.Fnpageloader</td>
      <td>
        加载页面，配置页面目录下加载对应的html或者js文件<br>
        var tpl = "test/index";
        KJ.Fnpageloader(tpl,function(){
          //获取加载的页面内容
          KJ.getApp(tpl);
        });
      </td>
    </tr>
    <tr>
      <td>KJ.getApp</td>
      <td>
        获取加载的页面内容，框架会自动缓存页面内容，如果已经加载则直接从内存中返回，后缀名不填写，统一使用运行模式js/html。
        KJ.getApp("test/index");
      </td>
    </tr>
    <tr>
      <td>KJ.Fnregistevent</td>
      <td>
        自定义事件，已内置了hash触发事件，只要注册即可。
        KJ.Fnregistevent("hashchange",f); name:事件名称或者标记。f:触发事件的函数。注册成功返回事件ID。
      </td>
    </tr>
    <tr>
      <td>KJ.Fnunregistevent</td>
      <td>
        自定义事件。
        KJ.Fnunregistevent(name,id); name:事件名称或者标记。id:注册事件时返回的ID。
      </td>
    </tr>
    <tr>
      <td>KJ.Fneventdeal</td>
      <td>
        触发自定义事件。
        KJ.Fneventdeal(name,data); name:事件名称或者标记。data:事件触发，传递的参数。
      </td>
    </tr>
    <tr>
      <td>KJ.Fnregistpage</td>
      <td>
        注册页面html。
        KJ.Fnregistpage(html,callback,name);<br>
        html:页面html。<br>
        callback:加载注册完成回调。<br>
        name:页面名称，hash模式自动匹配当前hash注册，注册模式取传入的name。
      </td>
    </tr>
  </tbody>
</table>


<br>
/* 简单使用 推荐使用jq或者zepto食用 */
<pre>
  <script src="../Kimjxframe.js"></script>
  <script>
    KJ.init({root:""});

    /*配置参数
      {
        //根目录 js文件存放目录 走js可跨域存放页面 html必须存放一起或者后端做跨域处理
        root:"",

        //初始化文件 app.js请具体到各个demo内查看 整个项目复制即可 开撸页面
        start:"app.js",

        //页面js存放地
        pageroot:"pages/",

        //默认初始框架页 hash值
        defaultframe:"main/main",

        //默认主页
        defaultpage:"main/index",

        //顶部渲染页面dom点
        appdom:document.createElement("div"),

        //默认页面运行模式 js 和 html
        runmode:"js",
      }
    */
  </script>
</pre>




<br>
<h3>配合vue 使用</h3>
<pre>
  <div id="app">
    {{ message }}
  </div>

  <script>
    var App = {};

    App.init = function(){
      var _this = this;

      var init = function(){
        Kim.use([
          ["https://cdn.bootcss.com/vue/2.6.10/vue.min.js","js"]
        ],function(){
          _this.F_init();
        });
      }

      //初始化 vue 对象加载数据进行页面渲染
      _this.F_init = function(){
        _this.vue = new Vue({
          el: '#app',
          data: {
            message: 'Hello Vue!'
          }
        });
      }


      init();
    }


    App.init();
  </script>
</pre>



<br>
<h3>配合layui模版语言使用 使用</h3>
<pre>
  <script type="text/html" id="tpl">
    模版{{ d.txt }}
  </script>

  <script>
    var App = {};

    App.init = function(){
      var _this = this;

      var init = function(){
        layui.use(["laytpl"],function(){
          _this.F_init();
        });
      }

      //初始化 krender 请查看封装了 laytpl的 Ktool.js 项目
      _this.F_init = function(){
        var render = Ktool.krender("#render");

        render.t = $("#tpl").html();
        render.d = {txt:"初始内容"};
      }


      init();
    }


    App.init();
  </script>
</pre>