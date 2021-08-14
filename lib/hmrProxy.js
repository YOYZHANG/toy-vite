// browser

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('message', function ({data}) {
    console.log(data, '[debug] change data');
    const {type, path} = JSON.parse(data);
    console.log(type, 'type');

    switch (type) {
        case 'connection':
            console.log('[vds]connection');
            break;
        case 'full-reload':
            console.log('[vds]full-reload');
            location.reload();
    }
});

socket.addEventListener('close', function() {
    console.log('[vds]server connection lost');
})