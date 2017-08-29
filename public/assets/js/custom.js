$(document).ready(function () {
    
    $('#submit-form').click(function() {
       
        $.ajax({
            type: 'POST',
            url: '/form-submit',
            data: {
                name: $('#name').val(),
                email: $('#email').val(),
                message: $('#message').val()
            },
            
            success: function(response) {
                alert(response);
            },
            
            fail: function(response) {
                alert(response);
            }
        });
    });
});
