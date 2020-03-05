const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const util = require("util");
const iconv = require('iconv-lite');

axios.interceptors.response.use(response => {
    let ctype = response.headers["content-type"];
    if (ctype.includes("charset=ISO-8859-1")) {
        response.data = iconv.decode(response.data, 'ISO-8859-1');
    }
    return response;
})

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
    const $ = cheerio.load(data);
    let names = [];
    const parent = $('.single_desc .single_libel a').each(
        function(i, elem) {
            let tmp = $(elem).text().trim();
            names.push($(elem).text().trim().toLowerCase().split('(')[0].trim());
        });
    return names;
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
const scrapeRestaurant = async() => {
    let final = []
    if (true) {
        let count = 1;
        let temp = [1, 2]
        var dat = "";
        do {
            console.log(count.toString());
            dat = "page=" + count.toString() + '&sort=undefined&request_id=d8621c7d35c333e0b1411fa47bacfe81&annuaire_mode=&annuaire_action=&annuaire_action_arg=&annuaire_appli=&annuaire_as_no=';
            //console.log(dat);
            const response = await axios({
                method: 'post',
                url: 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: dat,
                responseType: 'arraybuffer',
                reponseEncoding: 'binary'
            });
            const { data, status } = response;

            //console.log(data);

            if (status >= 200 && status < 300) {
                temp = parse(data);
            } else {
                console.error(status);
                return null;
            }
            final = final.concat(temp);
            //console.log(final);
            count++;
        } while (temp.length > 0)
    } else {
        console.log("Read from file");
    }

    return final;
};

async function loadData() {
    let txt = "";
    try {
        txt = fs.readFileSync("maitrerestaurateur.json").toString();
        //console.log(txt);
        console.log("data loaded");
    } catch (error) {
        console.log(error);
        txt = await scrapeRestaurant();
        console.log("Saving to JSON...");
        txt = JSON.stringify(txt);
        fs.writeFile('maitrerestaurateur.json', txt, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    }
    return txt;
}

module.exports.get = async() => {
    let restaurants = await loadData();
    return restaurants;
};

(async() => {
    const rest = await module.exports.get();

    //console.log("rest : " + rest);
    console.log("baboobaboo");
})();