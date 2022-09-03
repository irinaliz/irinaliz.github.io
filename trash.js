function calMinigameExp() {
    if (!validation()) return false;
    var lvlUp = 0,
    lvlUpCntCheck = 0,
    nowLvl = 0;
    var playDay = $("#day").val() * 2;
    var oldLevel = Number($("#lvl").val());
    var oldExp = $("#exp").val() == 0 || $("#exp").val() == ""? 0 : getIntegerExp(true);

    for (var i = 1; i <= playDay; i++) {
        var level = oldLevel + lvlUp;
        var lvreqExp = reqExp[level];
        var gExp = gameExp[level];
        oldExp += gExp;
        lvlUpCntCheck++;

        if (oldExp >= lvreqExp) {
            lvlUp++;
            oldExp = oldExp - lvreqExp;
        }
        nowLvl = oldLevel + lvlUp;

        if (nowLvl != level) {
            console.log(level + " -> " + nowLvl + " " + lvlUpCntCheck + "판 진행");
            lvlUpCntCheck = 0;
        }
        var date = new Date();
        if (i != 1 && i % 2 == 1) {
            day++;
        }
        date = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + day
        );
        var li = 
        `<li>
            <div class="out_div" style="height: ${Number((oldExp / lvlXp[level]) * 100).toLocaleString("ko") +"%"}">
                <div class="in_div" date="${date.getMonth() + 1}월 ${date.getDate()}일" level="${level}">
                </div>
            </div>
        </li>`;
    }
}