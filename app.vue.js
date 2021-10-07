(function(){
  var APP_VUE = {
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
    VUE_COMPONENT_CSSDOM:document.head,
    
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
        
        //CSS前缀名称处理
        html = html.replace(/__CSSPRENAME__/g,componentName);
        
        // 相对路径处理
        var PathArray = componentName.split('-');
        PathArray.reverse().splice(0,1)
        html = html.replace(/__PATH__/g,PathArray.reverse().join('-'));

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
    }
  }
  
  for(var i in APP_VUE){
    Kim[i] = APP_VUE[i];
  }
})()