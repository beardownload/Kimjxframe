(function(){
  var APP = window[KJ.CONFIG.appObject];
  
  var BabelApp = {
    // 插件地址  kimjxframe/less.min.js
    plugPath:'https://cdn.bootcdn.net/ajax/libs/babel-standalone/7.0.0-beta.3/babel.min.js',
    promiseSoppurt:'https://cdn.bootcdn.net/ajax/libs/babel-polyfill/7.12.1/polyfill.min.js',
    
    // 初始化后 指向插件
    BabelApp:false,
    
    // less处理配置
    RenderConfig:{ presets: ['stage-0','es2015','es2016','es2017','es2015-loose','es2015-no-commonjs'] },
    
    initCheck:function(callback){
      if(window.Babel){
        callback();
      }else{
        setTimeout(function(){
          BabelApp.initCheck(callback);
        },100);
      }
    },
    
    init:function(){
      KJ.Fnuse([
        // [BabelApp.coreJs,'js'],
        [BabelApp.plugPath,'js']
      ],function(){
        BabelApp.BabelApp = window.Babel;
        
        // if(typeof(Promise) === 'undefined'){
          KJ.Fnuse([
            [BabelApp.promiseSoppurt,'js']
          ],function(){
            
          });
        // }
      });
    },
    
    // 处理
    render:function(scriptCode,callback){
      BabelApp.initCheck(function(){
        callback(Babel.transform(scriptCode,BabelApp.RenderConfig).code);
      });
    }
  }
  
  BabelApp.init();
  APP.BabelApp = BabelApp;
})();