$(document).ready(function(){
    $('#image_uploader_form').ajaxForm(function(result) {
        console.log(result);
        $('#display_area').html(result);
    });
});