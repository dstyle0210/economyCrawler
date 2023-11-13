import {task} from "gulp";
import {chromium,devices} from "playwright";
const TelegramBot = require('node-telegram-bot-api');
const token = '6168835435:AAEX-jYqum2mD4N2ath6_QihrqjPC5GJ-C4';
const chatId = 6252259316;

task("test",async (done) => {
    const browser = await chromium.launch({headless:true});
    const page = await browser.newPage();

    await page.goto("https://www.hankyung.com/tag/%EB%AA%A8%EB%8B%9D%EB%B8%8C%EB%A6%AC%ED%95%91");
    await new Promise((res) => setTimeout(res,1000));
    const hankyungNews = await page.evaluate(() => {
        return $(".news-tit a").eq(0).attr("href");
    });

    await page.goto("https://www.mk.co.kr/search?word=%EB%A7%A4-%EC%84%B8-%EC%A7%80");
    await new Promise((res) => setTimeout(res,1000));
    const mkNews = await page.evaluate(() => {
        const news = $(".news_item").filter((idx,item) => {
            return (/매경이 전하는 세상의 지식/).test( $(item).find(".news_ttl").text() );
        });
        return news.eq(0).attr("href");
    });

    await page.goto("https://www.bloomberg.co.kr/blog/");
    await new Promise((res) => setTimeout(res,1000));
    const bloombergNews = await page.evaluate(() => {
        return jQuery(".h3-regular-8 a").eq(0).attr("href");
    });

    await page.goto("https://blog.naver.com/PostList.naver?blogId=ranto28");
    await new Promise((res) => setTimeout(res,1000));
    const mer = await page.evaluate(() => {
        const trs = [];
        (document.querySelectorAll(".blog2_categorylist tbody tr")).forEach((tr) => {
            trs.push(tr);
        });
        const targetTrs = trs.filter((tr) => {
            const src = (tr.querySelector(".date.pcol2").innerText).split(".").map((txt:string)=>txt.trim());

            if(!(/[0-9]{4}/gi).test(src[0])){
                return true;
            };

            const today = new Date();
            today.setHours( today.getHours()+9 );
            const prevDay = (today.getDay()==1) ? 3 : 1; // 월요일이면 3일뺀다, 아니면 어제 기준

            const guideDate = new Date();
            guideDate.setHours( guideDate.getHours()+9 );
            guideDate.setDate(guideDate.getDate()-prevDay);

            const postDate = new Date(src[0],(src[1]-1),src[2]);
            postDate.setHours(postDate.getHours()+9);

            return (guideDate < postDate);
        });

        const result = targetTrs.map((tr)=>tr.querySelector("a").href);
        return result;
    });

    // 텔레그램봇 시작
    const bot = new TelegramBot(token, {polling: false});

     // 텔레그램 발송
     const cardList = [hankyungNews,mkNews,bloombergNews , ...mer];
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