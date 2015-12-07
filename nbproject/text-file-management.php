<!--
file:			text-file-management.php
project:		AJAXTextEditor
author:			Adam Currie & Dylan O'Neill
first version:	2015-11-29
description:	online text editor using AJAX
-->
<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    if($_GET['request'] === 'getFileList'){
        
        $files = scandir('./MyFiles');
        for($i = 0; $i < count($files); $i++){
            if($files[$i] != '.' && $files[$i] != '..'){
                echo $files[$i];
                if($i != count($files)-1){
                    echo "\r\n";     
                }
            }
        }
        
    }else if($_GET['request'] === 'loadFile'){ 
        
        echo file_get_contents('./MyFiles/' . $_GET['file'], FILE_USE_INCLUDE_PATH);  
    }
}

else if($_SERVER['REQUEST_METHOD'] === 'POST'){
    
    if($_POST['request'] === 'saveFile'){
        
        $text = $_POST['text'];
        file_put_contents('./MyFiles/' . $_POST['name'], $text);
    }
}