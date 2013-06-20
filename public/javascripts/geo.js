var socket = io.connect();

ymaps.ready(function () {

    var map = new ymaps.Map("YMapsID", {
        center: [57.154655, 65.557382],
        zoom: 13,
        behaviors: ['default', 'scrollZoom']
    });

    var myCollection = new ymaps.GeoObjectCollection();

    socket.on('recive', function(phones){
        myCollection.removeAll();
        console.log(phones);

        for(var key in phones){
            var data = phones[key];
            var point = new ymaps.GeoObject({
                geometry: {
                    type: 'Point',
                    coordinates: [data.latitude, data.longitude]
                },
                properties: {
                    iconContent: data.phone + " - " + data.name
                }
            }, {
                preset: 'twirl#redStretchyIcon'
            });
            point.events.add('click', function(e){
                console.log(e);
                var thisPlacemark = e.get('target');
                var coords = thisPlacemark.geometry.getCoordinates();
                map.setCenter(coords, 17, {});
                //map.panTo(coords,{});
            });
            myCollection.add(point);
        }
        
        map.geoObjects.add(myCollection);
    });
});