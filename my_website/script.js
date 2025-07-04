// 移动菜单切换
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const navLinks = document.querySelector('.nav-links');

// 修复移动菜单切换逻辑（使用CSS中定义的hidden类）
mobileMenuButton.addEventListener('click', () => {
    navLinks.classList.toggle('hidden');
    // 切换图标（如果使用了Font Awesome）
    const icon = mobileMenuButton.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // 关闭移动菜单（如果打开）
            if (!navLinks.classList.contains('hidden')) {
                navLinks.classList.add('hidden');
                // 同步切换图标
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        }
    });
});

// 导航栏滚动效果
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('shadow-md');
    } else {
        header.classList.remove('shadow-md');
    }
});

// 表单提交处理
const contactForm = document.querySelector('form');
if (contactForm) { // 避免表单不存在时出错
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 简单表单验证
        const nameInput = contactForm.querySelector('input[type="text"]');
        const emailInput = contactForm.querySelector('input[type="email"]');

        if (nameInput && emailInput && nameInput.value && emailInput.value.includes('@')) {
            showToast('表单提交成功！');
            contactForm.reset();
        } else {
            showToast('请填写有效的信息！');
        }
    });
}

// 互动小游戏功能
const startGameBtn = document.getElementById('start-game-btn');
const gameModal = document.getElementById('game-modal');
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const roseContainer = document.getElementById('rose-container');
const gameMessage = document.getElementById('game-message');
if (gameMessage) {
    console.log('成功获取到 game-message 元素');
} else {
    console.log('未获取到 game-message 元素');
}

// 确保元素存在再绑定事件
if (startGameBtn && gameModal && likeBtn && dislikeBtn && roseContainer && gameMessage) {
    // 打开游戏
    startGameBtn.addEventListener('click', () => {
        gameModal.classList.add('active');
        // 重置按钮状态
        likeBtn.style.transform = 'scale(1)';
        likeBtn.style.setProperty('--scale', '1'); // 重置CSS变量
        dislikeBtn.classList.remove('wiggle');
        gameMessage.textContent = ''; // 清空提示信息
    });

    // 关闭游戏
    function closeGame() {
        gameModal.classList.remove('active');
    }

 // 喜欢按钮点击事件
    likeBtn.addEventListener('click', () => {
        console.log('点击了喜欢按钮');
        createRoses();
        gameMessage.textContent = '我就知道老婆喜欢我！🌹';
        // 先不关闭模态框，等待提示信息显示一段时间后再关闭
        setTimeout(() => {
            closeGame();
            // 3 秒后清除提示信息
            setTimeout(() => {
                gameMessage.textContent = '';
            }, 1000);
        }, 3000); 
    });

    // 不喜欢按钮点击事件（修复动画冲突）
    dislikeBtn.addEventListener('click', () => {
        console.log('点击了不喜欢按钮');
        gameMessage.textContent = '你再点那！';
        // 获取当前放大比例（默认1）
        const currentScale = parseFloat(likeBtn.style.transform.replace('scale(', '').replace(')', '')) || 1;

        // 每次点击增加的比例和最大限制
        const scaleStep = 0.3;
        const maxScale = 6.0;
        const newScale = Math.min(currentScale + scaleStep, maxScale);

        // 应用放大效果并同步CSS变量（解决动画冲突）
        likeBtn.style.transform = `scale(${newScale})`;
        likeBtn.style.setProperty('--scale', newScale);

        // 添加抖动效果
        likeBtn.classList.add('shake');
        setTimeout(() => {
            likeBtn.classList.remove('shake');
        }, 500);

        // 达到最大比例时提示
        if (newScale >= maxScale) {
            gameMessage.textContent = '再点就生气了！';
            setTimeout(() => {
                gameMessage.textContent = '';
            }, 3000); // 3 秒后清除提示信息
        }
    });

    // 创建玫瑰花雨
    function createRoses() {
        roseContainer.classList.remove('hidden');
        roseContainer.innerHTML = ''; // 清空容器

        const viewportWidth = window.innerWidth;

        // 创建50朵玫瑰花
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const rose = document.createElement('div');
                rose.className = 'rose';

                // 随机位置和大小
                const left = Math.random() * viewportWidth;
                const delay = Math.random() * 3;
                const size = 40 + Math.random() * 60;

                rose.style.left = `${left}px`;
                rose.style.animationDelay = `${delay}s`;
                rose.style.width = `${size}px`;
                rose.style.height = `${size}px`;
                rose.style.top = `-${size}px`; // 修正语法错误（移除空格）

                roseContainer.appendChild(rose);

                // 动画结束后隐藏容器
                if (i === 49) {
                    setTimeout(() => {
                        roseContainer.classList.add('hidden');
                    }, 4000);
                }
            }, i * 60);
        }
    }
}

// 通用提示消息功能（全局可用）
function showToast(message) {
    // 移除已存在的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // 创建新toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // 3秒后隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    // 确保移动菜单初始状态正确
    if (window.innerWidth <= 768 && !navLinks.classList.contains('hidden')) {
        navLinks.classList.add('hidden');
    }
});
