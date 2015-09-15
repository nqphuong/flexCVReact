<?php

header('Content-type: text/html');
header('Access-Control-Allow-Origin: *');

date_default_timezone_set('Asia/Saigon');

$root = "/home/richard-nguyen/espace_travail/Web/flexCVReact/";
#$root = "/var/www/html/cvreact/FlexCVReact/";

//var_dump($_GET);
$_action = isset($_GET['action']) ? $_GET['action'] : 'index';
$_controller = new SiteController($_action);
$_params = $_REQUEST;
$_params['root'] = $root;
$_controller->run($_params);

class SiteController{
    private $_action = 'index';
    public function __construct($action){
        if($this->validation($action))
            $this->_action = $action;
    }
    
    public function run($params=array()){
        $function = 'action'.$this->_action;
        $this->$function($params);
    }
    
    public function validation($action){
        $apis = array('index',
                      'updatecontent',
                      'addneweducation',
                      'removeeducation',
                      'updateeducation',
                      'loadeducation',
                      'addnewexperience',
                      'removeexperience',
                      'updateexperience',
                      'addnewcontact',
                      'removecontact',
                      'updatecontact',
                      'removeskill',
                      'moveitemskill',
                      'addnewskill',
                      'updateskills',
                      'removelanguage',
                      'moveitemlanguage',
                      'addnewlanguage',
                      'updatelanguages',
                      'removehobby',
                      'moveitemhobby',
                      'addnewhobby');
        
        if(in_array(strtolower($action), $apis))
            return true;
        return false;
    }
    
    public function actionIndex($params=array()){
        echo "actionIndex()<br/>";
    }
    
