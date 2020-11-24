<?php
class apideal{
  private $tryfile = false;

  //html模式
  public function html($GET){
    if(file_exists($GET["page"])){
      exit( file_get_contents($GET["page"]) );
    }

    if(!$this->tryfile){
      $this->tryfile = true;

      $jsfile = str_replace(".html", ".js", $GET["page"]);

      $page = file_get_contents($jsfile);

      exit( '<script>'. $page .'</script>' );
    }
  }


  public function js($GET){
    $htmlfile = str_replace(".js", ".html", $GET["page"]);
    $filepath = str_replace(".js", "", $GET["page"]);

    if(file_exists($htmlfile)){
      $page = file_get_contents($htmlfile);
      
      exit( '(function(){
        var TPL = `'. $page .'`;

        KJ.Fnregistpage(TPL,false,"'. $filepath .'");
      })();');
    }


    if(file_exists($GET["page"])){
      exit( file_get_contents($GET["page"]) );
    }
  }


  private function JsonReturn($data = [],$code = 200,$msg = "操作成功"){
    exit(json_encode([
      "result" => $data,
      "code"   => $code,
      "msg"    => $msg
    ]));
  }
}


header("access-control-allow-origin: *");

$get = $_GET;

$api = new apideal($get);

$fun = $get["runmode"];

$api->$fun($get);