(function(){
  var APP = window[KJ.CONFIG.appObject];
  
  var LessApp = {
    // 插件地址  kimjxframe/less.min.js
    plugPath:'https://cdnjs.cloudflare.com/ajax/libs/less.js/3.11.1/less.min.js',
    
    // 初始化后 指向插件
    lessApp:false,
    
    // less处理配置
    lessRenderConfig:{
      env: APP.DEBUG ? 'development' : 'production',
      async: false,
      logLevel: 2,
      
      // 全局变量
      globalVars: {
        //var1: '"quoted value"',
      },
    },
    
    initCheck:function(callback){
      if(window.less){
        callback();
      }else{
        setTimeout(function(){
          LessApp.initCheck(callback);
        },100);
      }
    },
    
    init:function(){
      KJ.Fnuse([
        [LessApp.plugPath,'js']
      ],function(){
        
      });
    },
    
    // css 处理
    render:function(style,callback){
      LessApp.initCheck(function(){
        window.less.render(style,LessApp.lessRenderConfig).then(function(result){
          // console.log(result)
          callback(result.css)
        }).catch(function(){
          console.warn('less编译出错')
          callback(style)
        });
      });
    }
  }
  
  LessApp.init();
  APP.LessApp = LessApp;
})();