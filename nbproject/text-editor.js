//file:             text-editor.php
//project:          AJAXTextEditor
//author:			Adam Currie & Dylan O'Neill
//first version:	2015-11-29
//description:      online text editor using AJAX
var xmlhttp;

if (window.XMLHttpRequest){
    xmlhttp = new XMLHttpRequest();
}else{
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}


//Function: addEventCrossPlatform()
//Desc: adds an event listener to an element
//parameters: 
//  element: the element to add the event for
//  eventText: the event
//  listener: the listener for the event
//returns: void
function addEventCrossPlatform(element, eventText, listener){
    if(element.addEventListener){
        element.addEventListener("click", listener);
    }else if(element.attachEvent){
        element.attachEvent("on"+eventText, listener);
    }
}

//Function: filesDropDown()
//Desc: sends the ajax request to get the files to open the dropdown
//parameters: none
//returns: void
function filesDropDown(){
    xmlhttp.onreadystatechange = filesDropDownCallback;
    xmlhttp.open("GET", "text-file-management.php?request=getFileList", true);
    xmlhttp.send(null);
}

//Function: tryHideFilesDropdown()
//Desc: hides the drop down if it is the caller
//parameters: 
//  e: event
//returns: void
function tryHideFilesDropdown(e){
    if (!e) e = window.event;
    var target = (e.target || e.srcElement);

    if(target.id === "files-dropdown"){  
        hideFilesDropdown();
    }
}

//Function: hideFilesDropdown()
//Desc: hides the drop down
//parameters: none
//returns: void
function hideFilesDropdown(){
    var dropdown = document.getElementById("files-dropdown");
    dropdown.style.display = "none";
}

//Function: filesDropDownCallback()
//Desc: callback for the server response to the files list request, populates and shows the dropdown menu
//parameters: none
//returns: void
function filesDropDownCallback(){
    if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
        var files = xmlhttp.responseText.split("\n");
        var dropdown = document.getElementById("files-dropdown");
        dropdown.innerHTML = "";
        var width = 0;
        dropdown.style.display = "block";
           
        for(var i = 0; i < files.length; i++){
            var btn = document.createElement("button");
            var text = document.createTextNode(files[i]);
            btn.appendChild(text);
            addEventCrossPlatform(btn, "click", loadFile);
            
            dropdown.appendChild(btn);
            dropdown.appendChild(document.createElement("br"));
            btn.style.height = "1.7em";
            
            if(btn.offsetWidth > width){
                for(var j = 0; j < dropdown.childElementCount; j++){
                    dropdown.children[j].style.width = btn.offsetWidth + "px";
                }
            }
        }
        
        dropdown.style.height = (btn.offsetHeight*i)+"px";
    }
}

//Function: loadFile()
//Desc: load file button press handler, sends request to get file from server
//parameters: 
//  e: event
//returns: void
function loadFile(e){
    if (!e) e = window.event;
    var target = (e.target || e.srcElement);
    
    xmlhttp.onreadystatechange = loadFileCallback;
    xmlhttp.open("GET", "text-file-management.php?request=loadFile&file="+target.firstChild.nodeValue, true);
    xmlhttp.send(null);
    
    document.getElementById("file-name-input").value = target.firstChild.nodeValue;
    hideFilesDropdown();
}

//Function: loadFile()
//Desc: callback for a request to load a file, sets the editor text to the contents of the file recieved from the server
//parameters: 
//returns: void
function loadFileCallback(){
    if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
        if(xmlhttp.responseText != ''){
            document.getElementById("editor-text").value = xmlhttp.responseText;
        }
    }
}

//Function: loadFile()
//Desc: saves the text from "edito-text" to the server with the file name specified by the "file-name-input" element
//parameters: 
//returns: void
function saveFile(){
    var text = document.getElementById("editor-text").value;
    var name = document.getElementById("file-name-input").value;
    name = name.trim();
    
    if(name != ''){
        if (confirm("Are you sure you want to save as " + name + "?")) {
            xmlhttp.open("POST", "text-file-management.php");
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send("request=saveFile&text="+text+"&name="+name);
        }
    }else{
        alert("Please specify a file name to save as.");
    }
}