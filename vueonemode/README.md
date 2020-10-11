<h2>vue后台单实例项目模版 可修改main.html 主框架页 变为手机端全刷模式页面</h2>

无需编译，直接开撸。<br><br>


<h3>
  项目内插件全部使用 bootcdn 引入
  感谢<a href="https://www.bootcdn.cn/" target="_blank">https://www.bootcdn.cn/</a>
</h3>


<br><br>
<h3>可实现框架功能</h3><br>
1.单入口文件hash映射页面。<br>
2.手机端单页面全刷模式或者部分刷模式，后台管理系统部分页面刷新。<br>
3.组件名称自动映射组件文件自动加载。<br>
4.组件内样式css接入layui的 模版语言 可使用js  混写 css，就是 css中可以 使用js 输出变量。


<br><br>
<h3>开发web服务使用</h3><br>

底层所有功能基于 Kimjxframe.js 框架


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
 ·pages 页面目录<br>

 ··main 页面框架主入口文件夹，可通过修改配置更换<br>
 ··main.html 入口页面框架，路由切换组件body在这里面，菜单组件引入头部组件引入<br>
 ···index.html 默认首页<br>
 ···menu 菜单组件文件夹<br>
 ····list.html 菜单组件<br>
 ···header 头部组件文件夹<br>
 ····index.html 头部组件<br>

 ··test 测试页面文件夹<br>
 ···index 测试页面文件夹<br>
 ····index.html 测试组件页面，将会被加载到body中<br>
index.html 入口文件<br>
app.js 项目业务 框架实现 加载js 样式 页面路由等 我们会提供多种业务框架选择 也可自己实现<br>
Kimjxframe.js 框架<br>


<br><br>
<h3>内置函数库</h3>
这边就介绍两个核心的 其他看源文件惹<br>
<table width="100%">
  <tbody>
    <tr>
      <td>Kim.use</td>
      <td>
        加载js和css插件，加载完成后回调，可以重复使用，如果已经被加载，则不会重复加载。<br>
        Kim.use([
          ["js文件地址","js"],
          ["css文件地址","css"]
        ],callback(){}回调函数);
      </td>
    </tr>
    <tr>
      <td>Kim.VUE_useComponent</td>
      <td>
        提前预先批量加载组件
        Kim.VUE_useComponent(["组件文件路径，无需带后缀，根据底层运行模式自动取"],完成回调函数);
        例Kim.VUE_useComponent(["main/header/index"],function(){});
        则提前加载 组件main/header/index
      </td>
    </tr>
  </tbody>
</table>


<br>
<h2>组件 OR 页面属性规范</h2><br>
样式     style标签 样式内容，自行做好样式前缀分割，以免互相影响重置。<br>
模版页面 script type="text/html"<br>
组件js   script
<pre>
  css 支持layui的 模版语言 可运行js 输出变量

  <style>
    {{# var color = "#fff"; }}

    .test-class{font-size:100px; color:{{ color }};}
  </style>


  组件标签带上 K-VUE-COMPONENT属性即可 自动加载
  <script type="text/html">
    &lt;div&gt;
      

      &lt;div class="j-common-container-p"&gt;
        这里自动引入了 pages/main/header/index.html组件
        &lt;main-header-index K-VUE-COMPONENT v-bind:G="G" v-bind:nav="nav"&gt;&lt;/main-header-index&gt;

        第二次引入 可重复引入，不要在 组件又嵌套自身 或者 互相嵌套造成死循环
        &lt;main-header-index K-VUE-COMPONENT v-bind:G="G" v-bind:nav="nav"&gt;&lt;/main-header-index&gt;

        &lt;a href="#" class="test-class"&gt;返回默认页&lt;/a&gt;

        &lt;div class="j-common-container"&gt;
        
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  </script>


  组件js代码 完全和vue 一致 详细查看官方文档<br>
  __COMPONENT__ 和 __TEMPLATE__ 两个参数为固定值，将被处理成目录映射参数和模版文件
  <script>
    Vue.component(__COMPONENT__,{
      props:["G"],

      template:__TEMPLATE__,

      data:function(){
        return {
          
        };
      },

      methods:{

      },

      created:function(){
        
      }
    });
  </script>
</pre>