    //*********************
    //Personnal Information
    //*********************
    public function actionUpdateContent($params=array()){
        $content = isset($params['content']) ? $params['content'] : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;
        
        if($content && $root && $dir && $file){
            if(file_exists($root . $dir . '/' . $file)){
                //chmod($root . $dir . '/' . $file, 0777);
                
                $data = array();
                $data['content'] = $content;
                
                //Open file and write the content
                $fw = fopen($root . $dir . '/' . $file, 'w');
                if($fw){
                    if(fwrite($fw, json_encode(array($data)))){
                        echo json_encode(array($data));
                    } else {echo -4;}
                    fclose($fw);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    //*********
    //Education
    //*********
    public function actionAddNewEducation($params=array()){
        $title = isset($params['title']) ? $params['title'] : false;
        $description = isset($params['description']) ? $params['description'] : false;
        $year = isset($params['year']) ? $params['year'] : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;
        
        if($title && $description && $year && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                
                //Load data from file
                $json = file_get_contents($path);
                $data = json_decode($json);
                
                $fw = fopen($path, 'w');
                if($fw){
                    $new = array();
                    $new['year'] = $year;
                    $new['title'] = $title;
                    $new['description'] = $description;
                    array_unshift($data, $new);
                    
                    //Update file content
                    if(fwrite($fw, json_encode($data))){
                        echo json_encode($data);
                    } else {echo -4;}
                    fclose($fw);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    public function actionRemoveEducation($params=array()){
        $index = isset($params['index']) ? intval($params['index']) : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;
        
        if(($index > -1) && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                //Load data from file
                $json = file_get_contents($path);
                $data = json_decode($json);
                
                if(isset($data[$index])){
                    //Remove item
                    unset($data[$index]);
                    //Reindex data array
                    $new = array();
                    foreach($data as $d){
                        $new[] = get_object_vars($d);
                    }
                    //Update file
                    $fw = fopen($path, 'w');
                    if(fwrite($fw, json_encode($new))){
                        echo(json_encode($new));
                    } else {echo -4;}
                    fclose($fw);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    public function actionLoadEducation($params=array()){
        $index = isset($params['index']) ? intval($params['index']) : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;
        
        if($index > -1 && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                //Load file
                $json = file_get_contents($path);
                $data = json_decode($json);
                if(isset($data[$index])){
                    $item = get_object_vars($data[$index]);
                    echo json_encode($item);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    public function actionUpdateEducation($params=array()){
        $title = isset($params['title']) ? $params['title'] : false;
        $description = isset($params['description']) ? $params['description'] : false;
        $year = isset($params['year']) ? $params['year'] : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;
        $index = isset($params['index']) ? intval($params['index']) : false;
        
        if($index > -1 && $title && $description && $year && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                $json = file_get_contents($path);
                $data = json_decode($json);
                if(isset($data[$index])){
                    $new = array();
                    foreach($data as $k=>$item){
                        $content = get_object_vars($item);
                        if($k == $index){
                            $content['year'] = $year;
                            $content['title'] = $title;
                            $content['description'] = $description;
                        }
                        $new[] = $content;
                    }
                    $fw = fopen($path, 'w');
                    if(fwrite($fw, json_encode($new))){
                        echo json_encode($new);
                    } else {echo -4;}
                    fclose($fw);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    //**********
    //Experience
    //**********
    public function actionAddNewExperience($params=array()){
        $company = isset($params['company']) ? $params['company'] : false;
        $title = isset($params['title']) ? $params['title'] : false;
        $description = isset($params['description']) ? $params['description'] : false;
        $year = isset($params['year']) ? $params['year'] : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;
        
        if($company && $title && $description && $year && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                
                //Load data from file
                $json = file_get_contents($path);
                $data = json_decode($json);
                
                $fw = fopen($path, 'w');
                if($fw){
                    $new = array();
                    $new['company'] = $company;
                    $new['year'] = $year;
                    $new['title'] = $title;
                    $new['description'] = $description;
                    array_unshift($data, $new);
                    
                    //Update file content
                    if(fwrite($fw, json_encode($data))){
                        echo json_encode($data);
                    } else {echo -4;}
                    fclose($fw);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    public function actionRemoveExperience($params=array()){
        $this->actionRemoveEducation($params);
    }
    
    public function actionUpdateExperience($params=array()){
        $company = isset($params['company']) ? $params['company'] : false;
        $title = isset($params['title']) ? $params['title'] : false;
        $description = isset($params['description']) ? $params['description'] : false;
        $year = isset($params['year']) ? $params['year'] : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;
        $index = isset($params['index']) ? intval($params['index']) : false;
        
        if($index > -1 && $company && $title && $description && $year && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                $json = file_get_contents($path);
                $data = json_decode($json);
                if(isset($data[$index])){
                    $new = array();
                    foreach($data as $k=>$item){
                        $content = get_object_vars($item);
                        if($k == $index){
                            $content['company'] = $company;
                            $content['year'] = $year;
                            $content['title'] = $title;
                            $content['description'] = $description;
                        }
                        $new[] = $content;
                    }
                    $fw = fopen($path, 'w');
                    if(fwrite($fw, json_encode($new))){
                        echo json_encode($new);
                    } else {echo -4;}
                    fclose($fw);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    //*******
    //Contact
    //*******
    public function actionAddNewContact($params=array()){
        $info = isset($params['info']) ? $params['info'] : false;
        $description = isset($params['description']) ? $params['description'] : false;
        $icon = isset($params['icon']) ? $params['icon'] : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;

        if($info && $description && $icon && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                
                //Load data from file
                $json = file_get_contents($path);
                $data = json_decode($json);
                
                $fw = fopen($path, 'w');
                if($fw){
                    $new = array();
                    $new['icon'] = $icon;
                    $new['info'] = $info;
                    $new['description'] = $description;
                    array_unshift($data, $new);
                    
                    //Update file content
                    if(fwrite($fw, json_encode($data))){
                        echo json_encode($data);
                    } else {echo -4;}
                    fclose($fw);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    public function actionRemoveContact($params=array()){
        $this->actionRemoveEducation($params);
    }
    
    public function actionUpdateContact($params=array()){
        $info = isset($params['info']) ? $params['info'] : false;
        $description = isset($params['description']) ? $params['description'] : false;
        $icon = isset($params['icon']) ? $params['icon'] : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;
        $index = isset($params['index']) ? intval($params['index']) : false;
        
        if($index > -1 && $info && $icon && $description && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                $json = file_get_contents($path);
                $data = json_decode($json);
                if(isset($data[$index])){
                    $new = array();
                    foreach($data as $k=>$item){
                        $content = get_object_vars($item);
                        if($k == $index){
                            $content['icon'] = $icon;
                            $content['info'] = $info;
                            $content['description'] = $description;
                        }
                        $new[] = $content;
                    }
                    $fw = fopen($path, 'w');
                    if(fwrite($fw, json_encode($new))){
                        echo json_encode($new);
                    } else {echo -4;}
                    fclose($fw);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    //*****
    //Skill
    //*****
    public function actionRemoveSkill($params=array()){
        $this->actionRemoveEducation($params);
    }
    
    public function actionMoveItemSkill($params=array()){
        $index = isset($params['index']) ? $params['index'] : false;
        $move = isset($params['move'])? $params['move'] : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;
        if($index > -1 && $move && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                //Load data from file
                $json = file_get_contents($path);
                $data = json_decode($json);
                
                if(isset($data[$index])){
                    $renew = false;
                    if(($move == "up" && $index == 0) ||
                       ($move =="down" && $index == count($data) - 1)){
                        echo json_encode($data);
                    } else {
                        if($move == "up"){
                            if(isset($data[$index-1])){
                                $temp = $data[$index-1];
                                $data[$index-1] = $data[$index];
                                $data[$index] = $temp;
                                $renew = true;
                            } else {echo -4;}
                        } else {
                            if(isset($data[$index+1])){
                                $temp = $data[$index+1];
                                $data[$index+1] = $data[$index];
                                $data[$index] = $temp;
                                $renew = true;
                            } else {echo -5;}
                        }
                        if($renew){
                            //Update file
                            $fw = fopen($path, 'w');
                            if(fwrite($fw, json_encode($data))){
                                echo(json_encode($data));
                            } else {echo -6;}
                            fclose($fw);
                        }
                    }
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    public function actionAddNewSkill($params=array()){
        $skill = isset($params['name']) ? $params['name'] : false;
        $percent = isset($params['percent'])? $params['percent'] : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;
        if($skill && $percent && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                
                //Load data from file
                $json = file_get_contents($path);
                $data = json_decode($json);
                
                $fw = fopen($path, 'w');
                if($fw){
                    $new = array();
                    $new['percent'] = $percent;
                    $new['name'] = $skill;
                    array_unshift($data, $new);
                    
                    //Update file content
                    if(fwrite($fw, json_encode($data))){
                        echo json_encode($data);
                    } else {echo -4;}
                    fclose($fw);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    public function actionUpdateSkills($params=array()){
        $content = isset($params['content']) ? $params['content'] :false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file'])? $params['file'] : false;
        
        if($content && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                $fw = fopen($path, 'w');
                if($fw){
                    if(fwrite($fw, $content)){
                        echo $content;
                    } else {echo -4;}
                    fclose($fw);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    //*********
    //Languages
    //*********
    public function actionRemoveLanguage($params=array()){
        $this->actionRemoveEducation($params);
    }
    
    public function actionMoveItemLanguage($params=array()){
        $this->actionMoveItemSkill($params);
    }
    
    public function actionAddNewLanguage($params=array()){
        $name = isset($params['name']) ? $params['name'] : false;
        $percent = isset($params['percent'])? $params['percent'] : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;
        if($name && $percent && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                
                //Load data from file
                $json = file_get_contents($path);
                $data = json_decode($json);
                
                $fw = fopen($path, 'w');
                if($fw){
                    $new = array();
                    $new['item'] = $name;
                    $new['width'] = $percent;
                    array_unshift($data, $new);
                    
                    //Update file content
                    if(fwrite($fw, json_encode($data))){
                        echo json_encode($data);
                    } else {echo -4;}
                    fclose($fw);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
    
    public function actionUpdateLanguages($params=array()){
        $this->actionUpdateSkills($params);
    }
    
    //*****
    //Hobby
    //*****
    public function actionRemoveHobby($params=array()){
        $this->actionRemoveEducation($params);
    }
    
    public function actionMoveItemHobby($params=array()){
        $this->actionMoveItemSkill($params);
    }
    
    public function actionAddNewHobby($params=array()){
        $name = isset($params['name']) ? $params['name'] : false;
        $root = isset($params['root']) ? $params['root'] : false;
        $dir = isset($params['dir']) ? $params['dir'] : false;
        $file = isset($params['file']) ? $params['file'] : false;
        if($name && $root && $dir && $file){
            $path = $root . $dir . '/' . $file;
            if(file_exists($path)){
                
                //Load data from file
                $json = file_get_contents($path);
                $data = json_decode($json);
                
                $fw = fopen($path, 'w');
                if($fw){
                    $new = array();
                    $new['item'] = $name;
                    array_unshift($data, $new);
                    
                    //Update file content
                    if(fwrite($fw, json_encode($data))){
                        echo json_encode($data);
                    } else {echo -4;}
                    fclose($fw);
                } else {echo -3;}
            } else {echo -2;}
        } else {echo -1;}
    }
}