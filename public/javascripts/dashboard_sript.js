$(document).ready(function(){
    $('body')
        .on('submit', '#message_form', post_message)
        .on('submit', '.comment_form', post_comment)
        .on('click', '.delete_comment', delete_comment)
})

function post_message(e){
    e.preventDefault();
    var form = $(this);

    $.post(form.attr('action'), form.serialize(), function(response){
        if(response.status){
            $('#message_board').prepend(response.html);
        }
    }, 'json');
    return false;
}

function post_comment(e){
    e.preventDefault();
    var form = $(this);

    $.post(form.attr('action'), form.serialize(), function(response){
        if(response.status){
            form.parents('.posted_message').find('.comment_board').append(response.html);
        }
    }, 'json');

    return false;
}

function delete_comment(e){
    e.preventDefault();
    var button = $(this);

    $.post('/comments/delete', {comment_id: button.attr('data-comment-id')}, function(response){
        console.log(response)
        if(response.status){
            button.parents('.posted_comments')[0].remove();
        }
    }, 'json');

    return false;
}