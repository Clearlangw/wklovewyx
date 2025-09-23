// 像素风格特效增强
class PixelEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.addPixelFilters();
        this.enhanceEmojiEffects();
        this.addParticleSystem();
    }
    
    // 添加像素风格滤镜
    addPixelFilters() {
        const style = document.createElement('style');
        style.textContent = `
            /* 像素风格滤镜 */
            .pixel-filter {
                image-rendering: -moz-crisp-edges;
                image-rendering: -webkit-crisp-edges;
                image-rendering: pixelated;
                image-rendering: crisp-edges;
            }
            
            /* 增强的掉落动画 */
            .enhanced-falling-emoji {
                position: absolute;
                font-size: 24px;
                animation: enhancedFall 3s linear forwards;
                pointer-events: none;
                text-shadow: 2px 2px 0px rgba(0,0,0,0.3);
                filter: drop-shadow(1px 1px 0px #000);
            }
            
            @keyframes enhancedFall {
                0% {
                    transform: translateY(-50px) rotate(0deg) scale(0.5);
                    opacity: 1;
                }
                20% {
                    transform: translateY(20px) rotate(72deg) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg) scale(0.8);
                    opacity: 0;
                }
            }
            
            /* 像素风格闪烁效果 */
            .pixel-glow {
                animation: pixelGlow 2s ease-in-out infinite alternate;
            }
            
            @keyframes pixelGlow {
                0% {
                    filter: brightness(1) contrast(1);
                    transform: scale(1);
                }
                100% {
                    filter: brightness(1.2) contrast(1.1);
                    transform: scale(1.05);
                }
            }
            
            /* 像素风格脉冲效果 */
            .pixel-pulse {
                animation: pixelPulse 1s ease-in-out infinite;
            }
            
            @keyframes pixelPulse {
                0%, 100% {
                    transform: scale(1);
                    filter: hue-rotate(0deg);
                }
                50% {
                    transform: scale(1.1);
                    filter: hue-rotate(10deg);
                }
            }
            
            /* 像素风格震动效果 */
            .pixel-shake {
                animation: pixelShake 0.5s ease-in-out;
            }
            
            @keyframes pixelShake {
                0%, 100% { transform: translateX(0); }
                10% { transform: translateX(-2px); }
                20% { transform: translateX(2px); }
                30% { transform: translateX(-2px); }
                40% { transform: translateX(2px); }
                50% { transform: translateX(-1px); }
                60% { transform: translateX(1px); }
                70% { transform: translateX(-1px); }
                80% { transform: translateX(1px); }
                90% { transform: translateX(-1px); }
            }
            
            /* 像素风格彩虹效果 */
            .pixel-rainbow {
                animation: pixelRainbow 3s linear infinite;
            }
            
            @keyframes pixelRainbow {
                0% { filter: hue-rotate(0deg) saturate(1.2); }
                16.66% { filter: hue-rotate(60deg) saturate(1.2); }
                33.33% { filter: hue-rotate(120deg) saturate(1.2); }
                50% { filter: hue-rotate(180deg) saturate(1.2); }
                66.66% { filter: hue-rotate(240deg) saturate(1.2); }
                83.33% { filter: hue-rotate(300deg) saturate(1.2); }
                100% { filter: hue-rotate(360deg) saturate(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 增强emoji效果
    enhanceEmojiEffects() {
        // 为所有emoji按钮添加像素效果
        const emojiButtons = document.querySelectorAll('.emoji-btn');
        emojiButtons.forEach(btn => {
            btn.classList.add('pixel-filter');
            
            btn.addEventListener('mouseenter', () => {
                btn.classList.add('pixel-glow');
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('pixel-glow');
            });
            
            btn.addEventListener('click', () => {
                btn.classList.add('pixel-pulse');
                setTimeout(() => {
                    btn.classList.remove('pixel-pulse');
                }, 1000);
            });
        });
    }
    
    // 粒子系统
    addParticleSystem() {
        this.particles = [];
        this.particleCanvas = this.createParticleCanvas();
        this.particleCtx = this.particleCanvas.getContext('2d');
        this.animateParticles();
    }
    
    createParticleCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '999';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        
        // 响应窗口大小变化
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        return canvas;
    }
    
    createParticle(x, y, type = 'sparkle') {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1.0,
            decay: 0.02,
            size: Math.random() * 4 + 2,
            type: type,
            color: this.getRandomPixelColor()
        };
        this.particles.push(particle);
    }
    
    getRandomPixelColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    animateParticles() {
        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新粒子位置
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            // 绘制粒子
            this.particleCtx.save();
            this.particleCtx.globalAlpha = particle.life;
            this.particleCtx.fillStyle = particle.color;
            
            if (particle.type === 'sparkle') {
                this.drawPixelStar(particle.x, particle.y, particle.size);
            } else if (particle.type === 'heart') {
                this.drawPixelHeart(particle.x, particle.y, particle.size);
            }
            
            this.particleCtx.restore();
            
            // 移除死亡的粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(() => this.animateParticles());
    }
    
    drawPixelStar(x, y, size) {
        const ctx = this.particleCtx;
        const pixelSize = Math.max(1, size / 4);
        
        // 绘制像素风格星星
        ctx.fillRect(x - pixelSize, y - pixelSize * 2, pixelSize, pixelSize);
        ctx.fillRect(x - pixelSize, y + pixelSize, pixelSize, pixelSize);
        ctx.fillRect(x - pixelSize * 2, y - pixelSize, pixelSize, pixelSize);
        ctx.fillRect(x + pixelSize, y - pixelSize, pixelSize, pixelSize);
        ctx.fillRect(x - pixelSize, y - pixelSize, pixelSize, pixelSize);
    }
    
    drawPixelHeart(x, y, size) {
        const ctx = this.particleCtx;
        const pixelSize = Math.max(1, size / 6);
        
        // 绘制像素风格爱心
        const pattern = [
            [0,1,0,1,0],
            [1,1,1,1,1],
            [1,1,1,1,1],
            [0,1,1,1,0],
            [0,0,1,0,0]
        ];
        
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col]) {
                    ctx.fillRect(
                        x + (col - 2) * pixelSize,
                        y + (row - 2) * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }
    }
    
    // 创建特殊效果
    createSpecialEffect(x, y, type, count = 10) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createParticle(
                    x + (Math.random() - 0.5) * 50,
                    y + (Math.random() - 0.5) * 50,
                    type
                );
            }, i * 50);
        }
    }
    
    // 屏幕震动效果
    screenShake(duration = 500) {
        document.body.classList.add('pixel-shake');
        setTimeout(() => {
            document.body.classList.remove('pixel-shake');
        }, duration);
    }
    
    // 彩虹效果
    rainbowEffect(element, duration = 3000) {
        element.classList.add('pixel-rainbow');
        setTimeout(() => {
            element.classList.remove('pixel-rainbow');
        }, duration);
    }
}

// 创建全局像素效果实例
window.pixelEffects = new PixelEffects();

// 增强现有功能
document.addEventListener('DOMContentLoaded', function() {
    // 为邀请函添加特殊效果
    const invitationLetter = document.getElementById('invitation-letter');
    if (invitationLetter) {
        invitationLetter.addEventListener('click', function(e) {
            window.pixelEffects.createSpecialEffect(e.clientX, e.clientY, 'heart', 15);
            // 取消全屏震动效果
        });
        
        // 取消靠近邀请函时的泛白动画
    }
    
    // 为NPC添加特殊效果
    const femaleNpc = document.getElementById('female-npc');
    if (femaleNpc) {
        femaleNpc.addEventListener('click', function(e) {
            window.pixelEffects.createSpecialEffect(e.clientX, e.clientY, 'sparkle', 8);
        });
    }
    
    // 随机环境粒子
    setInterval(() => {
        if (Math.random() < 0.1) {
            window.pixelEffects.createParticle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight,
                'sparkle'
            );
        }
    }, 2000);
});

