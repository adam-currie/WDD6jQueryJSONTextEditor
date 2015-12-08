//file:             text-editor.js
//project:          JSONjQueryTextEditor
//author:			Adam Currie & Dylan O'Neill
//first version:	2015-12-07
//description:      online text editor using JSON and jQuery

$(document).ready(function(){
    $("#files-dropdown").mouseleave(hideFilesDropdown);
    $("#open-button").click(filesDropDown);
    $("#save-button").click(saveFile);
});


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
    $.get("text-file-management.php?request=getFileList", filesDropDownCallback);
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
function filesDropDownCallback(data, status){
    if(status === "success"){
        var files = eval("("+data+")");
        
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
    
    $.get("text-file-management.php?request=loadFile&file="+target.firstChild.nodeValue, loadFileCallback);
    
    hideFilesDropdown();
}

//Function: loadFileCallback(data, status)
//Desc: callback for a request to load a file, sets the editor text to the contents of the file recieved from the server
//parameters: 
//returns: void
function loadFileCallback(data, status){
    if(status === "success"){
        var file = eval("("+data+")");
        
        if(file.contents !== ''){
            document.getElementById("editor-text").value = file.contents;
            document.getElementById("file-name-input").value = file.name;
        }
    }
}

//Function: saveFile()
//Desc: saves the text from "editor-text" to the server with the file name specified by the "file-name-input" element
//parameters: 
//returns: void
function saveFile(){
    
    var JSONobject = { "request":"saveFile", "text":document.getElementById("editor-text").value, "name":document.getElementById("file-name-input").value };
    JSONobject.name = JSONobject.name.trim();
    var saveInfo = JSON.stringify(JSONobject);
        
    if(JSONobject.name !== ''){
        if (confirm("Are you sure you want to save as " + JSONobject.name + "?")) {
            $.post("text-file-management.php", saveInfo);
        }
    }else{
        alert("Please specify a file name to save as.");
    }
}