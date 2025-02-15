(function() {
    console.info("injecting script to self:", self);

    function clickCenter(element, clickCount = 1) {
        if (!element) {
            console.warn('handleMessage clickCenter: element is null or undefined');
            return;
        }
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < clickCount; i++) {
            const event = new MouseEvent('click', {
                view: self,
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY
            });
            element.dispatchEvent(event);
        }
    }
    function selectCoins(betAmount) {
        const coins = [1000, 5000,10000,20000,50000,100000, 200000,500000,1000000,2000000,5000000, 10000000];
        let theBet = betAmount * 100;
        const selectedCoins = [];
        for (let i = coins.length - 1; i >= 0; i--) {
            while (theBet >= coins[i]) {
                selectedCoins.push(coins[i]);
                theBet -= coins[i];
            }
        }
        return selectedCoins;
    }
    function bindEvent(){
        if (window.wsNet && !window.zc){
            zc = (e => (e[e.HEARTBEATS = 1] = "HEARTBEATS",
                e[e.LOGIN_SUCCESS = 106] = "LOGIN_SUCCESS",
                e[e.LOGIN_ERROR = 107] = "LOGIN_ERROR",
                e[e.ERROR = 600] = "ERROR",
                e[e.SERVER_MAINTAIN = 700] = "SERVER_MAINTAIN",
                e[e.UPDATE_SCORE = 720] = "UPDATE_SCORE",
                e[e.GAME_CONFIG = 1201] = "GAME_CONFIG",
                e[e.ROOM_INFOS = 1001] = "ROOM_INFOS",
                e[e.SELF_SCORE = 1102] = "SELF_SCORE",
                e[e.CHECK_BETTING_ROOM = 1314] = "CHECK_BETTING_ROOM",
                e[e.ROOM_BEGIN_CHIP = 1002] = "ROOM_BEGIN_CHIP",
                e[e.ROOM_GAME_RESULT = 1004] = "ROOM_GAME_RESULT",
                e[e.GOOD_ROAD_CHANGE = 1303] = "GOOD_ROAD_CHANGE",
                e[e.ENTER_INNER_ROOM = 1006] = "ENTER_INNER_ROOM",
                e[e.DEAL_CARD = 1300] = "DEAL_CARD",
                e[e.BACCARAT_BET = 1008] = "BACCARAT_BET",
                e[e.SYNC_BET = 1999] = "SYNC_BET",
                e[e.ROAD_SET_SUCCEED = 1305] = "ROAD_SET_SUCCEED",
                e[e.BACCARAT_ONLINE_LIST = 1101] = "BACCARAT_ONLINE_LIST",
                e[e.BET_STAGE_ERROR = 1202] = "BET_STAGE_ERROR",
                e[e.EDIT_CARDS = 1301] = "EDIT_CARDS",
                e[e.WASHING_CARD = 1302] = "WASHING_CARD",
                e[e.INTO_MAINTAIN = 1304] = "INTO_MAINTAIN",
                e[e.BET_INFO_RES = 1315] = "BET_INFO_RES",
                e[e.BACCARAT_KICK_USER_2_LIST = 1316] = "BACCARAT_KICK_USER_2_LIST",
                e[e.SET_SHOW_OPTION_SUCCEED = 1308] = "SET_SHOW_OPTION_SUCCEED",
                e[e.BACCARAT_UPDATE_DEALER_INFO = 1317] = "BACCARAT_UPDATE_DEALER_INFO",
                e[e.BACCARAT_ROOM_VIDEO_URL_INFO = 1407] = "BACCARAT_ROOM_VIDEO_URL_INFO",
                e[e.BACCARAT_MI_START = 1400] = "BACCARAT_MI_START",
                e[e.BACCARAT_MI_INFO = 1401] = "BACCARAT_MI_INFO",
                e[e.BACCARAT_MI_END = 1402] = "BACCARAT_MI_END",
                e[e.BACCARAT_MI_RIGHT_INFO = 1403] = "BACCARAT_MI_RIGHT_INFO",
                e[e.BACCARAT_MI_OTHER_OPEN = 1404] = "BACCARAT_MI_OTHER_OPEN",
                e[e.BACCARAT_MI_CAN_ENTER_WITH_SIT = 1405] = "BACCARAT_MI_CAN_ENTER_WITH_SIT",
                e[e.BACCARAT_MI_ENTER_WITH_SIT_RES = 1406] = "BACCARAT_MI_ENTER_WITH_SIT_RES",
                e[e.BACCARAT_BET_RES = 1409] = "BACCARAT_BET_RES",
                e[e.ROOM_LIST = 2999] = "ROOM_LIST",
                e[e.ACCOUNT_REMOTE_LOGIN = 702] = "ACCOUNT_REMOTE_LOGIN",
                e[e.BACCARAT_CLIENT_CONFIG = 1430] = "BACCARAT_CLIENT_CONFIG",
                e[e.BACCARAT_SELF_CHIPS = 1441] = "BACCARAT_SELF_CHIPS",
                e))({})

            zc.data= {}
            for(let key in zc){
                if (typeof zc[key] === 'number') {
                    const theKey = key;
                    window.wsNet.onWSReceive(zc[theKey], (e) => {
                        console.info('onWSReceive ' + theKey + ':', e);
                        zc.data[theKey]=e;
                    });
                }
            }
            window.zc = zc;
        }
    }

     function handleMessage(card1, card2, theTime, betAmount) {
        console.info('handle message:', card1, card2, theTime, betAmount);
        if(betAmount==0){
            betAmount = localStorage.getItem('betAmount');
        }
        if(betAmount==-1){
            betAmount = getMaxSelectedChipValue();
        }else if(betAmount==0){
            betAmount = 10;
        }
        const card1_num = (card1 % 13) + 1;
        const card2_num = (card2 % 13) + 1;
        const area_num = card1_num > card2_num ? 0 : (card1_num < card2_num ? 2 : 1);
        if (self.wsNet && wsNet.send) {
            if (card1_num > card2_num) {
                wsNet.send(500, 2000, { roomId: 8801, betEnv: 1, carrier: '8801-' + (Date.now() - Math.floor(Math.random() * 1501)), areaBet: [{ area: 1, bet: betAmount * 100, betType: 0, count: 1 }] });
            } else if (card1_num < card2_num) {
                wsNet.send(500, 2000, { roomId: 8801, betEnv: 1, carrier: '8801-' + (Date.now() - Math.floor(Math.random() * 1501)), areaBet: [{ area: 2, bet: betAmount * 100, betType: 0, count: 1 }] });
            } else if (card1_num == card2_num) {
                wsNet.send(500, 2000, { roomId: 8801, betEnv: 1, carrier: '8801-' + (Date.now() - Math.floor(Math.random() * 1501)), areaBet: [{ area: 3, bet: betAmount * 100, betType: 0, count: 1 }] });
            }
            console.info('handle pack spend time:', new Date().getTime() - theTime, card1_num, card2_num, area_num,betAmount);
            //return;
            bindEvent();
        }

        function clickBetAreaThenConfirm(count){
            const clickArea = '.area-' + area_num + ' > div[fast-click]';
            document.querySelectorAll(clickArea).forEach(div => {
                for(i=count-1;i>0;i--){
                    clickCenter(div);
                }
                const clickPromise = new Promise(resolve => {
                    div.addEventListener('click', function() {
                        // 触发点击事件
                        const childDivs = document.querySelectorAll('.area-' + area_num + ' .button-click.chips-button-right');
                        childDivs.forEach(div1 => {
                            setTimeout(() => {
                                if (window.getComputedStyle(div1).display !== 'none' && div1.parentElement && window.getComputedStyle(div1.parentElement).display !== 'none') { // 检查子div是否显示
                                    clickCenter(div1); // 延迟触发点击事件
                                    console.info('handle message click confirm spend time :', new Date().getTime() - theTime, card1_num, card2_num, area_num);
                                }
                            }, 0);
                        });
                        resolve(); // 解析 Promise
                    }, { once: true });
                });

                clickCenter(div);
                console.info('handle message click bet div spend time:', new Date().getTime() - theTime, card1_num, card2_num, area_num);
                // 等待 clickPromise 解析后再继续
                clickPromise.then(() => {
                });
            });
        }

        const coins = selectCoins(betAmount);
        if(coins.length==0)return;
        const chipValue = coins[0];
        const cnt = coins.filter(item => item === chipValue).length;
        const chipButton = document.querySelector(`div[data-type="${chipValue}"]`);
        if (chipButton && window.getComputedStyle(chipButton).display !== 'none' && chipButton.parentElement && window.getComputedStyle(chipButton.parentElement).display !== 'none') {
            chipButton.addEventListener('click', () => {
                console.info(`handle message Clicked chip with value: ${chipValue}`);
                clickBetAreaThenConfirm(cnt);
            }, { once: true });
            clickCenter(chipButton);
        }
    }

    // 暴露方法供外部调用
    self.handleMessage = handleMessage;

    // 创建悬浮的 div
    function createFloatingDiv() {
        // 检查是否已经存在悬浮 div
        // 检查是否已经存在悬浮 div
        const existingDiv = document.getElementById('testBetDiv');
        if (existingDiv) {
            console.info('testBetDiv div already exists. Removing existing div.');
            existingDiv.remove();
        }

        const floatingDiv = document.createElement('div');
        floatingDiv.id = 'testBetDiv'; // 添加唯一的 id
        floatingDiv.style.position = 'fixed';
        floatingDiv.style.bottom = '20px';
        floatingDiv.style.left = '20px'; // 初始位置调整为左下角
        floatingDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        floatingDiv.style.border = '2px solid #ff6347'; // 设置鲜艳的颜色边框
        floatingDiv.style.padding = '10px';
        floatingDiv.style.borderRadius = '5px';
        floatingDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        floatingDiv.style.zIndex = '1000';
        floatingDiv.style.cursor = 'move'; // 添加鼠标移动光标
        floatingDiv.style.width = '200px'; // 设置固定宽度
        floatingDiv.style.height = '100px'; // 设置固定高度

        // 创建标题
        const title = document.createElement('div');
        title.textContent = '接口下注';
        title.style.textAlign = 'center';
        title.style.marginBottom = '10px';

        // 创建输入框
        const input = document.createElement('input');
        input.type = 'number';
        let value = window.localStorage.getItem('betAmount');
        if (value === null || isNaN(value)) {
            value = 10;
            window.localStorage.setItem('betAmount', value);
        }
        input.value = value;
        input.style.marginRight = '10px';
        input.style.width = '80px'; // 设置输入框宽度
        input.style.border = '1px solid #ccc';
        // 监听输入框失去焦点事件
        input.addEventListener('blur', function() {
            let newValue = input.value;
            if (!isNaN(newValue)) {
                window.localStorage.setItem('betAmount', newValue);
            }
        });

        // 创建按钮1
        const button1 = document.createElement('button');
        button1.textContent = '龙';
        button1.style.marginRight = '10px';
        button1.style.backgroundColor = '#007bff'; // 蓝色背景
        button1.style.color = '#fff'; // 白色文字
        button1.style.border = 'none';
        button1.style.borderRadius = '5px';
        button1.style.padding = '5px 10px';
        button1.style.cursor = 'pointer';
        button1.addEventListener('click', () => {
            const betAmount = parseInt(input.value, 10) || 10;
            handleMessage(2, 1, Date.now(), betAmount);
        });

        // 创建按钮2
        const button2 = document.createElement('button');
        button2.textContent = '虎';
        button2.style.backgroundColor = '#ff0000'; // 红色背景
        button2.style.color = '#fff'; // 白色文字
        button2.style.border = 'none';
        button2.style.borderRadius = '5px';
        button2.style.padding = '5px 10px';
        button2.style.cursor = 'pointer';
        button2.addEventListener('click', () => {
            const betAmount = parseInt(input.value, 10) || 10;
            handleMessage(1, 2, Date.now(), betAmount);
        });

        // 将元素添加到悬浮 div
        floatingDiv.appendChild(title);
        floatingDiv.appendChild(input);
        floatingDiv.appendChild(button1);
        floatingDiv.appendChild(button2);

        // 添加拖动功能
        let offsetX, offsetY;

        floatingDiv.addEventListener('mousedown', (e) => {
            offsetX = e.clientX - floatingDiv.offsetLeft;
            offsetY = e.clientY - floatingDiv.offsetTop;
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });

        function mouseMoveHandler(e) {
            floatingDiv.style.left = (e.clientX - offsetX) + 'px';
            floatingDiv.style.top = (e.clientY - offsetY) + 'px';
        }

        function mouseUpHandler() {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }

        // 将悬浮 div 添加到 body
        document.body.appendChild(floatingDiv);
        console.info('testBetDiv div added');
    }

    function getMaxSelectedChipValue() {
        const selectedChips = document.querySelectorAll('#slide-container .relative.chips-icon');
        let maxValue = 0;
        selectedChips.forEach(chipDiv => {
            // 获取第一个子 div
            const firstChildDiv = chipDiv.querySelector('div');
            if (firstChildDiv) {
                // 获取 data-id 属性
                const dataId = firstChildDiv.getAttribute('data-id');
                // 将 data-id 转换为数字并更新 maxValue
                if (!dataId || dataId==='forbid_0') {
                    value = 0;
                } else {
                    value = parseInt(dataId.split('_')[1], 10);
                }
                if (!isNaN(value) && value > maxValue) {
                    maxValue = value;
                }
            }
        });
        return maxValue;
    }

    // 创建悬浮 div
    createFloatingDiv();

    console.info('injecting scripts successfully.');
    return true;
})();
