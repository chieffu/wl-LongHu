(function() {
    console.info("injecting script to self:", self);

    let isProcessing = false; // 标志位，确保同一时间只有一个 handleMessage 调用在执行

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
        // 修改 selectCoins 的生成逻辑
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

     function handleMessage(card1, card2, theTime, betAmount) {
        console.info('handle message:', card1, card2, theTime, betAmount);
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
        if (document.getElementById('testBetDiv')) {
            console.info('testBetDiv div already exists.');
            return;
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
        input.value = '10';
        input.style.marginRight = '10px';
        input.style.width = '80px'; // 设置输入框宽度
        input.style.border = '1px solid #ccc';

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
            handleMessage(2, 1, 0, betAmount);
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
            handleMessage(1, 2, 0, betAmount);
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

    // 创建悬浮 div
    createFloatingDiv();
    console.info('injecting scripts successfully.');
    return true;
})();
