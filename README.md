# Discord MusicBot Addon _ 한글패치 & 일부기능 추가 & 일부 버그 수정
***  
약간의 기능을 추가하고 수정하였으며, 문구들을 한글로 번역하였습니다. 

추천하는 설정:
```javascript
client.music = require('discord.js-musicbot-addon');
client.music.start(client, {

  youtubeKey: "유튜브api키",
  botPrefix: "^", //봇 Prefix
  anyoneCanSkip: true, //누구나 스킵가능
  anyoneCanAdjust: true,
  maxQueueSize: 0, //0 = 무제한 
  botAdmins: [], //관리자 ID
  anyoneCanLeave: true, 
  bitRate: "200000", //비트레이트 설정 
  defVolume: 100, //기본 볼륨
  play: {
    enabled: false,
    help: "이름 또는 링크로 노래를 검색 없이 바로 재생합니다. ^재생 노래이름",
    name: "바로재생", // 사실상 거의 사용되지 않는 명령어입니다
    exclude: true
  },
  join: {
    enabled: true, 
    alt: ["j", "참가", "join"], 
    exclude: true
  },
  remove: {
    enabled: true,
    help: "큐에서 노래를 제거합니다.		(`^제거 번호`)", 
    name: "제거", 
    alt: ["제거", "삭제", "rm"],
    exclude: false 
  },
  leave: {
    enabled: true, 
    alt: ["퇴장", "left", "l"], 
    help: "음성채널에서 퇴장합니다.		(`^퇴장`,`^left`,`^l`)", 
    name: "퇴장", 
    exclude: false 
  },
  search: {
    enabled: true,
    alt: ["재생", "p", "play"],
    help: "노래를 재생합니다.		(`^p 노래이름`,`^재생 노래이름`)", 
    name: "재생", 
    exclude: false
  },
  pause: {
    enabled: true, 
    alt: ["pa", "일시정지"], 
    help: "현재 노래를 일시정지합니다.		(`^pa`,`^일시정지`)", 
    name: "일시정지", 
    exclude: false
  },
  resume: {
    enabled: true,
    alt: ["re", "다시재생"],
    help: "노래를 다시 재생합니다.		(`^re`,`^다시재생`)",
    name: "다시재생",
    exclude: false 
  },
  volume: {
    enabled: true,
    alt: ["볼륨", "소리", "v"], 
    help: "소리크기 조절합니다.		(`^볼륨`,`^소리`,`^v`)",
    name: "볼륨",
    exclude: false
  },
  queue: {
    enabled: true, 
    alt: ["큐", "q"],
    help: "현재 노래 목록을 봅니다.		(`^q`,`^큐`)",
    name: "큐",
    exclude: false
  },
  loop: {
    enabled: true,
    alt: ["반복", "loop", "lo"],
    help: "노래를 반복합니다.		(`^반복`,`^loop`,`^lo`)",
    name: "반복",
    exclude: false
  },
  clear: {
    enabled: true,
    help: "노래목록을 초기화힙니다.		(`^초기화`)",
    name: "초기화",
    exclude: false
  },
  np: {
    enabled: true,
    help: "현재 재생중인 곡의 정보를봅니다.		(`^np`)",
    name: "np",
    exclude: false
  }
});
```


https://github.com/DarkoPendragon/discord.js-musicbot-addon
