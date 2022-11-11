$(document).ready(function(){
    $('body')
        .on('submit', '#login_form', login)
        .on('submit', '#register_form', register)
})

function login(e){
    e.preventDefault();
    var form = $(this);
    
    $.post(form.attr('action'), form.serialize(), function(response){
        console.log(response);
        if(response.status){
            window.location.href = '/dashboard';
        }
        else{
            $('.login_message').text(response.message);
        }
    }, 'json')

    return false;
}

function register(e){
    e.preventDefault();
    var form = $(this);

    $.post(form.attr('action'), form.serialize(), function(response){
        if(response.message){
            $('.register_message').text(response.message);
        }
    }, 'json');

    return false;
}