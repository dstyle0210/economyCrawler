import {task} from "gulp";
import {chromium,devices} from "playwright";
const TelegramBot = require('node-telegram-bot-api');
const token = '6168835435:AAEX-jYqum2mD4N2ath6_QihrqjPC5GJ-C4';
const chatId = 6252259316;

task("test",async (done) => {
    const browser = await chromium.launch({headless:true});
    const page = await browser.newPage();

    await page.goto("https://www.hankyung.com/tag/%EB%AA%A8%EB%8B%9D%EB%B8%8C%EB%A6%AC%ED%95%91");
    const hankyungNews = await page.evaluate(() => {
        return $(".news-tit a").eq(0).attr("href");
    });

    await page.goto("https://www.mk.co.kr/search?word=%EB%A7%A4-%EC%84%B8-%EC%A7%80");
    const mkNews = await page.evaluate(() => {
        const news = $(".news_item").filter((idx,item) => {
            return (/매경이 전하는 세상의 지식/).test( $(item).find(".news_ttl").text() );
        });
        return news.eq(0).attr("href");
    });
    // 텔레그램봇 시작
    const bot = new TelegramBot(token, {polling: false});

     // 텔레그램 발송
     const cardList = [hankyungNews,mkNews];
     for(let card of cardList){
        bot.sendMessage(chatId, "[NEWS] "+card);
    };

    // await new Promise((resolve)=>setTimeout(resolve,660000)); // 11분 후 닫음 (텔레그램은 연결 후 10분 이내 끊을경우 429에러 발생함 , Error: ETELEGRAM: 429 Too Many Requests: retry after 599)
    await new Promise((resolve)=>setTimeout(resolve,1000)); // 개발용 1초 있다가 닫음 (그냥 에러 나는걸로..)

    await browser.close();
    // bot.sendMessage(chatId, "닫습니다");
    // await bot.close();
    done(); 
});


// firebase
/*
import { initializeApp } from 'firebase/app';
import { getDatabase , set , ref ,onValue } from 'firebase/database';
task("test2",(done) => {
    const firebaseConfig = {
        databaseURL: "https://dstyle-action-crawler-default-rtdb.firebaseio.com",
    };
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const dbRef = ref(db, 'users/');

    // read
    onValue(dbRef,(snapshot) => {
        const data = snapshot.val();
        console.log(data);
        done();
        process.exit(0);
    })
    // create , update 
    set(dbRef, {
        username: "asd",
        email: "이메일44",
        profile_picture : "src"
      }).then(()=>{
        done();
      });
})
*/