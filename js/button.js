function suspend() {
    if (status == 2) {
        status = -1;
    }
}

function unSuspend() {
    if (status == -1) {
        status = 2;
        inGame();
    }
}

/**
 * 错误方法，记录重写
 */
function leftButtonError() {
    var fk = FKType[nowFK.FK[0]][nowFK.FK[1]];
    if (nowFK.place[0] <= 0) {
        return false;
    }
    var leftStop = 0;
    run:
    for(var i=0;i<fk.length;i++) {
        if (leftStop != 0) {
            break run;
        }
        for(var j=0;j<fk[0].length;j++) {
            if (nowFK.place[1]-i >= 0 && fk[i][j] == 1) {
                gameArr[nowFK.place[1]-i][nowFK.place[0]-1-j] == 0 ? 1 : (leftStop = 1);
                console.log(leftStop)
                break;
            }
        }
    }
    if (leftStop == 1) {
        return false;
    } else {
        nowFK.place[0] -= 1;
        for(var i=0;i<fk.length;i++) {
            for(var j=0;j<=fk[0].length;j++) {
                if (nowFK.place[1]-i >= 0) {
                    gameArr[nowFK.place[1]-i][nowFK.place[0]+j] = ((j == fk[0].length) ? 0 : fk[fk.length-1-i][j]);
                }
            }
        }
        htmlRendering();
    }
}
/**
 * 错误方法，记录重写
 */
function rightButtonError() {
    var fk = FKType[nowFK.FK[0]][nowFK.FK[1]];
    if (nowFK.place[0]+fk[0].length >= gameX) {
        return false;
    }
    var rightStop = 0;
    run:
    for(var i=0;i<fk.length;i++) {
        if (rightStop != 0) {
            break run;
        }
        for(var j=fk[0].length-1;j>=0;j--) {
            if (nowFK.place[1]-i >= 0 && fk[i][j] == 1) {
                gameArr[nowFK.place[1]-i][nowFK.place[0]+j+1] == 0 ? 1 : (rightStop = 1);
                break;
            }
        }
    }
    if (rightStop == 1) {
        return false;
    } else {
        nowFK.place[0] += 1;
        for(var i=0;i<fk.length;i++) {
            for(var j=fk[0].length-1;j>=-1;j--) {
                if (nowFK.place[1]-i >= 0) {
                    gameArr[nowFK.place[1]-i][nowFK.place[0]+j] = ((j == -1) ? 0 : fk[fk.length-1-i][j]);
                }
            }
        }
        htmlRendering();
    }
}

function leftButton() {
    var fk = FKType[nowFK.FK[0]][nowFK.FK[1]];
    if (nowFK.place[0] <= 0) {
        return false;
    }
    var lStop = 0;
    for(var i=0;i<fk.length;i++) {
        if (lStop != 0) {
            break;
        }
        for(var j=0;j<fk[0].length;j++) {
            if (fk[fk.length-1-i][j] == 1 && nowFK.place[1]-i > 0) {
                gameArr[nowFK.place[1]-i][nowFK.place[0]+j-1] == 0 ? 1 : lStop = 1;
                break;
            }
        }
    }
    if (lStop != 0) {
        return false;
    }
    nowFK.place[0] -= 1;
    for(var i=0;i<fk.length;i++) {
        for(var j=0;j<fk[0].length;j++) {
            if (fk[fk.length-1-i][j] == 1 && nowFK.place[1]-i >= 0) {
                gameArr[nowFK.place[1]-i][nowFK.place[0]+j+1] = 0;
                gameArr[nowFK.place[1]-i][nowFK.place[0]+j] = 1;
            }
        }
    }
    htmlRendering();
}

function rightButton() {
    var fk = FKType[nowFK.FK[0]][nowFK.FK[1]];
    if (nowFK.place[0]+fk[0].length >= gameX) {
        return false;
    }
    var rStop = 0;
    for(var i=0;i<fk.length;i++) {
        if (rStop != 0) {
            break;
        }
        for(var j=fk[0].length-1;j>=0;j--) {
            if (fk[fk.length-1-i][j] == 1 && nowFK.place[1]-i > 0) {
                gameArr[nowFK.place[1]-i][nowFK.place[0]+j+1] == 0 ? 1 : rStop = 1;
                break;
            }
        }
    }
    if (rStop != 0) {
        return false;
    }
    nowFK.place[0] += 1;
    for(var i=0;i<fk.length;i++) {
        for(var j=fk[0].length-1;j>=0;j--) {
            if (fk[fk.length-1-i][j] == 1 && nowFK.place[1]-i >= 0) {
                gameArr[nowFK.place[1]-i][nowFK.place[0]+j-1] = 0;
                gameArr[nowFK.place[1]-i][nowFK.place[0]+j] = 1;
            }
        }
    }
    htmlRendering();
}

function upButton() {
    var thisTypeAllFk = FKType[nowFK.FK[0]];
    if (thisTypeAllFk.length <= 1) {
        return false;
    }
    if (nowFK.FK[1] == thisTypeAllFk.length-1) {
        var newFK = [nowFK.FK[0], 0];
    } else {
        var newFK = [nowFK.FK[0], nowFK.FK[1]+1];
    }
    // 清除变化前
    var fk = FKType[nowFK.FK[0]][nowFK.FK[1]];
    for(var i=0;i<fk.length;i++) {
        for(var j=0;j<fk[0].length;j++) {
            if (fk[fk.length-1-i][j] == 1 && nowFK.place[1]-i >= 0 && gameArr[nowFK.place[1]-i][nowFK.place[0]+j] == 1) {
                gameArr[nowFK.place[1]-i][nowFK.place[0]+j] = 0;
            }
        }
    }
    // 判断是否可以变化
    var cStop = 0;
    var thisfk = FKType[newFK[0]][newFK[1]];
    for(var i=0;i<thisfk.length;i++) {
        if (cStop != 0) {
            break;
        }
        for(var j=0;j<thisfk[0].length;j++) {
            if (thisfk.length-1-i >= 0) {
                if (thisfk[thisfk.length-1-i][j] == 1 && nowFK.place[1]-i >= 0) {
                    if (nowFK.place[0]+j >= gameX) {
                        cStop = 1;
                        break;
                    }
                    if (gameArr[nowFK.place[1]-i][nowFK.place[0]+j] != 0) {
                        cStop = 1;
                        break;
                    }
                }
            }
        }
    }
    if (cStop != 0) {
        // 复原
        for(var i=0;i<fk.length;i++) {
            for(var j=0;j<fk[0].length;j++) {
                if (fk[fk.length-1-i][j] == 1 && nowFK.place[1]-i >= 0 && gameArr[nowFK.place[1]-i][nowFK.place[0]+j] == 0) {
                    gameArr[nowFK.place[1]-i][nowFK.place[0]+j] = 1;
                }
            }
        }
        return false;
    } else {
        nowFK.FK = newFK;
        for(var i=0;i<thisfk.length;i++) {
            for(var j=0;j<thisfk[0].length;j++) {
                if (thisfk[thisfk.length-1-i][j] == 1 && nowFK.place[1]-i >= 0 && gameArr[nowFK.place[1]-i][nowFK.place[0]+j] == 0) {
                    gameArr[nowFK.place[1]-i][nowFK.place[0]+j] = 1;
                }
            }
        }
        htmlRendering();
    }
}

function downButton() {
    inGame(false);
}