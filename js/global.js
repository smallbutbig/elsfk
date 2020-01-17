var status = 0; // 游戏状态 -1暂停 0.未开始 1.游戏准备中 2.游戏中 3.失败 4.获胜

var timeing = 1000; // 方块移动速度

var integral = 0; // 积分数

var gameX = 10; // 游戏界面横向大小
var gameY = 17; // 游戏界面纵向大小
var gameArr = []; // 游戏界面

var FKType = [];

var running = 0;

var nowFK = {
    place: [],
    FK: [],
}; // 当前方块

var nextFK = {
    FK: [],
}; // 下一个方块
