function getIntegerExp(bool) {
    if (!validation()) return NaN;

    var num = reqExp[Number($("#lvl").val())] * ($("#exp").val() / 100);

    if (bool) return Math.floor(num);
    else return Number(Math.floor(num)).toLocaleString("ko");
}

function validation() {
    if ($("#lvl").val() == "") {
        alert("레벨칸 기입하세용");
        $("#lvl").focus();
        $("#lvl").val("");
        return false;
    }
    if ($("#lvl").val() < 200 || $("#lvl").val() >= 300) {
        alert("레벨 200 미만 또는 300을 넘을 수 없습니다.");
        $("#lvl").focus();
        $("#lvl").val("");
        return false;
    }
    if ($("#exp").val() == "") {
        alert("경험치 칸 기입하세용");
        $("#exp").focus();
        $("#exp").val("");
        return false;
    }
    if (isNaN($("#exp").val() * 0)) {
        alert("경험치 칸에는 숫자만 기입하세용");
        $("#exp").focus();
        $("#exp").val("");
        return false;
    }
    if (Number($("#exp").val()) > 100) {
        alert("경험치는 100%를 넘기지 못합니다");
        $("#exp").focus();
        $("#exp").val("");
        return false;
    }
    if (Number($("#exp").val()) < 0) {
        alert("경험치칸에는 음수를 입력하지 못합니다.");
        $("#exp").focus();
        $("#exp").val("");
        return false;
    }
    if($("#monsterpark").val() > 7 ){
        alert("몬스터 파크는 최대 7회만 진행 할 수 있습니다.");
        $("#monsterpark").focus();
        $("#monsterpark").val("");
        return false;
    }
    if($(".playOrder:checked").length == 0) {
        alert("플레이 순서 항목을 최소 1개 이상 선택해주세요.");
        $("#playOrder1").focus();
        return false;
    }
    var now = new Date();
    if(new Date($("#day").val()) < (new Date(now.getFullYear(), now.getMonth(), now.getDate()))){
        alert("선택하신 종료 년월일은 지난 날짜입니다.");
        $("#day").focus();
        $("#day").val("");
        return false;
    }
    if($("#day").val() == ""){
        alert("종료 년월일을 선택해주세요.");
        $("#day").focus();
        $("#day").val("");
        return false;
    }

    if(new Date($("#day").val()) < (new Date(now.getFullYear(), now.getMonth(), now.getDate()))){
        alert("선택하신 미니게임 종료 년월일은 지난 날짜입니다.");
        $("#day").focus();
        $("#day").val("");
        return false;
    }
    if($("#endDay").val() == "" && $("#playOrder2").prop("checked")){
        alert("미니게임 종료 년월일을 선택해주세요.");
        $("#endDay").focus();
        $("#endDay").val("");
        return false;
    }
    if($("#endDay").val() != "" && !$("#playOrder2").prop("checked")){
        $("#playOrder2").click();
    }

    return true;
}

function allCheck(){
    if($("#allCheck").prop("checked"))
        $(".checklist li .form-check-input").prop("checked",true);
    else
        $(".checklist li .form-check-input").prop("checked",false);

}

function setQuestLevel(){
    var level = Number($("#lvl").val());
    var list = $(".checklist li .form-check-input");
    if($("#allCheck").prop("checked") == false ) return false;
    for( var i = 0 ; i < list.length ; i ++){
        if(level >= Number($(list[i]).attr("id").replace("q","")) ){
            $(list[i]).prop("checked",true)
        } else $(list[i]).prop("checked",false);
    }
}

var town = [200,210,220,225,230,235,245,250,255,260,265,270,275]
function getDailyQuestCnt(lvl){
    var ob = {
        200: 5,
        210: 3,
        220: 3,
        225: 3,
        230: 3,
        235: 3,
        245: 1,
        250: 1,
        255: 1,
        260: 1,
        265: 1,
        270: 1,
        275: 1
    }

    var maxTown = 0;
    for(var i = 0 ; i < town.length; i++){
        if(lvl >= town[i])  maxTown ++;
        else delete ob[town[i]];
    }
    var maxTownCopy = maxTown;
    for(var i = 0 ; i < maxTownCopy; i ++){ //레벨
        for(var a = 0 ; a < maxTown-1; a ++){ //갈 수 있는 마을 만큼 반복문
            if(lvl >= town[i] && ob[town[i]] > 1)
                ob[town[i]]--;
        }
        maxTown--;
    }
    return ob;
}

function getPenalty(lvl, mobLv, exp){
    var per = 1;
    var cal = lvl - mobLv;
    if(cal <= -40) per = 0;
    if(cal <= -36 && cal >= -39) per = 0.1;
    if(cal <= -21 && cal >= -35) {
        var b = cal + 21 ;
        per = 0.7 - (0.04*Math.abs(b));
    }
    if(cal <= -10 && cal >= -20) {
        var b = cal + 10 ;
        per = 1 - (0.01*Math.abs(b));
    }
    if(cal <= -5 && cal >= -9) per = 1.05;
    if(cal <= -2 && cal >= -4) per = 1.1;
    if(cal <= 1 && cal >= -1) per = 1.2;
    if(cal <= 4 && cal >= 2) per = 1.1;
    if(cal <= 9 && cal >= 5) per = 1.05;
    if(cal == 10) per = 1;
    if(cal <= 12 && cal >= 11) per = 0.99;
    if(cal <= 14 && cal >= 13) per = 0.98;
    if(cal <= 16 && cal >= 15) per = 0.97;
    if(cal <= 18 && cal >= 17) per = 0.96;
    if(cal <= 20 && cal >= 19) per = 0.95;
    if(cal <= 39 && cal >= 21){
        var b = cal - 21;
        per = 0.89-(0.01*b);
    }
    if(cal >= 40) per = 0.7;

    if(Number(per).toString().length >= 5){
        per = Math.ceil(per*100)/100
    }
    return {'exp':Math.ceil(exp * per), 'per' : per}
}


function getDay(day){
    if(day == 0) return "일요일";
    if(day == 1) return "월요일";
    if(day == 2) return "화요일";
    if(day == 3) return "수요일";
    if(day == 4) return "목요일";
    if(day == 5) return "금요일";
    if(day == 6) return "토요일";
}
