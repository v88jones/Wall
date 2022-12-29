$(document).ready(function(){
    $('body')
        .on('submit', '.post_form', post_message)
        .on('click', '.delete_btn', delete_message)
})

function post_message(e){
    e.preventDefault();
    var form = $(this);
    
    $.post(form.attr('action'), form.serialize(), function(response){
        if(response.status){
            window.location.reload()
        }
        else{
            alert(response.message);
        }
    }, 'json')

    return false;
}

function delete_message(e){
    e.preventDefault();
    var btn = $(this);
    var params = {
        id: btn.attr('data-id'),
        is_message: btn.attr('data-is_message')
    }

    $.post('/messages/delete', params, function(response){
        if(response.status){
            window.location.reload()
        }
        else{
            alert(response.message);
        }
    }, 'json')

    return false;
}
