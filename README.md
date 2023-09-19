# economyCrawler
github의 action을 이용해서, 경제지표, 경제뉴스 텔레그램으로 받기.
- 오전 11시 (cron 0 3 * * 1-5) / github가 UTC+0 을 기준함.
- 매일경제 : 매-세-지
- 한국경제 : 모닝브리핑
- 블룸버그 : 블로그
  
```powershell
> Set-ExecutionPolicy RemoteSigned
```

```console
> git config --global user.name dstyle0210
> git config --global user.email dstyle0210@gmail.com
```
