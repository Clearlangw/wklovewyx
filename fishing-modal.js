// 复用 fishing.html 的核心逻辑，但嵌入到现有弹窗中，无需 jQuery/Swal
(function(){
    let timer = null;
    let ww = 0;
    let wh = 0;
    const VW = x => (x/100) * ww;
    const VH = x => (x/100) * wh;

    let floatCanvas, floatCtx, fcw, fch;
    let processCanvas, processCtx;
    let fishImg, floatImg;
    let fishObject, floatObject, processObject;
    const collisionLoss = 0.4;
    let gravity = 1300;
    const frameTime = 10;

    function contain(value, min, max){
        return value > min && value < max;
    }

    function onPressDown(){
        if (!isModalVisible()) return;
        gravity = -gravity;
    }

    function onPressUp(){
        if (!isModalVisible()) return;
        gravity = -gravity;
    }

    function isModalVisible(){
        const modal = document.getElementById('fishing-game');
        return modal && !modal.classList.contains('hidden');
    }

    function frame(){
        fishObject.clearDraw();
        floatObject.clearDraw();
        processObject.clearDraw();

        fishObject.update(frameTime/1000);
        floatObject.update(frameTime/1000);
        processObject.update(frameTime/1000);

        floatObject.draw();
        fishObject.draw();
        processObject.draw();

        if(processObject.curLen !== 100){
            timer = setTimeout(frame, frameTime);
        }else{
            // 成功：触发奖励池
            try { triggerRewardPool(); } catch(e) { console.error(e); }
            // 关闭钓鱼
            hideFishingGame();
        }
    }

    function setupObjects(){
        ww = document.querySelector('#fishing-game .fishing-container').clientWidth;
        wh = document.querySelector('#fishing-game .fishing-container').clientHeight;

        floatCanvas = document.getElementById('float_cv');
        floatCtx = floatCanvas.getContext('2d');
        // 叠加布局尺寸（与原示例一致）
        floatCanvas.width = VH(23.9);
        floatCanvas.height = VH(80);
        fcw = floatCanvas.width;
        fch = floatCanvas.height;

        // 蓝色槽上下边界（根据底图留白校准）
        const frame_bottom_y = fch*0.95; // 下界下移，让浮标可接近底部
        const frame_top_y = fch*0.05;

        fishImg = document.getElementById('fish');
        floatImg = document.getElementById('float');

        fishObject = {
            ctx: floatCtx,
            lttpx: 0.9*fcw/2,
            lttpy: fch*0.8,
            aimpy: fch*0.8,
            width: fcw*0.2,
            height: fcw*0.2,
            time_counter: 0,
            img: fishImg,
            update: function(dt){
                this.time_counter += dt*100;
                this.lttpy += dt*(this.aimpy - this.lttpy) + Math.random();
                if(parseInt(this.time_counter)%60 === 0){
                    let r = Math.random();
                    // 目标值限制在蓝色槽范围内，考虑鱼高度不出界
                    const minAim = frame_top_y;
                    const maxAim = frame_bottom_y - this.height;
                    this.aimpy = Math.min(Math.max(fch * r, minAim), maxAim);
                }
                // 实时钳制鱼位置不出蓝色槽
                if(this.lttpy < frame_top_y){
                    this.lttpy = frame_top_y;
                }
                if(this.lttpy + this.height > frame_bottom_y){
                    this.lttpy = frame_bottom_y - this.height;
                }
            },
            draw:function(){
                this.ctx.drawImage(this.img, this.lttpx, this.lttpy, this.width, this.height);
            },
            clearDraw:function(){
                this.ctx.clearRect(this.lttpx, this.lttpy, this.width, this.height);
            }
        };

        floatObject = {
            ctx: floatCtx,
            lttpx: 0.9*fcw/2,
            lttpy: fch*0.05,
            width: fcw*0.2,
            height: fch/4,
            velocity: 0,
            velocityMax: 10,
            img: floatImg,
            update:function(dt){
                // 物理更新
                this.velocity += gravity * dt;
                this.lttpy += this.velocity * dt;
                // 出界处理：限制浮标不越过蓝色槽，并带反弹损失
                if(this.lttpy < frame_top_y){
                    this.lttpy = frame_top_y;
                    this.velocity *= -collisionLoss;
                }
                if(this.lttpy + this.height > frame_bottom_y){
                    this.lttpy = frame_bottom_y - this.height;
                    this.velocity *= -collisionLoss;
                }
            },
            draw:function(){
                this.ctx.drawImage(this.img, this.lttpx, this.lttpy, this.width, this.height);
            },
            clearDraw:function(){
                this.ctx.clearRect(this.lttpx, this.lttpy, this.width, this.height);
            }
        };

        processCanvas = document.getElementById('process_cv');
        processCtx = processCanvas.getContext('2d');
        processCanvas.width = VH(2);
        processCanvas.height = VH(73);

        processObject = {
            curLen: 0,
            ctx: processCtx,
            height: processCanvas.height,
            width: processCanvas.width,
            update:function(dt){
                const fishTopY = fishObject.lttpy;
                const fishBtmY = fishObject.lttpy + fishObject.height;
                const floatTopY = floatObject.lttpy;
                const floatBtmY = floatObject.lttpy + floatObject.height;
                // 判定范围与绿条高度一致：只要两者垂直区间重叠即算命中
                const inRange = !(fishBtmY < floatTopY || fishTopY > floatBtmY);
                if(inRange){
                    this.curLen += dt*45;
                    if(this.curLen>100) this.curLen = 100;
                } else {
                    this.curLen -= dt*65;
                    if(this.curLen<0) this.curLen = 0;
                }
            },
            draw:function(){
                const barlen = this.height * this.curLen / 100;
                const lg = this.ctx.createLinearGradient(0,0,0,barlen);
                lg.addColorStop(0,'rgb(0,255,0)');
                lg.addColorStop(1,'rgb(210,105,30)');
                this.ctx.fillStyle = lg;
                this.ctx.fillRect(0, this.height - barlen, this.width, this.height);
            },
            clearDraw:function(){
                const barlen = this.height * this.curLen / 100;
                this.ctx.clearRect(0,0,this.height - barlen,this.height);
            }
        };
    }

    function triggerBouquetReward(){
        // 显示花束弹窗（不填充花槽）
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '4000';

        const box = document.createElement('div');
        box.style.background = '#F5F5DC';
        box.style.border = '4px solid #8B4513';
        box.style.boxShadow = '8px 8px 0px #654321';
        box.style.padding = '20px';
        box.style.textAlign = 'center';

        const img = document.createElement('img');
        img.src = 'assets/bouquet.png';
        img.alt = '花束';
        img.style.width = '160px';
        img.style.maxWidth = '60%';
        img.style.imageRendering = 'pixelated';

        const text = document.createElement('div');
        text.textContent = '哎呦，好像被你钓上来一束花呢';
        text.style.marginTop = '12px';
        text.style.color = '#8B4513';
        text.style.fontFamily = '"Press Start 2P", monospace';

        const ok = document.createElement('button');
        ok.textContent = '收下';
        ok.className = 'pixel-btn';
        ok.style.marginTop = '12px';
        ok.onclick = () => document.body.removeChild(modal);

        box.appendChild(img);
        box.appendChild(text);
        box.appendChild(ok);
        modal.appendChild(box);
        document.body.appendChild(modal);
    }

    function triggerImageReward(src, title){
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '4000';

        const box = document.createElement('div');
        box.style.background = '#F5F5DC';
        box.style.border = '4px solid #8B4513';
        box.style.boxShadow = '8px 8px 0px #654321';
        box.style.padding = '20px';
        box.style.textAlign = 'center';

        const img = document.createElement('img');
        img.src = src;
        img.alt = title;
        img.style.width = '160px';
        img.style.maxWidth = '60%';
        img.style.imageRendering = 'pixelated';

        const text = document.createElement('div');
        text.textContent = `你钓到了：${title}`;
        text.style.marginTop = '12px';
        text.style.color = '#8B4513';
        text.style.fontFamily = '"Press Start 2P", monospace';

        const ok = document.createElement('button');
        ok.textContent = '好的';
        ok.className = 'pixel-btn';
        ok.style.marginTop = '12px';
        ok.onclick = () => document.body.removeChild(modal);

        box.appendChild(img);
        box.appendChild(text);
        box.appendChild(ok);
        modal.appendChild(box);
        document.body.appendChild(modal);
    }

    function triggerRewardPool(){
        const pool = [
            {src: 'assets/酷企鹅.jpg', title: '酷企鹅'},
            {src: 'assets/布丁狗.jpg', title: '布丁狗'},
            {src: 'assets/玉桂狗.jpg', title: '玉桂狗'},
            {src: 'assets/鲤鱼.png', title: '鲤鱼'},
            {src: 'assets/鱿鱼.png', title: '鱿鱼'},
            {src: 'assets/传说之鱼.png', title: '传说之鱼'},
            {src: 'assets/深海囚徒.png', title: '深海囚徒（不知道为什么被关在海底的危险生物）'},
            {src: 'assets/可爱花生.png', title: '可爱花生（喵~）'},
            {src: 'assets/闪电侠.png', title: '闪电侠（神速力的传承者）'},
            {src: 'assets/肥猪.png', title: '肥猪（那一天的胖猫跳进大海）'},
            {src: 'assets/奶龙xx.jpeg', title: '黄桃罐头（这肯定不是奶龙xx）'},
        ];
        const bouquetChance = 0.1;
        if (Math.random() < bouquetChance) {
            triggerBouquetReward();
            return;
        }
        const reward = pool[Math.floor(Math.random() * pool.length)];
        triggerImageReward(reward.src, reward.title);
    }

    // 对外：显示与隐藏（复用现有按钮）
    window.showFishingGame = function(){
        const wrap = document.getElementById('fishing-game');
        if(!wrap) return;
        wrap.classList.remove('hidden');
        setupObjects();
        clearTimeout(timer);
        timer = setTimeout(frame, frameTime);
        window.addEventListener('mousedown', onPressDown, {passive:false});
        window.addEventListener('touchstart', onPressDown, {passive:false});
        window.addEventListener('mouseup', onPressUp, {passive:false});
        window.addEventListener('touchend', onPressUp, {passive:false});
    };

    window.hideFishingGame = function(){
        const wrap = document.getElementById('fishing-game');
        if(!wrap) return;
        wrap.classList.add('hidden');
        clearTimeout(timer);
        timer = null;
        window.removeEventListener('mousedown', onPressDown);
        window.removeEventListener('touchstart', onPressDown);
        window.removeEventListener('mouseup', onPressUp);
        window.removeEventListener('touchend', onPressUp);
    };
})();


