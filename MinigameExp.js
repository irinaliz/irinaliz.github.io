


function calParkAndGame() {
    if (!validation()) return false;
    var lvlUpCnt = 0, nowLvl = 0, oldLevel = Number($("#lvl").val());
    var oldExp = false ? 0 : getIntegerExp(true);
    var playDay = new Date($("#day").val())//Number($("#day").val());
    var today = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
    );
    playDay = Math.ceil((playDay - today) / (1000*60*60*24));
    var minigameEndDate = new Date($("#endDay").val());
    minigameEndDate = new Date(minigameEndDate.getFullYear(), minigameEndDate.getMonth(), minigameEndDate.getDate()-1)
    var playMonsterParkCnt = Number($("#monsterpark").val())
    var lvlExpObjectInfo = new Array();
    var levelUpDay = 0;
    var playType = [...playOrderList];
    for (var i = 0; i < playDay; i++) {
        var newDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + i
        );
        var hasSunday = newDate.getDay() == 0 ? true : false;
        var hasSundayEvent = 0;

        for (var typePlay = 0; typePlay < playType.length; typePlay++) {

            var level = oldLevel + lvlUpCnt;
            var lvreqExp = reqExp[level];
            var dailyGetExpInfo = {};
            if(minigameEndDate >= newDate){
                if(playType[typePlay] == "미니게임"){
                    console.log(`${i+1}일차 미니게임 진행`)
                    var playCnt = mgExphasChg(hasSunday);
                    for(var play = 1; play <= playCnt; play ++){
                        var playGameExp = gameExp[level];
                        oldExp += playGameExp;
                        if(oldExp >= lvreqExp){
                            lvlUpCnt++;
                            oldExp = oldExp - lvreqExp;
                            if(false) {lvlUpCnt++; lvlUpCnt++; }
                        }
                        level = oldLevel + lvlUpCnt;

                        lvlExpObjectInfo.push({
                            'playType' : 'miniGame',
                            'level' : level,
                            'exp' : Number((oldExp / reqExp[level]) * 100).toLocaleString("ko")+"%",
                            'clearExp' : playGameExp,
                            'clearDay' : getDay(newDate.getDay()),
                            'clearDate' : `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`
                        })
                    }
                }
            }

            if(playType[typePlay] == "몬스터 파크"){
                console.log(`${i+1}일차 몬스터 파크 진행`)
                var playCnt = playMonsterParkCnt;
                for(var play = 1; play <= playCnt; play ++){
                    playPark = getMonsterParkExp(level,hasSunday,hasSundayEvent);
                    oldExp += (playPark.exp + playPark.plusExp);
                    if(oldExp >= lvreqExp){
                        lvlUpCnt++;
                        oldExp = oldExp - lvreqExp;
                        if(false) {lvlUpCnt++; lvlUpCnt++; }
                    }
                    level = oldLevel + lvlUpCnt;

                    lvlExpObjectInfo.push({
                        'playType' : 'monsterPark',
                        'level' : level,
                        'exp' : Number((oldExp / reqExp[level]) * 100).toLocaleString("ko")+"%",
                        'clearExp' : (playPark.exp+playPark.plusExp),
                        'clearMonsterParkName' : getMonsterParkName(playPark.exp),
                        'clearDay' : getDay(newDate.getDay()),
                        'clearDate' : `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`
                    })
                }
            }

            if(playType[typePlay] == "일일 퀘스트"){
                console.log(`${i+1}일차 일일 퀘스트 진행`)
                var quest = playDailyQuest(level);
                var forCnt = Object.keys(quest);
                for(var questidx = 0; questidx < forCnt.length; questidx++){
                    var questKillMonsterResult = getDailyPlayingExp(quest,level,questidx);
                    for(var resultListCnt = 0; resultListCnt < questKillMonsterResult.length ; resultListCnt ++){
                        oldExp += questKillMonsterResult[resultListCnt].calCntExp;
                        if(oldExp >= lvreqExp){
                            lvlUpCnt++;
                            oldExp = oldExp - lvreqExp;
                            if(false) {lvlUpCnt++; lvlUpCnt++; }
                        }
                    }
                    level = oldLevel + lvlUpCnt;
                    lvreqExp = reqExp[level];
                    oldExp += getDailyQuestExp(Number( forCnt[questidx]))
                    if(oldExp >= lvreqExp){
                        lvlUpCnt++;
                        oldExp = oldExp - lvreqExp;
                        if(false) {lvlUpCnt++; lvlUpCnt++; }
                    }
                    level = oldLevel + lvlUpCnt;
                    lvlExpObjectInfo.push({
                        'playType' : 'quest',
                        'level' : level,
                        'exp' : Number((oldExp / reqExp[level]) * 100).toLocaleString("ko")+"%",
                        'clearQuest' : getDailyQuestName(getDailyQuestExp(Number( forCnt[questidx]))),
                        'clearQuestExp' : getDailyQuestExp(Number( forCnt[questidx])),
                        'killMonster' : questKillMonsterResult,
                        'clearDay' : getDay(newDate.getDay()),
                        'clearDate' : `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`
                    })
                }
            }
            nowLvl = level;

        }
        //console.log(nowLvl + " (" +  Number((oldExp / reqExp[level]) * 100).toLocaleString("ko") +")")
    }
    return lvlExpObjectInfo;
}
function setGraph(arr){
    if((typeof arr) != 'object') return false;

    var playDay = new Date($("#day").val())//Number($("#day").val());
    var today = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
    );
    playDay = Math.ceil((playDay - today) / (1000*60*60*24));

    $("#parent_ul").children().remove()
    for(var i =0 ; i< arr.length; i++){
        var title = "";
        var description;
        if(arr[i].playType == 'monsterPark'){
            title = "몬스터 파크";
            description = 
            `<div class='card' style='width: 18rem;'>
                <ul class='list-group list-group-flush'>
                    <li class='list-group-item'>일자 : ${arr[i].clearDate}</li>
                    <li class='list-group-item'>요일 : ${arr[i].clearDay}</li>
                    <li class='list-group-item'>마을 : ${arr[i].clearMonsterParkName}</li>
                    <li class='list-group-item'>획득 : ${Number(arr[i].clearExp).toLocaleString("ko")}</li>
                    <li class='list-group-item'>경험치 : ${arr[i].exp}</li>
                </ul>
            </div>
            `;
        }
        if(arr[i].playType == 'miniGame'){
            title = "미니게임";
            description = 
            `<div class='card' style='width: 18rem;'>
                <ul class='list-group list-group-flush'>
                    <li class='list-group-item'>일자 : ${arr[i].clearDate}</li>
                    <li class='list-group-item'>요일 : ${arr[i].clearDay}</li>
                    <li class='list-group-item'>획득 : ${Number(arr[i].clearExp).toLocaleString("ko")}</li>
                    <li class='list-group-item'>경험치 : ${arr[i].exp}</li>
                </ul>
            </div>
            `;
        }
        if(arr[i].playType == 'quest'){
            title = "일일 퀘스트";
            var forList = "";
            for(var moblist = 0; moblist < arr[i].killMonster.length; moblist++){
                forList += `<li class='list-group-item'>
                Lv.${arr[i].killMonster[moblist].level} - ${arr[i].killMonster[moblist].name}
                <br>Exp : ${Number(arr[i].killMonster[moblist].exp).toLocaleString("ko")} - 배율 : ${arr[i].killMonster[moblist].expPer}배
                <br>총 Exp : ${Number(arr[i].killMonster[moblist].calCntExp).toLocaleString("ko")}</li>`
            }
            description = 
            `<div class='card' style='width: 18rem;'>
                <ul class='list-group list-group-flush'>
                    <li class='list-group-item'>일자 : ${arr[i].clearDate}</li>
                    <li class='list-group-item'>요일 : ${arr[i].clearDay}</li>
                    <li class='list-group-item'>마을 : ${arr[i].clearQuest}</li>
                    <li class='list-group-item'>획득 : ${Number(arr[i].clearQuestExp).toLocaleString("ko")}</li>
                    <li class='list-group-item'>경험치 : ${arr[i].exp}</li>
                </ul>
                <div class='card' style='width: 18rem;'>
                    <div class='card-header'>
                        사냥 몬스터
                    </div>
                    <ul class='list-group list-group-flush'>
                    ${forList}
                    </ul>
                </div>
            </div>
            `;
        }

        var li =
            `
            <li class="li">
                <div class="out_div" style="height:${arr[i].exp}">
                    <div class="in_div"
                    ></div>
                </div>
                <div class="div_info"
                data-bs-trigger="hover focus" data-bs-html="true" title="${title}" data-bs-content="${description}"data-bs-toggle="popover"
                >Lv.${arr[i].level}</div>
            </li>
            `
        ;
        $("#parent_ul").append(li);
    }
    $("#parent_ul").css("width",(arr.length*40)+"px");
    maxWidth = document.getElementById("parent_ul_div").scrollWidth - document.getElementById("parent_ul_div").clientWidth;
    $("#parent_ul_div").css("height","370px");
    $("#result_header").text(`결과 - Lv.${arr[arr.length-1].level} (${arr[arr.length-1].exp}) ${playDay}일 진행`)
    
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
}

