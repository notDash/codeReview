/**
 * Created by lishengyong on 2016/9/28.
 */

var path = document.getElementById("filePath").value ;
var xhr = createXHR();
function createXHR() {
    var xhr;
    if(window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject();
    }
    return xhr;
}

document.getElementById("reviewStart").addEventListener('click', function(){
    /*xhr.open('POST', '/getFile');
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            if( xhr.status === 200 ) {
                console.log(xhr.responseText);
                document.getElementById("reviewResult").innerHTML = xhr.responseText;
            }
        }
    }
    xhr.send("filePath=" + document.getElementById("filePath").value);*/
    $.ajax({
        url:'/getFile',
        type:'POST',
        data:"filePath=" + document.getElementById("filePath").value,
        dataType:"json",
        success:function(data) {
            console.log(data);
            var html = '';
            if(data && data.length > 0) {
                for(var i = 0, len = data.length; i < len; i++) {
                    html += '<li>';
                    html += '<div>';
                    html += '<p>文件名： ' + data[i].file + '</p>';
                    html += '<p>行号： ' + data[i].lineNumber + '</p>';
                    html += '<p>代码： ' + data[i].code + '</p>';
                    html += '<p>审查结果： ' + data[i].rule + '</p>';
                    html += '</div>';
                    html += '</li>';
                }
            }
            $('#reviewResult')[0].innerHTML = html;
        },
        error: function(){

        }
    });
});


