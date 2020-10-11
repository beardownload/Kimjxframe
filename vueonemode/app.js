(function(){
  /**
   * 加载基础插件 页面框架单页面试 适合后台使用
   * VUE 单实例版
   * 页面全部以组件形式 书写
   * 插件全由 bootCDN 提供 https://www.bootcdn.cn/
   */
  window.Kim = {
    DEBUG:true,

    init:function(){
      this.Fnloadplugin();
    },

    //加载初始化基础插件
    Fnloadplugin:function(){
      var _this = this;

      //目录
      _this.RootPath  = KJ.CONFIG.root + "";

      var list = [
        ["https://cdn.bootcss.com/font-awesome/5.8.2/css/all.min.css","css"],
        ["https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js","js"],

        //引入layui
        ["https://cdn.bootcdn.net/ajax/libs/layui/2.5.6/layui.min.js","js"],

        //加载核心 vue
        ["https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js","js"],

        [_this.RootPath + "static/css/style.css","css"],

        //加载配置文件
        [_this.RootPath + "static/js/site.js","js"],
      ];

      KJ.Fnuse(list,function(){
        //加载layui插件
        _this.Fnloadlayuiplugin();
      });
    },

    //加载其他插件 修改此处可
    Fnloadlayuiplugin:function(){
      var _this = this;

      //加载layui插件
      layui.use(["form","layer","laypage","laytpl"],function(){
        _this.Fnpageinit();
      });
    },

    //页面框架初始化
    Fnpageinit:function(){
      var _this = this;

      var hash = location.hash;

      Kim.nowPagePath = hash == "" || hash == "#" ? KJ.CONFIG.defaultpage : location.hash.split('?')[0].replace("#","");

      var framepage = KJ.CONFIG.defaultframe;

      //创建 组件css
      Kim.VUE_COMPONENT_CSSDOM.style["display"] = "none";
      document.body.appendChild(Kim.VUE_COMPONENT_CSSDOM);

      _this.VUE_loadComponent(framepage,function(){
        Kim.VUE_EMPTYPAGE = "K-VUE-EMPTYPAGE";

        //空组件 页面过度作用 促使强制刷新页面组件
        Vue.component(Kim.VUE_EMPTYPAGE,{props:["G"],template:''});

        //创建vue对象
        _this.vue = new Vue({
          el:KJ.CONFIG.appdom,

          data:{
            currentRoute:'',
          },

          computed:{
            ViewComponent:function(){
              return Vue.component( _this.VUE_RouterPathDeal(this.currentRoute) );
            }
          },

          render:function(h){
            return h(this.ViewComponent);
          },

          updated:function(){
            if(!_this.vue_page){
              _this.vue_page = _this.vue.$children[0];

              _this.hashchangeID = KJ.Fnregistevent("hashchange",_this.Fnhashchange);

              //关闭css清理
              _this.VUE_UNDEALCSSCLEANER = true;
              KJ.Fnhashchange();
            }
          }
        });


        //console.log(_this.vue);

        //修改此处 可修改入口的框架页
        _this.vue.currentRoute = framepage;
      });
    },

    //hash事件处理
    Fnhashchange:function(data){
      //console.log("Kim.hashchange",data);

      var page   = data.hash.page ? data.hash.page : KJ.CONFIG.defaultpage;

      Kim.nowPagePath = page;
      window.GET      = data.hash.GET;

      //清理老页面 独享css Kim.VUE_UNDEALCSSCLEANER 可控制一次清理
      if(Kim.VUE_UNDEALCSSCLEANER){
        Kim.VUE_UNDEALCSSCLEANER = false;
      }else{
        Kim.VUE_COMPONENT_CSSDOM.innerHTML = '';
        Kim.VUE_COMPONENT_CSSLIST          = {};
      }
      

      Kim.VUE_loadComponent(page,function(){
        Kim.vue_page.currentComponent = Kim.VUE_EMPTYPAGE;

        setTimeout(function(){
          Kim.vue_page.currentComponent = Kim.VUE_RouterPathDeal(page);
        },100);
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

    //获取模板文件
    getTemplate:function(u,callback){
      KJ.Fnpageloader(u,function(){
        callback(KJ.getApp(u));
      });
    },




    /**
     * vue相关功能 函数配置
     */
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
      Kim.VUE_AutoLoadComponent(opt.el,function(){
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
      }else{
        domlist = dom.querySelectorAll("*[K-VUE-COMPONENT]");
      }

      //组件中存在 template 标签处理
      var templateComponent = Kim.VUE_templateComponent(VUE_AUTOLOADDOM.querySelectorAll('template'));


      if(Kim.DEBUG){
        console.log(["组建加载",domlist]);
      }


      if(templateComponent.length > 0){
        for(var i=0;i<templateComponent.length;i++){
          list.push( templateComponent[i] );
        }
      }
      

      //无组件
      if(domlist.length <= 0){
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
            document.head.appendChild(style);
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