function setTable() {
    var list = calParkAndGame();
    var tr = "";

    for (var i = 0; i < list.length; i++) {
        if (i % 2 == 0) tr += "<tr>";
        var data = `
                <td>레벨</td>
                <td>${list[i].level}</td>
                <td>${list[i].exp}</td>
                <td>${list[i].day}</td>
                `;
        tr += data;
    }
    $("#tableBody").append(tr);
}

function playDailyQuest(level){
    var lvl = Number(level)
    var playYn = {};
    $.each($(".checklist li .form-check-input"), function(key,value,idx){
        playYn[parseInt($(value).attr("id").replace("q",""))] = $(value).prop("checked")
    })
    var townCnt = getDailyQuestCnt(lvl); //각 마을 퀘스트 진행 회수
    //console.log(townCnt)
    var list = Object.keys(townCnt); // 200 , 210, 220 배열
    var getMobList = new Array(), getMobSet = new Array();
    var getMobInfoList = {}
    for(var i = 0 ; i < list.length ; i ++){ //
        if(!playYn[list[i]]) {
            continue;
        }
    reload : for(var a = 0 ; a < townCnt[list[i]] ; a++){
            var moblist = Object.keys(monsterInfo[list[i]]);
            if(lvl>=205 && list[i] == '200' ) moblist = moblist.concat(Object.keys(monsterInfo[205]))
            if(lvl>=215 && list[i] == '210') moblist = moblist.concat(Object.keys(monsterInfo[215]));
            var random = Math.ceil(Math.random() * moblist.length)-1;
            if(getMobList.includes(moblist[random])){
                a--;
                //console.log("중복! " + moblist[random]+"는 이미 존재")
                continue reload;
            } else {
                getMobList.push(moblist[random]);
                var mobinfo = {
                    "name" : moblist[random],
                    "exp"  : monsterInfo2[moblist[random]]['exp'],
                    "level" : monsterInfo2[moblist[random]]['level']
                }
                getMobSet.push(mobinfo);
            }
        }
        getMobInfoList[list[i]] = getMobSet;
        getMobSet = [];
    }
    return getMobInfoList;
}

