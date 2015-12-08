<?php
/*
file:			text-file-management.php
project:		JSONjQueryTextEditor
author:			Adam Currie & Dylan O'Neill
first version:	2015-12-07
description:	online text editor using jQuery and JSON
*/

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    if($_GET['request'] === 'getFileList'){
        
        $files = scandir('./MyFiles');
        for($i = 0; $i < count($files); $i++){
            if($files[$i] == '.' || $files[$i] == '..'){
                unset($files[$i]);
            }
        }
        
        $files = array_values($files);//reset indexes
        
        echo json_encode($files);
        
    }else if($_GET['request'] === 'loadFile'){ 
        $data['name'] = $_GET['file'];
        $data['contents'] = file_get_contents('./MyFiles/' . $_GET['file'], FILE_USE_INCLUDE_PATH);

        echo json_encode($data);
    }
}

else if($_SERVER['REQUEST_METHOD'] === 'POST'){
    
    $saveInfo = json_decode(file_get_contents('php://input'), true);
    
    if ($saveInfo['request'] === 'saveFile'){
        file_put_contents('./MyFiles/' . $saveInfo['name'], $saveInfo['text']);
    }
}