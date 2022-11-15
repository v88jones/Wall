$(document).ready(function(){
    $('body')
        .on('submit', '#post_message_form', post_message)
        .on('submit', '.post_comment_form', post_comment)
        .on('click', '.delete_comment', delete_comment)
})

function post_message(e){
    e.preventDefault();
    var form = $(this);

    $.post(form.attr('action'), form.serialize(), function(response){
        if(response.status){
            $('#messages').prepend(response.html);
        }
    }, 'json')

    return false;
}
function post_comment(e){
    e.preventDefault();
    var form = $(this);

    $.post(form.attr('action'), form.serialize(), function(response){
        if(response.status){
            form.parent().find('.comment_section').append(response.html)
        }
    }, 'json')

    return false;
}
function delete_comment(e){
    e.preventDefault();
    var btn = $(this);

    $.post('/comments/delete',{comment_id: btn.attr('data-comment-id')}, function(response){
        if(response.status){
            btn.parents('.posted_comments')[0].remove();
        }
    }, 'json')

    return false;
}