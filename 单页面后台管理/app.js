(function(){
  /**
   * 加载基础插件 页面框架单页面试 适合后台使用
   * hash 对应服务端 js文件或者html文件
   * Kim 对象名称可根据自己的喜欢变 其他对象名称
   */
  window.Kim = {
    init:function(){
      this.Fnloadplugin();
    },

    //加载初始化基础插件
    Fnloadplugin:function(){
      var _this = this;

      var list = [
        ["https://cdn.bootcss.com/font-awesome/5.8.2/css/all.min.css","css"],
        ["https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js","js"],
        ["https://cdn.bootcss.com/jquery.form/4.2.2/jquery.form.min.js","js"],

        ["style.css","css"],
      ];

      KJ.Fnuse(list,function(){
        //加载layui插件
        _this.Fnloadlayuiplugin();
      });
    },

    //加载其他插件 修改此处可
    Fnloadlayuiplugin:function(){
      var _this = this;

      /*layui.use(["laytpl","laypage","laydate","element","layer","form"],function(){
        _this.Fnpageinit();
      });*/

      _this.Fnpageinit();
    },

    //页面框架初始化
    Fnpageinit:function(){
      var _this = this;

      _this.$ROOTDOM = $(KJ.CONFIG.appdom);

      //此处可修改默认配置框架页
      //KJ.CONFIG.defaultpage = "main/index";

      var framepage = KJ.CONFIG.defaultframe;

      KJ.Fnpageloader(framepage,function(){
        _this.$ROOTDOM.html(KJ.getApp(framepage));

        //创建dom渲染点
        KJ.DOMRENDER.$body = $("#body");

        //注册hash事件
        _this.hashchangeID = KJ.Fnregistevent("hashchange",_this.Fnhashchange);

        KJ.Fnhashchange();
      });
    },

    //hash事件处理
    Fnhashchange:function(data){
      var _this = this;

      var page   = data.hash.page ? data.hash.page : KJ.CONFIG.defaultpage;
      window.GET = data.hash.GET;

      //console.log(page);
      KJ.Fnpageloader(page,function(){
        if(typeof(App) != "undefined" && App.pageend){ App.pageend(); }
        //console.log(KJ.APP[page]);

        KJ.DOMRENDER.$body.html(KJ.getApp(page));
      });
    },

    //批量加载js css
    use:KJ.Fnuse,

    //加载js
    loadJs:KJ.Fnloadjs,

    //加载css
    loadCss:KJ.Fnloadcss,

    //解析url
    getGet:KJ.FngetGet,
  }

  Kim.init();
})();