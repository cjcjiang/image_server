$(document).ready(function(){
    $('#image_uploader_form').ajaxForm(function(result) {
        console.log(result);
        $('#url_display_area').html(result);
    });

    $('#zip_uploader_form').ajaxForm(function(result) {
        console.log(result);
        var url_list = "";
        result.forEach(function (access_url) {
            url_list = url_list + access_url + "<br>";
        });
        $('#url_display_area').html(url_list);
    });
});