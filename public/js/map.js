mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12", //style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    //In general we have to add latitude first then longitude but here in mapbox it is different.
    zoom: 9, // starting zoom
});

// For Adding Images in Place of Icon

// map.on("load", () => {
//     // Load an image from an external URL.
//     map.loadImage(
//         "https://docs.mapbox.com/mapbox-gl-js/assets/cat.png",
//         (error, image) => {
//             if (error) throw error;

//             // Add the image to the map style.
//             map.addImage("cat", image);

//             // Add a data source containing one point feature.
//             map.addSource("point", {
//                 type: "geojson",
//                 data: {
//                     type: "FeatureCollection",
//                     features: [
//                         {
//                             type: "Feature",
//                             geometry: {
//                                 type: "Point",
//                                 coordinates: coordinates,
//                             },
//                         },
//                     ],
//                 },
//             });

//           map.addLayer({
//                 id: 'points',
//                 type: 'symbol',
//                 source: 'point',
//                 layout: {
//                     'icon-image': 'cat',
//                     'icon-size': 0.25
//                 }
//             });

//         }
//     );
// });

// console.log(coordinates);
const marker1 = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
    .setPopup(
        new mapboxgl.Popup({ offset: 25})
            .setHTML(`<h4>${listing.location}</h4><p>Exact Location Provided after booking</p>`)
    )
    .addTo(map);
