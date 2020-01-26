const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
    const $ = cheerio.load(data);
    let names = [];
    const parent = $('.section-main .search-results__column .row h5').each(
        function(i, elem) {
            names.push($(this).text().trim());
        });
    return names;
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
const scrapeRestaurant = async url => {
    let count = 1;
    let temp = [1, 2]
    let final = []

    do {
        const response = await axios(url + count.toString());
        const { data, status } = response;

        if (status >= 200 && status < 300) {
            temp = parse(data);
        } else {
            console.error(status);
            return null;
        }
        final = final.concat(temp);
        count++;
    } while (temp.length > 0)

    return final;
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = () => {
    return [];
};

let txt = scrapeRestaurant('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/');
let variable = "";
txt.then(response => console.log(response));