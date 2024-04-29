import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

async function getData() {
  try {
    const url = 'https://www.veleri.hr/hr/novosti';
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);


    const tableRows = $('table.cols-0 tbody tr'); 

    const items = [];
    tableRows.each((index, element) => {
      const text = $(element).text().trim().replace(/\s+/g, ' ');
      items.push(text);
    });

    console.log(items); 
  } catch (error) {
    console.error(error);
  }
}

getData();
