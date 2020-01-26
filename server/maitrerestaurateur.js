const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const util = require("util");

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
    let final = []
    if (true){
        let count = 1;
        let temp = [1, 2]
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
    } else {
        console.log("Read from file");
    }

    return final;
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = () => {
    try{
        var final = fs.readFileSync("bib.json").toString();
        final = JSON.parse(final);
    } catch (err) {
        loadData();
        var final = module.exports.get(); 
    }
    return final;
};

async function loadData(){
    var txt = await scrapeRestaurant('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/');
    console.log(txt);
    txt = JSON.stringify(txt);
    fs.writeFile('bib.json', txt, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
}

console.log(module.exports.get());

