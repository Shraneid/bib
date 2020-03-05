const fetch = require("node-fetch");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let contents = "";
const url = "https://locationiq.com/v1/search_sandbox.php?format=json&q=45+avenue+puvis+de+chavannes&accept-language=en"; // site that doesn’t send Access-Control-*

var xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", url, false); // false for synchronous request
xmlHttp.send(null);
contents = xmlHttp.responseText;

console.log(contents);
console.log(JSON.parse(contents));
contents = JSON.parse(contents)[0];
console.log(contents.lat + "\n" + contents.lon);

function calculateDistance(lat1, lon1, lat2, lon2) {
    let radlat1 = Math.PI * lat1 / 180
    let radlat2 = Math.PI * lat2 / 180
    let radlon1 = Math.PI * lon1 / 180
    let radlon2 = Math.PI * lon2 / 180
    let theta = lon1 - lon2
    let radtheta = Math.PI * theta / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    return dist
}

arr = [
    { lat: 60, lon: 80 },
    { lat: 10, lon: 30 },
    { lat: 10, lon: -30 },
    { lat: 20, lon: -15 },
    { lat: 25, lon: 20 }
]
console.log(arr);
var act_pos = { lat: 10, lon: 30 }
arr.sort(function (a, b) {
    return calculateDistance(act_pos.lat, act_pos.lon, a.lat, a.lon) - calculateDistance(act_pos.lat, act_pos.lon, b.lat, b.lon);
});
for (pos in arr) {
    console.log(calculateDistance(act_pos.lat, act_pos.lon, arr[pos].lat, arr[pos].lon));
}
console.log(arr);