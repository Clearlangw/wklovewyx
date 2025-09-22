// 全局变量
let fishCount = 0;
let secretInput = '';
let isGameActive = false;
let fishingGame = null;

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 绑定事件监听器
    bindEventListeners();
    
    // 钓鱼初始化由 fishing-modal.js 接管
    
    console.log('星露谷物语约会邀请网页已加载完成！');
}

function bindEventListeners() {
    // 邀请函点击事件（移除掉落效果）
    const invitationLetter = document.getElementById('invitation-letter');
    if (invitationLetter) {
        invitationLetter.addEventListener('click', handleInvitationClick);
    }
    
    // 钓鱼按钮事件
    const fishingTrigger = document.getElementById('fishing-trigger');
    if (fishingTrigger) {
        fishingTrigger.addEventListener('click', showFishingGame);
    }
    
    // 关闭钓鱼游戏
    const closeFishing = document.getElementById('close-fishing');
    if (closeFishing) {
        closeFishing.addEventListener('click', hideFishingGame);
    }
    
    // 隐藏彩蛋输入
    const emojiButtons = document.querySelectorAll('.emoji-btn');
    emojiButtons.forEach(btn => {
        btn.addEventListener('click', handleEmojiClick);
    });
    
    // 清除输入
    const clearInput = document.getElementById('clear-input');
    if (clearInput) {
        clearInput.addEventListener('click', clearSecretInput);
    }
}

// 处理邀请函点击（恢复掉落效果）
function handleInvitationClick() {
    triggerEmojiDrop();
}

// 新的掉落触发函数
function triggerEmojiDrop() {
    const random = Math.random();
    
    if (random < 0.05) {
        // 5%概率掉落钓鱼emoji
        createFallingEmoji('🎣');
    } else if (random < 0.10) {
        // 5%概率掉落snowman9人代表色爱心组合
        dropSnowmanHearts();
    } else if (random < 0.20) {
        // 10%概率掉落王冠emoji
        createFallingEmoji('👑');
    } else {
        // 80%概率掉落普通爱心
        createFallingEmoji('❤️');
    }
}

// 掉落snowman9人代表色爱心
function dropSnowmanHearts() {
    const snowmanHearts = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💖'];
    
    snowmanHearts.forEach((heart, index) => {
        setTimeout(() => {
            createFallingEmoji(heart);
        }, index * 100);
    });
}

// 创建掉落emoji（使用正常emoji，不是像素风格）
function createFallingEmoji(emojiType) {
    const emoji = document.createElement('div');
    emoji.textContent = emojiType;
    emoji.className = 'falling-emoji';
    
    // 随机位置
    emoji.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    emoji.style.top = '-50px';
    emoji.style.position = 'fixed';
    emoji.style.fontSize = '30px';
    emoji.style.zIndex = '1000';
    emoji.style.pointerEvents = 'none';
    emoji.style.animation = 'fall 3s linear forwards';
    
    document.body.appendChild(emoji);
    
    // 3秒后移除
    setTimeout(() => {
        if (emoji.parentNode) {
            emoji.parentNode.removeChild(emoji);
        }
    }, 3000);
}

// 显示钓鱼游戏
function showFishingGame() {
    const fishingGame = document.getElementById('fishing-game');
    if (fishingGame) {
        fishingGame.classList.remove('hidden');
        isGameActive = true;
    }
}

// 隐藏钓鱼游戏
function hideFishingGame() {
    const fishingGame = document.getElementById('fishing-game');
    if (fishingGame) {
        fishingGame.classList.add('hidden');
        isGameActive = false;
    }
}

// 初始化钓鱼游戏
function initFishingGame() {
    // 创建增强版钓鱼游戏实例
    fishingGame = new StardewFishingGame('fishing-canvas');
}

// 投竿功能
function castFishingRod() {
    if (fishingGame) {
        // 重写钓鱼成功回调
        fishingGame.onFishCaught = function() {
            // 钓鱼成功时掉落所有emoji素材和花束
            dropAllEmojisAndFlowers();
            // 显示星露谷风格提醒
            showStardewNotification('钓到鱼了！🐟', 'success');
        };
        
        fishingGame.startFishing();
    }
}

