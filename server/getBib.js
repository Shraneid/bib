const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const util = require("util");

const scrapePage = async (data, restaurant) => {
    const $ = cheerio.load(data);
    const titleDiv = $('.restaurant-details__heading--title').eq(0);
    //console.log(titleDiv.text());
    restaurant.name = titleDiv.text().trim().toLowerCase();

    const addressDiv = $('.restaurant-details__heading--list').eq(0).find('li').eq(0);
    //console.log(addressDiv.text().trim());
    restaurant.address = addressDiv.text().trim().toLowerCase();

    const cuisineDiv = $('.restaurant-details__heading-price').eq(0);
    //console.log(cuisineDiv.text().split("Cuisine")[1].trim());
    try {
        restaurant.cuisine = cuisineDiv.text().split("Cuisine")[1].trim().toLowerCase();
    }
    catch (error) {
        restaurant.cuisine = cuisineDiv.text().split("• ")[1].trim().toLowerCase();
    }

    //PUSHING TO LIST OF RESTAURANT OBJECTS
    restaurants.push(restaurant);
}

const scrapeLink = async (link, restaurant) => {
    const response = await axios('https://guide.michelin.com/' + link, restaurant);
    const { data, status } = response;

    if (status >= 200 && status < 300) {
        return new Promise(async function (resolve, reject) {
            const temp = await scrapePage(data, restaurant);
            resolve(temp);
        });
    } else {
        console.error(status);
    }
};

const scrapeEveryRestaurant = async data => {
    const $ = cheerio.load(data);
    const parent = $('.js-restaurant__list_items');

    parent.find('.col-md-6').each(async function (i, elem) {
        let restaurant = {};
        let child = $(this).find('.card__menu');

        restaurant.lat = child.attr('data-lat');
        restaurant.lon = child.attr('data-lng');

        let link = child.children('a').eq(0).attr('href');

        var promise = scrapeLink(link, restaurant);
        promises.push(promise);
    });
};

const scrapeMichelin = async url => {
    let count = 1;
    do {
        console.log(count);
        const response = await axios(url + count.toString());
        const { data, status } = response;

        if (status >= 200 && status < 300) {
            await scrapeEveryRestaurant(data);
        } else {
            console.error(status);
        }
        count++;
    } while (count < 154)
};

module.exports.get = async () => {
    try {
        txt = fs.readFileSync("bibRestaurants.json").toString();
        //console.log(txt);
        console.log("data loaded");
    } catch (error) {
        await scrapeMichelin('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/');
        Promise.all(promises).then(async _ => {
            let txt = JSON.stringify(restaurants);
            fs.writeFile('bibRestaurants.json', txt, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
        });
    }
};

var promises = [];
var restaurants = [];
module.exports.get();