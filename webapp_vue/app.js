(function(){
  /**
   * 加载基础插件 页面框架单页面试 适合后台使用
   * hash 对应服务端 js文件或者html文件
   * Kim 对象名称可根据自己的喜欢变 其他对象名称
   *
   * VUE 模式 2.6.12
   */
  //版本缓存控制
  KJ.cachevesion      = "1.02";

  window.getGet       = KJ.FngetGet;

  //debug模式 开启php页面辅助
  //KJ.CONFIG.Templatemode    = "api";
  //KJ.CONFIG.TemplatemodeAPI = "index.php";
  

  window.Kim = {
    DEBUG:true,

    Config:{
      //框架页面
      RootPage:KJ.CONFIG.defaultframe,

      //默认主页
      DefaultPage:KJ.CONFIG.defaultpage,

      //框架刷新dom的id
      DomRoot:"root",

      //模版根目录
      TRoot:KJ.CONFIG.root,

      LoadcpName:"loadcp",

      title:document.title,
    },

    //批量加载js css
    use:KJ.Fnuse,

    //加载js
    loadJs:KJ.Fnloadjs,

    //加载css
    loadCss:KJ.Fnloadcss,

    Fncel:KJ.Fncel,

    //对象列表
    App:{},

    //当前在最上方的App ID
    activeApp:0,

    //是否已经加载完毕框架
    inited:false,

    //当前生成的window tid
    winId:0,

    //当前APP个数
    AppCount:0,

    //缓存名称
    sessionName:"KimMobileAppPageSession",

    init:function(){
      this.Fnloadplugin();
    },

    //加载初始化基础插件
    Fnloadplugin:function(){
      var _this = this;

      //项目根目录配置
      _this.RootPath = KJ.CONFIG.root + "";

      _this.windowHeight = window.innerHeight;

      var list = [
        ["https://cdn.bootcdn.net/ajax/libs/font-awesome/5.15.1/css/all.min.css","css"],
        [_this.RootPath + "static/css/app.css","css"],

        //加载核心 vue
        ["https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js","js"],

        ["https://cdn.bootcdn.net/ajax/libs/zepto/1.2.0/zepto.min.js","js"],
        [_this.RootPath + "static/plugin/layer_mobile/layer.js","js"],
        
        //引入layui 和laytpl 赋能 css js脚本能力
        ["https://cdn.bootcdn.net/ajax/libs/layui/2.5.6/layui.min.js","js"],
        ["https://cdn.bootcdn.net/ajax/libs/layui/2.5.6/lay/modules/laytpl.js","js"],

        //表单验证 正则列表
        [_this.RootPath + "static/js/validator.js","js"],

        [_this.RootPath + "static/js/webconfig.js","js"],
        [_this.RootPath + "static/js/Ktool.js","js"],
        [_this.RootPath + "static/js/site.js","js"],
        [_this.RootPath + "static/js/config.js","js"],
        [_this.RootPath + "static/js/cssconfig.js","js"],
      ];

      KJ.Fnuse(list,function(){
        if(Kim.DEBUG && Ktool.userAgent.isMobile()){
          //手机端 调试工具
          Kim.use([["https://cdn.bootcss.com/vConsole/3.3.4/vconsole.min.js","js"]],function(){
            var vConsole = new VConsole();
          });

          _this.Fnloadlayuiplugin();
        }else{
          _this.Fnloadlayuiplugin();
        }
      });
    },

    //加载其他插件 修改此处可
    Fnloadlayuiplugin:function(){
      var _this = this;
      Kim.kinit();
    },


    kinit:function(opt){
      var _this = Kim;

      _this.$ROOTDOM = $(KJ.CONFIG.appdom);

      //标签模式加载window
      window.Aloader = Kim.Aloader;
      window.App     = Kim.App;

      //当页面 刷新无hash时 清理页面内容
      if(location.hash == "" || location.hash == "#"){
        Kim.AppWinSessionClear();
      }

      Kim.Config.$PageRoot = $(KJ.CONFIG.appdom);

      if($("#" + Kim.Config.DomRoot).length <= 0){
        Kim.Config.$PageRoot.prepend('<div id="'+ Kim.Config.DomRoot +'"></div>');
      }

      Kim.DomRoot = $("#" + Kim.Config.DomRoot);

      if(!opt){ opt={}; }

      var pageparam = location.href.split("#");

      Kim.INITPAGEGET  = getGet(pageparam[0]);
      Kim.INITPAGEHASH = pageparam.length>1 ? getGet(pageparam[1]) : {};

      FnLoading(true);

      //创建vue 组件css 存放点
      document.body.appendChild(Kim.VUE_COMPONENT_CSSDOM);
      Kim.VUE_COMPONENT_CSSDOM.style["display"] = "none";

      //创建空页面组件 防止通用的 页面路由 导致组件无法加载 空组件 页面过度作用 促使强制刷新页面组件
      Kim.VUE_EMPTYPAGE = "K-VUE-EMPTYPAGE";
      Vue.component(Kim.VUE_EMPTYPAGE,{props:["G"],template:''});

      var framepage = KJ.CONFIG.defaultframe;

      Kim.getTemplate(framepage,function(){
        _this.$ROOTDOM.html(KJ.getApp(framepage));

        //创建dom渲染点
        KJ.DOMRENDER.$body = $("#body");

        //加载主页面
        var mainPage = KJ.CONFIG.defaultpage;

        Kim.getTemplate(mainPage,function(){
          KJ.DOMRENDER.$body.html(KJ.getApp(mainPage));

          setTimeout(function(){
            FnLoading(false);
          },2000);
        });
      });
    },


    //首页 用户信息登录完成后回馈 运行多界面
    MainpageInitCallback:function(){
      if(sessionStorage[Kim.sessionName] && JSON.parse(sessionStorage[Kim.sessionName]).length < 0){
        if(location.hash != "" && location.hash != "#"){
          location.href = "#";
        }
      }

      Kim.AppWinSessionRestart();

      Kim.inited = true;

      //注册hash事件
      Kim.hashchangeID = KJ.Fnregistevent("hashchange",Kim.hashchange);
    },

    //页面会话发生改变 触发记录改变
    AppWinSessionChange:function(){
      var list = [];

      for(var i in this.App){
        var app = this.App[i];
        list.push({
          url:app._url,
          title:app._title,
          tid:app.tid,
          sessionCache:app._sessionCache
        });
      }

      sessionStorage[Kim.sessionName] = JSON.stringify(list);
    },

    //清理session信息
    AppWinSessionClear: function(){
      if(sessionStorage[Kim.sessionName]){
        delete sessionStorage[Kim.sessionName];
      }
    },

    //页面会话恢复
    AppWinSessionRestart:function(){
      if(!sessionStorage[Kim.sessionName]){
        return false;
      }

      var list = JSON.parse(sessionStorage[Kim.sessionName]);

      var loader = function(i){
        var app = list[i];

        setTimeout(function(){
          Kim.FnLoad({
            hashchangeOff:true,
            tid:app.tid,
            title:app.title,
            url:app.url,
            animateIn:false,
            loadNow:list.length-1 == i ? true : false,
          },function(_app){

            if(app.sessionCache){
              _app.sessionCache = app.sessionCache;
            }

            _app.OFF("GCALLBACK","default");

          });
        },50*i);
      }

      for(var i in list){
        loader(i);
      }
    },


    //加载遮罩 透明
    FnLoad_loading:function(a){
      if(!a){a = false;}

      if(a){
        var html='<div id="Kim-Loading" style="position:fixed; top:0; bottom:0; left:0; right:0; background:rgba(0,0,0,0); z-index:999999999;"></div>';

        $("body").append(html);
        //$("#Kim-Loading").on("touch",function(e){e.preventDefault();});
      }else{
        //防止操作太快
        setTimeout(function(){
          $("#Kim-Loading").remove();
        },200);
      }
    },


    //加载页面
    FnLoad:function(opt,callback){
      //浏览器最大 历史记录为47条 超出后就会舍弃老的
      if(Kim.AppCount >= 45){
        console.error("Out Of Brower History Limit");
        return false;
      }

      var url = opt.url ? opt.url : Kim.Config.DefaultPage;

      var tid;

      //加载中
      Kim.FnLoad_loading(true);

      Kim.FnLoad_lock = true;

      //生成 窗口ID
      if(opt.tid){
        Kim.winId = opt.tid;
        tid       = opt.tid;
      }else{
        tid = Kim.winId + 1;
      }
      
      Kim.winId++;
      Kim.AppCount++;

      Kim.activeApp = tid;

      if(!opt.hashchangeOff){
        //history.pushState({},"","#" + tid);
        location.href = "#" + tid;
      }

      var title = opt.title ? opt.title : Kim.Config.title;

      var app = {
        //是否在加载页面
        loading:false,

        //是否已经加载至页面
        loadToWin:false,

        //是否已经加载html 防止display=none 是运行页面 获取不到高度
        loaded:false,

        //是否需要加载动画
        animateIn:opt.animateIn === false ? false : true,

        //是否立即加载html
        loadNow:opt.loadNow ? true : false,

        //容器ID
        tid:tid,

        id:Kim.Config.LoadcpName + tid,

        //窗口按钮默认标题
        _title:title ? title : Kim.Config.title + tid,

        //GET url解析对象
        GET:getGet(url),

        //页面重回激活 触发
        ONWINRELOAD:false,
        ONGWINRELOAD:false,

        //页面 被 隐藏 触发
        ONPAUSE:false,
        ONGPAUSE:false,

        //窗口关闭
        ONWINCLOSE:false,
        ONGWINCLOSE:false,

        //重置事件
        EVENTRESET:function(){
          //页面重回激活 触发
          app.ONWINRELOAD = false;
          app.ONGWINRELOAD = false;

          //页面 被 隐藏 触发
          app.ONPAUSE = false;
          app.ONGPAUSE = false;

          //窗口关闭
          app.ONWINCLOSE = false;
          app.ONGWINCLOSE = false;
        },

        //绑定事件 f函数 n名称
        ON:function(n,f,tag){
          var eventName = 'ON' + n;

          //初始化
          if(!app[eventName]){
            app[eventName] = {events:[],list:{}};
          }

          //建立字典
          if(tag){
            app[eventName].list[tag] = app[eventName].events.length;
          }else{
            tag = app[eventName].events.length;
            app[eventName].list[tag] = app[eventName].events.length;
          }

          app[eventName].events.push(f);
          return tag;
        },

        //解绑事件 n事件名称 tag绑定事件标志
        OFF:function(n,tag){
          var eventName = 'ON' + n;

          app[eventName].events[ app[eventName].list[tag] ] = false;
          delete app[eventName].list[tag];
        },

        //事件统一处理函数
        EventDeal:function(n,data){
          var eventName = 'ON' + n;

          //console.log(n);

          data = data ? data : {};

          if(app[eventName]){
            for(var i=0;i<app[eventName].events.length;i++){
              if(app[eventName].events[i]){app[eventName].events[i](data);}
            }
          }

          var eventGName = 'ONG' + n;

          if(app[eventGName]){
            
            //console.log(data);

            for(var i=0;i<app[eventGName].events.length;i++){
              if(app[eventGName].events[i]){app[eventGName].events[i](app,data);}
            }
          }
        },

        //运行页面地址 + 参数
        _url:url,

        locationIndex:0,

        //清理dom点 内存
        clear:function(){
          Kim.clearHTML(document.getElementById(app.id));
        },

        //加载页面 GET 模版等统一处理
        pageloaddeal:function(u,ok){
          app.EventDeal("CALLBACK",{from:app,status:5});

          //app.GET   = getGet(u);
          app._pathurl = u.split("?")[0];

          app.template = '<component style="width:100%; height:100%" v-bind:is="currentUrl" v-bind:appid="appid"></component>';

          ok();
        },

        //查找当前窗口下的元素
        $:function(selector){
          return app.jqwindowDIV.find(selector);
        },

        //模版tid处理
        templatedeal:function(html){
          return html.replace(/__TID__/g,app.tid);
        },

        //运行
        run:function(){

          app.pageloaddeal(app._url,function(){

            Kim.FnTemplateRun(app,function(){

              //页面加载完毕 回调
              app.EventDeal("CALLBACK",{from:app,status:1});
              
            });
          });

        },

        //关闭应用 回收dom 清理内存
        shutdown:function(){
          //窗口关闭事件
          app.EventDeal("WINCLOSE");
          
          app.clear();

          var aim = document.getElementById(app.id);

          aim.parentNode.removeChild(aim);

          app.EventDeal("CALLBACK",{from:app.tid,status:1});

          delete Kim.App[app.tid];

          for(var i in app){
            app[i] = null;
          }

          app = null;
          Kim.AppCount--;

          //页面记录 刷新后重新能加载
          Kim.AppWinSessionChange();
        }

      };

      //定义App 监控变量接口
      Object.defineProperties(app,{

        title:{
          get:function(){
            return app._title;
          },
          set:function(v){
            app._title = v;
            document.title = _title;
          }
        },

        url:{
          get:function(){
            return app._url;
          },
          set:function(v){
            app.GET  = getGet(v);
            app._url = v;

            //重置事件
            app.EVENTRESET();
            app._sessionCache = "";

            app._pathurl = v.split("?")[0];

            //页面记录 刷新后重新能加载
            Kim.AppWinSessionChange();

            //加载页面组件 完毕后加载 初始化页面组件
            Kim.VUE_loadComponent(app._pathurl,function(){
               //重置 vue对象路由 从而重新加载新组件 页面
              app.vue.currentUrl = Kim.VUE_EMPTYPAGE;

              setTimeout(function(){
                app.vue.currentUrl = Kim.VUE_RouterPathDeal(app._pathurl);
              },100);
            });
          }
        },
      });

      //缓存对象 页面刷新后依然可以被传递
      app._sessionCache = "";

      Object.defineProperties(app,{
        sessionCache:{
          get:function(){
            return app._sessionCache;
          },
          set:function(v){
            app._sessionCache = v;

            //页面记录 刷新后重新能加载
            Kim.AppWinSessionChange();
          }
        }
      });

      //如果存在 callback
      if(callback){
        app.ON("GCALLBACK",callback,"default");
      }

      //如果存在vue 则进行生命周期清理
      app.ON("WINCLOSE",function(){
        if(app.vue){
          app.vue.$destroy();
        }
      });

      Kim.App[tid] = app;
      app.run();
      Kim.AppWinSessionChange();
    },


    //清理html
    clearHTML:function(dom){
      var list = dom.querySelectorAll("*");

      for(var i = 0;i<list.length;i++){
        list[i].parentNode.removeChild(list[i]);
      }
    },

    //运行加载模板
    FnTemplateRun:function(app,callback){
      var container   = Kim.Fncel("div");

      var showCss = 'transform:scale(1) translateX(0); -webkit-transform:scale(1) translateX(0);';
      var hideCss = 'transform:scale(.8) translateX(120%); -webkit-transform:scale(.8) translateX(120%);';

      container.id = app.id;

      app.windowDIV   = container;
      app.jqwindowDIV = $(container);

      var vueDom  = Kim.Fncel("div");
      var $vueDom = $(vueDom);

      $vueDom.attr({"style":"width:100%; height:100%;"});
      container.appendChild( vueDom );

      //min-height:'+ Kim.windowHeight +'px;
      app.jqwindowDIV.attr({"style":'z-index:100; position:absolute; top:0; left:0; right:0; top:0; bottom:0; background:#FFF; transition: all .3s; -webkit-transition:all .3s; overflow:hidden; min-height:'+ window.innerHeight +'px;'+ (app.animateIn ? hideCss : showCss)});
      
      Kim.Config.$PageRoot.append(container);

      //是否动画进入
      if(app.animateIn){
        setTimeout(function(){
          app.jqwindowDIV.css({"transform":"scale(1) translateX(0)","-webkit-transform":"scale(1) translateX(0)"});
        },100);

        //隐藏其他div 减少内存 防止溢出页面崩溃
        setTimeout(function(){
          var counter = 0;
          for(var i in Kim.App){
            counter++;

            if(i != app.tid && counter > 1){ Kim.App[i].jqwindowDIV.hide(); }
          }

          //关闭遮罩
          Kim.FnLoad_loading(false);
        },1000);
      }else{
        //关闭遮罩
        Kim.FnLoad_loading(false);
      }

      app.loadToWin      = true;

      //植入 vue初始化组件模版
      $vueDom.html(app.template);


      //初始化页面vue 对象实例
      Kim.VUE_loader({
        el:vueDom,
        data:{
          appid:app.tid,
          currentUrl:Kim.VUE_EMPTYPAGE,
        }
      },function(_vue){
        app.vue = _vue;

        //加载页面组件 完毕后加载 初始化页面组件
        Kim.VUE_loadComponent(app._pathurl,function(){

          if(app.loadNow && !app.loaded && app.template){
            app.loaded = true;
            
            //初始化 页面
            setTimeout(function(){
              Kim.FnLoad_lock = false;

              //加载页面组件
              app.vue.currentUrl = Kim.VUE_RouterPathDeal(app._pathurl);
            },800);
          }

          if(callback){callback();}
        });
      });
    },


    Aloader:function(a){
      if(!Kim.inited){
        return false;
      }
      
      var aim = $(a);

      var title = aim.attr("data-title");
      var opt = {
        url:aim.attr("data-url"),
        loadNow:true,
        title:title ? title : Kim.Config.title
      };

      Kim.FnLoad(opt);
    },

    //获取模板文件
    getTemplate:function(u,callback){
      KJ.Fnpageloader(u,function(){
        callback(KJ.getApp(u));
      });
    },

    //页面处理url
    hashchange:function(data){
      //console.log(data);

      if(Kim.FnLoad_lock){
        //console.log("lock_new_tid");
        return false;
      }

      data.e.preventDefault();

      //console.log(data);

      var oldUrl = data.e.oldURL;
      var newURL = data.e.newURL;

      var newapp = newURL.split("#");
      var oldapp = oldUrl.split("#");

      //console.log([newapp,oldapp]);

      var oldTid = parseInt(oldapp.length>=2 && oldapp[1] != "" ? oldapp[1] : 1);
      var newTid = parseInt(newapp.length>=2 && newapp[1] != "" ? newapp[1] : 1);

      //console.log([oldTid,newTid,Kim.activeApp]);

      //前进后返回断掉
      if(newTid == Kim.activeApp){
        return false;
      }

      //hash 变化方向 0返回 1前进
      var direction = oldTid<newTid ? 1 : 0;

      //console.log({oldTid:oldTid,newTid:newTid,direction:direction});

      //location前进则强制返回
      if(direction){
        history.go(-1);
        return false;
      }

      //console.log(newTid);

      if(newTid && Kim.App[newTid]){
        var showApp = Kim.App[newTid];

        //显示当前app
        showApp.jqwindowDIV.show();

        if(!showApp.loaded){
          showApp.loaded = true;

          setTimeout(function(){
            showApp.vue.currentUrl = Kim.VUE_RouterPathDeal( showApp._pathurl );
          },800);
        }else{
          showApp.EventDeal("WINRELOAD");
        }

        Kim.activeApp = newTid;
      }else{
        Kim.activeApp = 0;
      }
      
      if(Kim.App[oldTid]){
        var app = Kim.App[oldTid];

        app.jqwindowDIV.css({"transform":"scale(.8) translateX(120%)","-webkit-transform":"scale(.8) translateX(120%)"});

        setTimeout(function(){
          app.shutdown();
        },600);
      }
    },

    //路径转换组件地址
    VUE_RouterPathDeal:function(page){
      return page.replace(/\//g,'-');
    },

    //vue组件根目录
    VUE_ROOT:"",

    //vue js运行工具点
    VUE_SCRIPTRUN:false,
    $VUE_SCRIPTRUN:false,

    //已经注册的组件
    VUE_COMPONENT:{},

    //组件样式
    VUE_COMPONENT_CSS:{},

    //组件样式 dom
    VUE_COMPONENT_CSSDOM:document.createElement("div"),

    //当前已加载样式数据
    VUE_COMPONENT_CSSLIST:{},

    //加载并发锁
    VUE_LOADLOCK:false,

    //自动处理加载vue
    VUE_loader:function(opt,callback){
      Kim.VUE_AutoLoadComponent(typeof(opt.el) == typeof("x419") ? document.querySelector(opt.el) : opt.el,function(){
        callback(new Vue(opt));
      });
    },

    //传入对象dom自动处理加载组件
    VUE_AutoLoadComponent:function(dom,callback){
      var list = [];

      var domlist;

      var VUE_AUTOLOADDOM = document.createElement('div');

      var clear = function(){
        VUE_AUTOLOADDOM.innerHTML = "";
        VUE_AUTOLOADDOM = null;
      }

      if(typeof(dom) == typeof("x")){
        VUE_AUTOLOADDOM.innerHTML = dom;
        domlist = VUE_AUTOLOADDOM.querySelectorAll("*[K-VUE-COMPONENT]");

        //组件中存在 template 标签处理
        var templateComponent = Kim.VUE_templateComponent(VUE_AUTOLOADDOM.querySelectorAll('template'));
      }else{
        domlist = dom.querySelectorAll("*[K-VUE-COMPONENT]");

        //组件中存在 template 标签处理
        var templateComponent = Kim.VUE_templateComponent(dom.querySelectorAll('template'));
      }


      if(Kim.DEBUG){
        console.log(["组建加载",domlist]);
      }


      if(templateComponent.length > 0){
        for(var i=0;i<templateComponent.length;i++){
          list.push( templateComponent[i] );
        }
      }
      

      //无组件
      if(domlist.length <= 0 && list.length <= 0){
        if(callback){ callback(); }

        clear();
        return false;
      }

      for(var i=0;i<domlist.length;i++){
        list.push( domlist[i].localName.replace(/-/g,"/") );
      }

      Kim.VUE_useComponent(list,function(){
        if(callback){ callback(); }
        clear();
      });
    },


    //获取tempate下的组件列表
    VUE_templateComponent:function(templateList){
      var list = [];

      var VUE_AUTOLOADDOM = document.createElement('div');

      for(var i in templateList){
        VUE_AUTOLOADDOM.innerHTML = templateList[i].innerHTML;

        var domlist = VUE_AUTOLOADDOM.querySelectorAll("*[K-VUE-COMPONENT]");

        for(var j=0;j<domlist.length;j++){
          list.push( domlist[j].localName.replace(/-/g,"/") );
        }

        var subList = VUE_AUTOLOADDOM.querySelectorAll('template');

        if(subList.length > 0){
          var subChild = Kim.VUE_templateComponent(subList);

          for(var j=0;j<subChild.length;j++){
            list.push( subChild[j] );
          }
        }
        
      }

      VUE_AUTOLOADDOM.innerHTML = '';
      VUE_AUTOLOADDOM = null;

      return list;
    },


    //批量加载组件
    VUE_useComponent:function(list,callback){
      var count = list.length;
      var index = 0;

      var loader = function(){
        Kim.VUE_loadComponent(list[index],function(){
          index++;

          if(index >= list.length){
            if(callback){ callback(); }
          }else{
            loader();
          }
        });
      }

      loader();
    },

    //加载vue 组件
    VUE_loadComponent:function(component,callback){
      var componentName = component.replace(/\//g,'-');

      if(Kim.VUE_COMPONENT[component]){
        if(callback){ callback(); }
        return false;
      }

      //并发锁
      if(Kim.VUE_LOADLOCK){
        setTimeout(function(){
          Kim.VUE_loadComponent(component,callback ? callback : false);
        },500);
        return false;
      }

      Kim.VUE_LOADLOCK = true;

      //初始化 js注册运行点
      if(!Kim.VUE_SCRIPTRUN){
        Kim.VUE_SCRIPTRUN = document.createElement('div');

        Kim.$VUE_SCRIPTRUN = $(Kim.VUE_SCRIPTRUN);

        Kim.$VUE_SCRIPTRUN.css({"display":"none"});

        $("body").append(Kim.VUE_SCRIPTRUN);
      }

      var VUE_DEALDOM = document.createElement("div");

      Kim.getTemplate(Kim.VUE_ROOT + component,function(html){
        //解除锁定
        Kim.VUE_LOADLOCK = false;

        Kim.VUE_COMPONENT[component] = true;

        //组建名称赋值
        html = html.replace(/__COMPONENT__/g,"'" + componentName + "'");

        //组建模版赋值
        VUE_DEALDOM.innerHTML = html;

        var template = VUE_DEALDOM.querySelector("script[type='text/html']").innerHTML;

        html = html.replace(/__TEMPLATE__/g,"`" + template + "`");

        //处理样式数据
        var style = VUE_DEALDOM.querySelector("style");

        if(style){
          if(style.className == "GLOBAL"){
            if(window.layui && layui.laytpl){
              layui.laytpl(style.innerHTML).render({},function(cssCode){
                style.innerHTML = cssCode;
              });

              document.head.appendChild(style);
            }else{
              document.head.appendChild(style);
            }
            
          }else{
            Kim.VUE_COMPONENT_CSS[component] = style.innerHTML;
          }
        }

        VUE_DEALDOM.innerHTML = "";
        VUE_DEALDOM = null;

        //自动加载依赖组件
        Kim.VUE_AutoLoadComponent(template,function(){
          //运行注册 并清理注册
          Kim.$VUE_SCRIPTRUN.html(html);
          //Kim.$VUE_SCRIPTRUN.append(html);
          Kim.$VUE_SCRIPTRUN.html('');

          if(callback){ callback(); }

          //加载组件CSS 到页面
          if(Kim.VUE_COMPONENT_CSS[component] && !Kim.VUE_COMPONENT_CSSLIST[component]){
            var elStyle       = document.createElement("style");

            if(window.layui && layui.laytpl){
              layui.laytpl(Kim.VUE_COMPONENT_CSS[component]).render({},function(cssCode){
                elStyle.innerHTML = cssCode;
              });
            }else{
              elStyle.innerHTML = Kim.VUE_COMPONENT_CSS[component];
            }

            //设置样式已被加载
            Kim.VUE_COMPONENT_CSSLIST[component] = true;

            Kim.VUE_COMPONENT_CSSDOM.appendChild(elStyle);
          }
        });
      });
    },
  }

  Kim.init();
})();