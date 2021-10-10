(function(){
  var APP = window[KJ.CONFIG.appObject];
  
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
      APP.VUE_AutoLoadComponent(typeof(opt.el) == typeof("x419") ? document.querySelector(opt.el) : opt.el,function(){
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
        var templateComponent = APP.VUE_templateComponent(VUE_AUTOLOADDOM.querySelectorAll('template'));
      }else{
        domlist = dom.querySelectorAll("*[K-VUE-COMPONENT]");
    
        //组件中存在 template 标签处理
        var templateComponent = APP.VUE_templateComponent(dom.querySelectorAll('template'));
      }
    
    
      if(APP.DEBUG){
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
    
      APP.VUE_useComponent(list,function(){
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
          var subChild = APP.VUE_templateComponent(subList);
    
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
        APP.VUE_loadComponent(list[index],function(){
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
    
      if(APP.VUE_COMPONENT[component]){
        if(callback){ callback(); }
        return false;
      }
    
      //并发锁
      if(APP.VUE_LOADLOCK){
        setTimeout(function(){
          APP.VUE_loadComponent(component,callback ? callback : false);
        },500);
        return false;
      }
    
      APP.VUE_LOADLOCK = true;
    
      //初始化 js注册运行点
      if(!APP.VUE_SCRIPTRUN){
        APP.VUE_SCRIPTRUN = document.createElement('div');
    
        APP.$VUE_SCRIPTRUN = $(APP.VUE_SCRIPTRUN);
    
        APP.$VUE_SCRIPTRUN.css({"display":"none"});
    
        $("body").append(APP.VUE_SCRIPTRUN);
      }
    
      var VUE_DEALDOM = document.createElement("div");
    
      APP.getTemplate(APP.VUE_ROOT + component,function(html){
        //解除锁定
        APP.VUE_LOADLOCK = false;
    
        APP.VUE_COMPONENT[component] = true;
    
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
        
        //处理样式数据
        var scoped     = false;
        var scopedHash = new Date().getTime();
        var cssList = [];
        var style = VUE_DEALDOM.querySelectorAll("style");

        if(style && style.length){
          for(var i=0;i<style.length;i++){
            var _scoped = style[i].getAttribute('scoped') !== null;
            
            cssList.push({
              css:style[i].innerHTML,
              scoped:_scoped,
              scopedHash:scopedHash
            });
            
            // 是否启用作用域
            if(_scoped){
              scoped = true;
            }
          }
          
          APP.VUE_COMPONENT_CSS[component] = true;
        }
        
        if(scoped){
          // console.log('scoped',scoped)
          template = APP.VUE_SCOPED_HTMLDEAL(template,scopedHash);
        }
    
        html = html.replace(/__TEMPLATE__/g,"`" + template + "`");
    
        VUE_DEALDOM.innerHTML = "";
        VUE_DEALDOM = null;
        
        //自动加载依赖组件
        APP.VUE_AutoLoadComponent(template,function(){
          //运行注册 并清理注册
          APP.$VUE_SCRIPTRUN.html(html);
          // APP.$VUE_SCRIPTRUN.append(html);
          APP.$VUE_SCRIPTRUN.html('');
          
          // 加载组件CSS 到页面
          if(APP.VUE_COMPONENT_CSS[component] && !APP.VUE_COMPONENT_CSSLIST[component]){
            APP.VUE_CSS_LOADER(component,cssList);
          }
    
          if(callback){ callback(); }
        });
      });
    },
    
    // 作用域处理
    VUE_SCOPED_PRENAME:'k-data-',
    VUE_SCOPED_HTMLDEAL:function(html,scoped){
      var resultCode = '';
      
      html = html.replace(/template/g,'template-dealtag');
      
      var VUE_DEALDOM = document.createElement("div");
      var $VUE_DEALDOM = $(VUE_DEALDOM);
      
      $VUE_DEALDOM.html(html);
      $VUE_DEALDOM.find('*').attr(APP.VUE_SCOPED_PRENAME + scoped,'');
      
      resultCode = $VUE_DEALDOM.html();
      VUE_DEALDOM.innerHTML = '';
      VUE_DEALDOM = null;
      
      resultCode = resultCode.replace(/template-dealtag/g,'template');
      // console.log(resultCode);
      return resultCode;
    },
    
    /* CSS 处理 */
    VUE_CSS_LOADER:function(component,cssList){
      // console.log('处理样式列表',cssList);
      for(var i=0;i<cssList.length;i++){
        var rawCode = cssList[i];
        var elStyle = document.createElement("style");

        if(window.layui && layui.laytpl){
          layui.laytpl(rawCode.css).render({},function(cssCode){
            if(APP.LessApp){
              APP.LessApp.render(cssCode,function(_cssCode){
                elStyle.innerHTML = APP.VUE_CSSSCOPED_DEAL(_cssCode,rawCode);
              });
            }else{
              elStyle.innerHTML = APP.VUE_CSSSCOPED_DEAL(cssCode,rawCode);
            }
          });
        }else{
          elStyle.innerHTML = APP.VUE_CSSSCOPED_DEAL(rawCode.css,rawCode);
        }
      }

      //设置样式已被加载
      APP.VUE_COMPONENT_CSSLIST[component] = true;
      APP.VUE_COMPONENT_CSSDOM.appendChild(elStyle);
    },
    
    // css私有域处理
    VUE_CSSSCOPED_REGEX:/(\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g,
    VUE_CSSSCOPED_DEAL:function(cssCode,scopedItem){
      if(scopedItem.scoped){
        return cssCode.replace(APP.VUE_CSSSCOPED_REGEX,"$1["+ APP.VUE_SCOPED_PRENAME + scopedItem.scopedHash +"]");
      }
      
      return cssCode;
    }
  }
  
  for(var i in APP_VUE){
    APP[i] = APP_VUE[i];
  }
})()