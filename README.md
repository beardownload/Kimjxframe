<h2>返璞归真，简单优雅</h2>

无需编译，无插件依赖，直接开撸。<br>

框架大小 8Kb gzip后 emmmm反正很小，大家可以看源码<br>

初始页面基本 只需加载框架 8kb<br>


<br><br>
<h3>可实现框架功能</h3><br>
1.前后端分离，接口域名不分离。

2.手机端单页面，多窗口功能，封装了hsah处理，页面参数传递，页面通信。

3.单页面后台程序开发。


<br><br>
<h3>内置函数库</h3>
<table>
  <tbody></tbody>
</table>


<br><br>
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




<br><br>
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



<br><br>
<h3>配合vue 使用</h3>
<pre>
  
</pre>