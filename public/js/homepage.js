$(document).ready(function(){
    $('#image_uploader_form').ajaxForm(function(result) {
        console.log(result);
        $('#url_display_area').html(result);
    });

    $('#zip_uploader_form').ajaxForm(function(result) {
        console.log(result);
        $('#url_display_area').html(result);
    });
});