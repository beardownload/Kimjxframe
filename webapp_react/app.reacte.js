(function(){
  /**
   * React 模式
   *
   * React 17.0.1 
   * Babel 7.0.0
   */
  var _this = Kim;

  _this.REACT = {
    loaded:false,

    init:function(callback){
      Kim.use([
        [this.config.react_pro,"js"],
        [this.config.react_dom_pro,"js"],
        [this.config.babel,"js"],
      ],function(){

        _this.REACT.loaded = true;

        document.body.appendChild(_this.REACT.REACT_COMPONENT_CSSDOM);

        if(callback){
          callback();
        }
      });
    },

    config:{
      //babel依赖
      babel:"https://cdn.bootcdn.net/ajax/libs/babel-standalone/7.0.0-beta.3/babel.min.js",

      //react 核心引入
      react_pro:"https://cdn.bootcdn.net/ajax/libs/react/17.0.1/umd/react.production.min.js",
      react_dom_pro:"https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.1/umd/react-dom.production.min.js",
    },

    //路径转换组件地址
    REACT_RouterPathDeal:function(page){
      return page.replace(/\//g,'_');
    },

    //react组件名称 特性 首字母大写处理
    REACT_COMPONENT_NameDeal:function(name,totype){
      var result = "";

      switch(totype){
        //组件名称转换回路径
        case "PATH":
          result = name.replace(/_/g,"/").toLocaleLowerCase();
          break

        //首字母大写 处理
        case "NAME":
          var newname = name.split('');
          newname[0] = newname[0].toLocaleUpperCase();
          result = newname.join('');
          break;

        case "PTHTONAME":
          var newname = name.replace(/\//g,'_').split('');
          newname[0]  = newname[0].toLocaleUpperCase();
          result      = newname.join('');
      }

      return result;
    },

    //REACT组件根目录
    REACT_ROOT:"",

    //REACT js运行工具点
    REACT_SCRIPTRUN:false,
    $REACT_SCRIPTRUN:false,

    //已经注册的组件
    REACT_COMPONENT:{},

    //组件样式
    REACT_COMPONENT_CSS:{},

    //组件样式 dom
    REACT_COMPONENT_CSSDOM:document.createElement("div"),

    //当前已加载样式数据
    REACT_COMPONENT_CSSLIST:{},

    //加载并发锁
    REACT_LOADLOCK:false,

    //自动处理加载REACT  component:index/index => index/index.html 组件作为初始
    REACT_loader:function(component,container,callback){
      _this.REACT.REACT_loadComponent(component,function(){
        var componentName = _this.REACT.REACT_COMPONENT_NameDeal(component,"PTHTONAME");
        
        //console.log(componentName);
        var Component = window[componentName];

        var c = ReactDOM.render(React.createElement(Component, null), typeof(container) == typeof("x419") ? document.querySelector(container) : container);

        if(callback){ callback(c); }
      });
    },

    //传入对象dom自动处理加载组件
    REACT_AutoLoadComponent:function(dom,callback){
      var list = [];

      var domlist;

      var REACT_AUTOLOADDOM = document.createElement('div');

      //console.log([REACT_AUTOLOADDOM]);

      var clear = function(){
        REACT_AUTOLOADDOM.innerHTML = "";
        REACT_AUTOLOADDOM = null;
      }

      if(typeof(dom) == typeof("x")){
        REACT_AUTOLOADDOM.innerHTML = dom;
        domlist = REACT_AUTOLOADDOM.querySelectorAll("*[K-REACT-COMPONENT]");
      }else{
        domlist = dom.querySelectorAll("*[K-REACT-COMPONENT]");
      }


      if(Kim.DEBUG){
        console.log(["组建加载",domlist]);
      }
      

      //无组件
      if(domlist.length <= 0 && list.length <= 0){
        if(callback){ callback(); }

        clear();
        return false;
      }

      for(var i=0;i<domlist.length;i++){
        list.push( domlist[i].localName.replace(/_/g,"/").toLocaleLowerCase() );
      }

      _this.REACT.REACT_useComponent(list,function(){
        if(callback){ callback(); }
        clear();
      });
    },


    //批量加载组件
    REACT_useComponent:function(list,callback){
      var count = list.length;
      var index = 0;

      var loader = function(){
        _this.REACT.REACT_loadComponent(list[index],function(){
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

    //加载REACT 组件 component 为组件路径 index/index
    REACT_loadComponent:function(component,callback){
      var componentName = _this.REACT.REACT_COMPONENT_NameDeal( _this.REACT.REACT_RouterPathDeal(component),"NAME");

      if(_this.REACT.REACT_COMPONENT[component]){
        if(callback){ callback(); }
        return false;
      }

      //并发锁
      if(_this.REACT.REACT_LOADLOCK){
        setTimeout(function(){
          _this.REACT.REACT_loadComponent(component,callback ? callback : false);
        },500);
        return false;
      }

      _this.REACT.REACT_LOADLOCK = true;

      //初始化 js注册运行点
      if(!_this.REACT.REACT_SCRIPTRUN){
        _this.REACT.REACT_SCRIPTRUN = document.createElement('div');

        Kim.$REACT_SCRIPTRUN = $(_this.REACT.REACT_SCRIPTRUN);

        Kim.$REACT_SCRIPTRUN.css({"display":"none"});

        $("body").append(_this.REACT.REACT_SCRIPTRUN);
      }

      var REACT_DEALDOM = document.createElement("div");

      //console.log(component);

      Kim.getTemplate(_this.REACT.REACT_ROOT + component,function(html){
        //解除锁定
        _this.REACT.REACT_LOADLOCK = false;

        _this.REACT.REACT_COMPONENT[component] = true;

        //组建名称赋值
        html = html.replace(/__CLASS__/g,componentName);

        //组建模版赋值
        REACT_DEALDOM.innerHTML = html;

        //处理样式数据
        var style = REACT_DEALDOM.querySelector("style");

        //处理代码数据
        var code  = REACT_DEALDOM.querySelector("script").innerHTML;

        //console.log(code);

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
            _this.REACT.REACT_COMPONENT_CSS[component] = style.innerHTML;
          }
        }

        

        REACT_DEALDOM.innerHTML = "";
        REACT_DEALDOM           = null;

        //自动加载依赖组件
        _this.REACT.REACT_AutoLoadComponent(code,function(){
          code = Babel.transform(code,{
            presets:["es2015","react"]
          }).code;

          //console.log(code);

          var script = document.createElement("script");
          script.innerHTML = code;

          //运行注册 并清理注册
          Kim.$REACT_SCRIPTRUN.append(script);
          $(script).remove();

          //Kim.$REACT_SCRIPTRUN.append(html);
          Kim.$REACT_SCRIPTRUN.html('');

          if(callback){ callback(); }

          //加载组件CSS 到页面
          if(_this.REACT.REACT_COMPONENT_CSS[component] && !_this.REACT.REACT_COMPONENT_CSSLIST[component]){
            var elStyle       = document.createElement("style");

            if(window.layui && layui.laytpl){
              layui.laytpl(_this.REACT.REACT_COMPONENT_CSS[component]).render({},function(cssCode){
                elStyle.innerHTML = cssCode;
              });
            }else{
              elStyle.innerHTML = _this.REACT.REACT_COMPONENT_CSS[component];
            }

            //设置样式已被加载
            _this.REACT.REACT_COMPONENT_CSSLIST[component] = true;

            _this.REACT.REACT_COMPONENT_CSSDOM.appendChild(elStyle);
          }
        });
      });
    },
  };

  //_this.REACT.init();
})();