function getDailyPlayingExp(object,level,idx){
    var keys = Object.keys(object)[idx]; //0번 입력시 200레벨 추출
    var targetArray = object[keys]; //200레벨의 배열 세팅
    var returnData = new Array();
    for(var i = 0 ; i < targetArray.length; i++){ //225세팅시 -> 200, 210, 220, 225 / 4번 돌음

        getExp = getPenalty(Number(level) , targetArray[i].level, targetArray[i].exp );
        var reqQuestCntExp = 0;
        if(level >= 260 && parseInt(keys,10) >= 260 ) { //받아온 키값레벨이 260이 넘고, 레벨도 260이 넘는다면
            reqQuestCntExp = getExp['exp'] * 1000;
        } else reqQuestCntExp = getExp['exp'] * 200;
        returnData.push({
            'name' : targetArray[i].name,
            'level' : targetArray[i].level,
            'exp' : targetArray[i].exp,
            'getExp' : getExp['exp'],
            'expPer' : getExp['per'],
            'calCntExp' : reqQuestCntExp,
            'questlevel' : keys
        })
        /*
        for(var a = 0; a < object[keys[i]].length; a++){    //200->2, 210 -> 1, 220 -> 2 , 225 -> 3
        //    console.log(parseInt(keys[i]) )//키의 레벨정보
            var getExp = 0;
            if(parseInt(keys[i],10) >= 260 ) {
                getExp = getPenalty(Number(level) , object[keys[i]][a].level, object[keys[i]][a].exp )
                console.log(" 단일 경험치 : " + Number(object[keys[i]][a].exp).toLocaleString("ko") + " | 1000 마리 : " + Number(getExp['exp']*1000).toLocaleString("ko") + " | 레벨 계산 비례 경험치 적용율 : " + Math.floor(getExp['per']*100) +"%" + "| 몹 : " + "Lv."+object[keys[i]][a].level+" "+object[keys[i]][a].name)
            } else {
                getExp = getPenalty(Number(level) , object[keys[i]][a].level, object[keys[i]][a].exp )
                console.log(" 단일 경험치 : " + Number(object[keys[i]][a].exp).toLocaleString("ko") + " | 200 마리 : " + Number(getExp['exp']*200).toLocaleString("ko") + " | 레벨 계산 비례 경험치 적용율 : " + Math.floor(getExp['per']*100)  +"%" + "| 몹 : " + "Lv."+object[keys[i]][a].level+" "+object[keys[i]][a].name)
            }

        }*/

    }
    return returnData;
}//Math.ceil(98708*1.1)*200 몹경험치 계산에 뒷자리가 00 이 붙는건 패널티계산식에서 ceil을 해서 주기때문

function getEventPlayDay(){
    var now = new Date();
    var a = new Date(now.getFullYear(),now.getMonth(), now.getDate());
}