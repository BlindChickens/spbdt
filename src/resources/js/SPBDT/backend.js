export function post(url, data) {
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(data),
        dataType: 'json',
    })
        .always(console.log('Started request...'))
        .done(function (data) {
            console.log('Finished request...');
            console.log(data.result);
            console.log(data.data);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log('Finished request...');
            console.log(textStatus);
            console.log(errorThrown);
        });
}

export function getUser(id){
    let data = {
        id: id,
    }
    post('/quarterback/getUser', data);
}