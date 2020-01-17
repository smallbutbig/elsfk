/** -----屏蔽右键点击----- **/
if (window.Event)
    document.captureEvents(Event.MOUSEUP);

function nocontextmenu() {
    event.cancelBubble = true
    event.returnValue = false;
    return false;
}

function norightclick(e) {
    if (window.Event) {
        if (e.which == 2 || e.which == 3)
            return false;
    } else
    if (event.button == 2 || event.button == 3) {
        event.cancelBubble = true
        event.returnValue = false;
        return false;
    }
}
document.oncontextmenu = nocontextmenu;
document.onmousedown = norightclick;
/** -----屏蔽右键点击----- **/


/**
 * 进入游戏界面
 */
function going() {
    if (status == 1) {
        return false;
    }

    // 游戏界面大小设置
    gameArr = [];
    for (var i=0;i<gameY;i++) {
        gameArr[i] = [];
        for (var j=0;j<gameX;j++) {
            gameArr[i][j] = 0;
        }
    }

    // 注入游戏方块类型
    initFK();

    // 随机获取第一个方块
    changeFk();

    // 画面渲染
    htmlRendering();

    status = 1;
    hide(document.getElementById('start_step_one'));
    show(document.getElementById('start_step_two'));
}

/**
 * 随机获取方块
 */
function randomFK() {
    var len1 = FKType.length;
    var x = parseInt(Math.random() * len1);
    var len2 = FKType[x].length;
    var y = parseInt(Math.random() * len2);
    return [x,y];
}

/**
 * 开始游戏画面渲染
 */
function htmlRendering() {
    var len1 = gameArr.length;
    var len2 = gameArr[0].length;
    html = `<div class="game-interface" style="height: `+(len1*30)+`px;width: `+len2*30+`px;">`;

    for (var i=0;i<len1;i++) {
        html = html+`<div>`;
        for (var j=0;j<len2;j++) {
            if (gameArr[i][j] == 0) {
                html = html+`<button class="fk"></button>`;
            } else {
                html = html+`<button class="fk active"></button>`;
            }
        }
        html = html+`</div>`;
    }

    html = html+`</div>`;
    document.getElementById('main').innerHTML = html;
    show(document.getElementById('box'))
}

/**
 * 开始游戏
 */
function begin() {
    if (status != 1) {
        return false;
    }
    changeFk();
    status = 2;
    hide(document.getElementById('start_step_two'));
    show(document.getElementById('start_step_three1'));
    show(document.getElementById('start_step_three2'));
    inGame(); // 进行游戏
}

/**
 * 方块变更
 */
function changeFk() {
    if (nextFK.FK.length > 0) {
        var place = [parseInt(gameX/2)-1, 0];
        nowFK = {
            place: place,
            FK: nextFK.FK,
        }
        var nowHtml = ``;
        var nowfk = FKType[nowFK.FK[0]][nowFK.FK[1]];
        for (i=0;i<nowfk.length;i++) {
            for (j=0;j<nowfk[0].length;j++) {
                if (nowfk[i][j] == 1) {
                    nowHtml = nowHtml+`<button class="fk active"></button>`;
                } else {
                    nowHtml = nowHtml+`<button class="fk"></button>`;
                }
            }
            if (i != nowfk.length-1) {
                nowHtml = nowHtml+"<br>";
            }
        }
        document.getElementById('now').innerHTML = nowHtml;
    }
    var rFK = randomFK();
    nextFK = {
        FK: rFK
    }
    running = 0;
    var nextHtml = ``;
    var nextfk = FKType[nextFK.FK[0]][nextFK.FK[1]];
    for (i=0;i<nextfk.length;i++) {
        for (j=0;j<nextfk[0].length;j++) {
            if (nextfk[i][j] == 1) {
                nextHtml = nextHtml+`<button class="fk active"></button>`;
            } else {
                nextHtml = nextHtml+`<button class="fk"></button>`;
            }
        }
        if (i != nextfk.length-1) {
            nextHtml = nextHtml+"<br>";
        }
    }
    document.getElementById('next').innerHTML = nextHtml;
}

/**
 * 游戏ing
 */
function inGame(auto = true) {
    if (status != 2) {
        return false;
    }
    // 当前方块
    var fk = FKType[nowFK.FK[0]][nowFK.FK[1]];
    if (running == 0) {
        running = 1;
        // 游戏界面更新
        if (gameArr[0][nowFK.place[0]] == 1) {
            gameOver()
            return false;
        }
        for(var i=0;i<fk[0].length;i++) {
            gameArr[0][i+nowFK.place[0]] = fk[fk.length-1][i];
        }
    } else {
        // 游戏界面更新
        var stop = 0;
        if (nowFK.place[1]+1 >= gameArr.length) {
            stop = 1;
        }
        run:
        for(var i=0;i<fk[0].length;i++) {
            if (stop != 0) {
                break run;
            }
            for(var j=0;j<fk.length;j++) {
                if (nowFK.place[1]+1-j >= 0 && fk[fk.length-1-j][i] == 1) {
                    gameArr[nowFK.place[1]+1-j][nowFK.place[0]+i] == 0 ? 1 : (stop = 1);
                    break;
                }
            }
        }
        if (stop == 1) {
            if (fk.length > nowFK.place[1]+1) {
                gameOver()
            }
            if (auto) {
                changeFk();
                clearFK();
                inGame();
            }
            return false;
        }
        nowFK.place[1] += 1;
        for(var i=nowFK.place[1];i>=0&&i>nowFK.place[1]-fk.length;i--) {
            for(var j=0;j<fk[0].length;j++) {
                if (fk[fk.length-1+i-nowFK.place[1]][j] == 1) {
                    gameArr[i][j+nowFK.place[0]] = 1;
                    i-1 >= 0 ? gameArr[i-1][j+nowFK.place[0]] = 0 : 1;
                }
            }
        }
    }
    htmlRendering();

    if (auto) {
        setTimeout(function () {
            inGame();
        }, timeing)
    }
}

// 按键判断
document.onkeydown=function(event){
    if (status != 2) {
        return false;
    }
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode==37) {
        // 左键
        leftButton()
    }
    if (e && e.keyCode==39) {
        // 右键
        rightButton()
    }
    if (e && e.keyCode==38) {
        // 上键
        upButton()
    }
    if (e && e.keyCode==40) {
        // 下键
        downButton()
    }
};


function gameOver() {
    alert('游戏结束');
    status = 3
}

/**
 * 获取需要消除的行
 */
function clearFK() {
    var clearLine = [];
    var stopLine = 0;
    for(var i=gameY-1;i>=0;i--) {
        var blackNum = 0;
        for(var j=0;j<gameX;j++) {
            if (gameArr[i][j] == 1) {
                blackNum++;
            }
        }
        if (blackNum == gameX) {
            clearLine.push(i);
        }
        if (blackNum == 0) {
            stopLine = i-1;
            break;
        }
    }
    if (clearLine.length > 0) {
        for(var i=0;i<clearLine.length;i++) {
            clearGameFK(clearLine[i]+i, stopLine);
        }
        htmlRendering();
    }
}

/**
 * 消除方块
 */
function clearGameFK(num, stop = 0) {
    for(var i=gameY-1;i>=0;i--) {
        if (i == num) {
            for(var j=0;j<gameX;j++) {
                gameArr[i][j] = 0;
            }
        } else if (i < num && i >= stop) {
            for(var j=0;j<gameX;j++) {
                if (gameArr[i][j] == 1) {
                    gameArr[i+1][j] = 1;
                    gameArr[i][j] = 0;
                }
            }
        }
    }
}