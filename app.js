import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import * as nodemailer from 'nodemailer';

let news = {};

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

    for (let i = 0; i < items.length; i++) {
        const date = items[i].substring(0, 9);
        const information = items[i].substring(10);
        news[i] = {
            date,
            information
        };
    }
    
    console.log(news[0])
  } catch (error) {
    console.error(error);
  }
  main();
}

getData();

const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    auth: {
        user: 'obavijesti.veleri@outlook.com',
        pass: 'veleriobavijesti123'
    }
});

async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"VeleriMAIL" <obavijesti.veleri@outlook.com>', // sender address
      to: "patrik.slat@gmail.com", // list of receivers
      subject: "Nova VeleRI Obavijesti", // Subject line
      text: "", // plain text body
      html: `<pre>${JSON.stringify(news[0], null, 2)}</pre>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