// 掉落所有emoji素材和花束
function dropAllEmojisAndFlowers() {
    const allEmojis = [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💖',
        '👑', '🎣', '🌸', '🌹', '💐', '🌺', '🌻', '🌷'
    ];
    
    allEmojis.forEach((emoji, index) => {
        setTimeout(() => {
            createFallingEmoji(emoji);
        }, index * 150);
    });
}

// 显示星露谷风格通知
function showStardewNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `stardew-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">🎣</div>
            <div class="notification-text">${message}</div>
        </div>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2C1810;
        border: 3px solid #8B4513;
        border-radius: 10px;
        padding: 15px;
        color: #FFF;
        font-family: "Press Start 2P", monospace;
        font-size: 12px;
        z-index: 2000;
        animation: slideInRight 0.5s ease-out;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

function showFishingResult(message) {
    const resultDiv = document.createElement('div');
    resultDiv.textContent = message;
    resultDiv.style.position = 'fixed';
    resultDiv.style.top = '50%';
    resultDiv.style.left = '50%';
    resultDiv.style.transform = 'translate(-50%, -50%)';
    resultDiv.style.background = 'rgba(0, 0, 0, 0.8)';
    resultDiv.style.color = 'white';
    resultDiv.style.padding = '20px';
    resultDiv.style.borderRadius = '10px';
    resultDiv.style.fontSize = '18px';
    resultDiv.style.zIndex = '2000';
    
    document.body.appendChild(resultDiv);
    
    setTimeout(() => {
        document.body.removeChild(resultDiv);
    }, 2000);
}

// 处理emoji按钮点击
function handleEmojiClick(event) {
    const value = event.target.getAttribute('data-value');
    if (value) {
        secretInput += value;
        updateSecretDisplay();
        checkSecretCodes();
    }
}

// 更新隐藏输入显示
function updateSecretDisplay() {
    const display = document.getElementById('secret-display');
    if (display) {
        display.textContent = secretInput;
    }
}

// 检查隐藏彩蛋代码
function checkSecretCodes() {
    if (secretInput === '110105') {
        showBouquet();
        // 触发一次所有emoji从天上掉落
        dropAllEmojisAndFlowers();
        secretInput = '';
        updateSecretDisplay();
    } else if (secretInput === '140624') {
        showSpecialMessage();
        secretInput = '';
        updateSecretDisplay();
    } else if (secretInput.length > 6) {
        // 如果输入超过6位，清空
        secretInput = '';
        updateSecretDisplay();
    }
}

// 显示花束（替代男性NPC动画）
function showBouquet() {
    const flowerSlot = document.getElementById('flower-slot');
    if (flowerSlot) {
        flowerSlot.classList.add('show-bouquet');
        flowerSlot.innerHTML = '<img src="assets/bouquet.png" alt="花束" class="bouquet-image">';
    }
}

// 显示特殊消息（弹窗）
function showSpecialMessage() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '3000';
    
    const messageBox = document.createElement('div');
    messageBox.style.background = '#2C1810';
    messageBox.style.color = '#333';
    messageBox.style.padding = '30px';
    messageBox.style.borderRadius = '15px';
    messageBox.style.border = '3px solid #8B4513';
    messageBox.style.fontSize = '24px';
    messageBox.style.fontFamily = '"Press Start 2P", monospace';
    messageBox.style.textAlign = 'center';
    messageBox.style.maxWidth = '400px';
    messageBox.textContent = '你永远是山西人';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '确定';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.fontSize = '16px';
    closeButton.style.fontFamily = '"Press Start 2P", monospace';
    closeButton.style.background = '#8B4513';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    messageBox.appendChild(closeButton);
    modal.appendChild(messageBox);
    document.body.appendChild(modal);
}

// 清除隐藏输入
function clearSecretInput() {
    secretInput = '';
    updateSecretDisplay();
}

