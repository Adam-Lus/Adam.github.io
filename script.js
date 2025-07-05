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

// 猜数字游戏逻辑
const startGuessGameBtn = document.getElementById('start-guess-game-btn');
const guessGameModal = document.getElementById('guess-game-modal');
const guessInput = document.getElementById('guess-input');
const guessSubmitBtn = document.getElementById('guess-submit-btn');
const guessResult = document.getElementById('guess-result');

if (startGuessGameBtn && guessGameModal && guessInput && guessSubmitBtn && guessResult) {
    let secretNumber;

    // 打开猜数字游戏
    startGuessGameBtn.addEventListener('click', () => {
        guessGameModal.classList.add('active');
        secretNumber = Math.floor(Math.random() * 100) + 1;
        guessInput.value = '';
        guessResult.textContent = '';
    });

    // 关闭猜数字游戏
    function closeGuessGame() {
        guessGameModal.classList.remove('active');
    }

    // 提交猜测
    guessSubmitBtn.addEventListener('click', () => {
        const guess = parseInt(guessInput.value);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            guessResult.textContent = '请输入1 - 100之间的数字哦~';
        } else if (guess < secretNumber) {
            guessResult.textContent = '小了那宝贝，再试试！';
            guessInput.classList.add('shake-guess');
            setTimeout(() => {
                guessInput.classList.remove('shake-guess');
            }, 500);
        } else if (guess > secretNumber) {
            guessResult.textContent = '大了那宝贝，再试试！';
            guessInput.classList.add('shake-guess');
            setTimeout(() => {
                guessInput.classList.remove('shake-guess');
            }, 500);
        } else {
            guessResult.textContent = '猜对啦，宝贝真棒！🎉';
            setTimeout(() => {
                closeGuessGame();
            }, 3000);
        }
    });
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

// 获取音频元素、按钮元素和音乐选择下拉框
const bgm = document.getElementById('bgm');
const bgmToggle = document.createElement('button'); // 创建新按钮
const musicSelect = document.getElementById('music-select');

// 设置按钮样式
bgmToggle.innerHTML = '<i class="fa fa-music"></i>';
bgmToggle.className = 'bgm-toggle-btn';

// 将按钮插入到音乐选择器后面
if (musicSelect) {
    musicSelect.parentNode.insertBefore(bgmToggle, musicSelect.nextSibling);
}

// 为按钮添加点击事件监听器
if (bgm && bgmToggle) {
    bgmToggle.addEventListener('click', () => {
        if (bgm.paused) {
            bgm.play();
            bgm.muted = false;
            bgmToggle.innerHTML = '<i class="fa fa-pause"></i>'; // 切换为暂停图标
        } else {
            bgm.pause();
            bgmToggle.innerHTML = '<i class="fa fa-music"></i>'; // 切换为播放图标
        }
    });
}

// 为音乐选择下拉框添加 change 事件监听器
if (bgm && musicSelect) {
    musicSelect.addEventListener('change', () => {
        const selectedMusic = musicSelect.value;
        bgm.src = selectedMusic;
        bgm.play();
        bgm.muted = false;
        bgmToggle.innerHTML = '<i class="fa fa-pause"></i>'; // 切换为暂停图标
    });
}

// 拼图游戏逻辑
const startPuzzleBtn = document.getElementById('start-puzzle-btn');
const puzzleModal = document.createElement('div');
puzzleModal.id = 'puzzle-modal';
puzzleModal.className = 'game-modal hidden';

// 创建拼图模态框内容
puzzleModal.innerHTML = `
  <div class="game-modal-content">
    <h4 class="game-question">拼图游戏</h4>
    <div class="puzzle-container" id="puzzle-container"></div>
    <div class="puzzle-controls">
      <span id="moves">移动次数: 0</span>
      <div class="puzzle-buttons">
        <button id="auto-solve-puzzle" class="option-btn like-btn">自动复原</button>
        <button id="reset-puzzle" class="option-btn like-btn">重新开始</button>
      </div>
    </div>
  </div>
`;

// 将拼图模态框添加到页面
document.body.appendChild(puzzleModal);

// 拼图游戏变量
// 修改获取 puzzle-container 的方式
const puzzleContainer = puzzleModal.querySelector('#puzzle-container');
const resetPuzzleBtn = puzzleModal.querySelector('#reset-puzzle');
const movesCounter = puzzleModal.querySelector('#moves');
let puzzleTiles = [];
let emptyTileIndex = 8; // 初始空位在右下角
let moves = 0;
let tileSize = 100; // 默认瓦片大小
let isGameCompleted = false; // 新增：游戏是否完成的标记

// 拼图图片配置，定义多个图片路径
const puzzleImages = [
  'images/rose.png', // 替换为你自己图片的文件名
  'images/puzzle1.jpg', // 添加更多图片路径
  'images/puzzle2.jpg','images/puzzle3.jpg','images/puzzle4.jpg'
  // 可以继续添加更多图片
];

// 初始化拼图游戏
function initPuzzle() {
    // 随机选择一张图片作为当前的拼图图片
    const randomIndex = Math.floor(Math.random() * puzzleImages.length);
    const puzzleImage = puzzleImages[randomIndex];

    // 设置容器样式
    setContainerStyle();

    puzzleTiles = [];
    emptyTileIndex = 8;
    moves = 0;
    movesCounter.textContent = `移动次数: ${moves}`;

    // 生成可解的随机拼图
    let numbers = generateSolvablePuzzle();

    // 清空容器
    puzzleContainer.innerHTML = '';

    // 创建拼图瓦片
    numbers.forEach((number, index) => {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        tile.dataset.index = index;

        if (number !== null) {
            // 设置背景图片和位置
            const row = Math.floor(number / 3);
            const col = number % 3;
            tile.style.backgroundImage = `url(${puzzleImage})`;
            tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;
            tile.style.backgroundSize = `${tileSize * 3}px ${tileSize * 3}px`;
        } else {
            tile.classList.add('empty');
        }

        // 添加点击事件，无论是否为空白块都添加
        tile.addEventListener('click', () => {
            if (isAdjacent(index, emptyTileIndex)) {
                swapTiles(index, emptyTileIndex);
                emptyTileIndex = index;
                moves++;
                movesCounter.textContent = `移动次数: ${moves}`;

                // 检查是否完成
                if (isPuzzleComplete()) {
                    setTimeout(() => {
                        showToast('恭喜宝贝完成了拼图！🎉');
                    }, 500);
                }
            }
        });

        // 设置瓦片大小
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;

        puzzleContainer.appendChild(tile);
        puzzleTiles.push(tile);
    });
}

// 自动复原拼图
function autoSolvePuzzle() {
    // 目标状态
    const targetState = [0, 1, 2, 3, 4, 5, 6, 7, null];
    // 当前状态
    const currentState = puzzleTiles.map(tile => {
        if (tile.classList.contains('empty')) {
            return null;
        }
        const bgPosition = tile.style.backgroundPosition;
        const [x, y] = bgPosition.split(' ').map(val => parseInt(val.replace('px', '')));
        const col = -x / tileSize;
        const row = -y / tileSize;
        return row * 3 + col;
    });

    // 广度优先搜索（BFS）
    const queue = [currentState];
    const visited = new Set([JSON.stringify(currentState)]);
    const parent = new Map();

    while (queue.length > 0) {
        const current = queue.shift();
        if (arraysEqual(current, targetState)) {
            break;
        }

        const emptyIndex = current.indexOf(null);
        const neighbors = getNeighbors(current, emptyIndex);

        for (const neighbor of neighbors) {
            const neighborStr = JSON.stringify(neighbor);
            if (!visited.has(neighborStr)) {
                queue.push(neighbor);
                visited.add(neighborStr);
                parent.set(neighborStr, JSON.stringify(current));
            }
        }
    }

    // 回溯路径
    const path = [];
    let current = JSON.stringify(targetState);
    while (current !== JSON.stringify(currentState)) {
        path.unshift(JSON.parse(current));
        current = parent.get(current);
    }
    path.unshift(currentState);

    // 按路径交换
    let stepIndex = 0;
    const intervalId = setInterval(() => {
        if (stepIndex < path.length - 1) {
            const current = path[stepIndex];
            const next = path[stepIndex + 1];
            const emptyIndex = current.indexOf(null);
            const tileIndex = next.indexOf(null);

            swapTiles(puzzleTiles.findIndex(tile => {
                if (tile.classList.contains('empty')) {
                    return false;
                }
                const bgPosition = tile.style.backgroundPosition;
                const [x, y] = bgPosition.split(' ').map(val => parseInt(val.replace('px', '')));
                const col = -x / tileSize;
                const row = -y / tileSize;
                return row * 3 + col === current[tileIndex];
            }), emptyIndex);

            emptyTileIndex = tileIndex;
            moves++;
            movesCounter.textContent = `移动次数: ${moves}`;
            stepIndex++;
        } else {
            clearInterval(intervalId);
            setTimeout(() => {
                showToast('拼图已自动复原！🎉');
            }, 500);
        }
    }, 500); // 每 500ms 执行一步
}

// 检查两个数组是否相等
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// 获取相邻状态
function getNeighbors(state, emptyIndex) {
    const neighbors = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
            const newIndex = newRow * 3 + newCol;
            const newState = [...state];
            [newState[emptyIndex], newState[newIndex]] = [newState[newIndex], newState[emptyIndex]];
            neighbors.push(newState);
        }
    }
    return neighbors;
}

// 获取自动复原按钮
const autoSolvePuzzleBtn = puzzleModal.querySelector('#auto-solve-puzzle');

// 为自动复原按钮添加点击事件监听器
if (autoSolvePuzzleBtn) {
    autoSolvePuzzleBtn.addEventListener('click', autoSolvePuzzle);
}

// 设置容器样式
function setContainerStyle() {
    // 获取容器宽度，计算合适的瓦片大小
    const containerWidth = puzzleContainer.getBoundingClientRect().width;
    const maxTileSize = Math.floor((containerWidth - 10) / 3); // 减去间隙

    // 设置瓦片大小，最大不超过120px
    tileSize = Math.min(maxTileSize, 120);

    // 设置容器样式
    puzzleContainer.style.display = 'grid';
    puzzleContainer.style.gridTemplateColumns = `repeat(3, ${tileSize}px)`;
    puzzleContainer.style.gridTemplateRows = `repeat(3, ${tileSize}px)`;
    puzzleContainer.style.gap = '5px';
    puzzleContainer.style.justifyContent = 'center';
}

// 检查两个瓦片是否相邻
function isAdjacent(index1, index2) {
    const row1 = Math.floor(index1 / 3);
    const col1 = index1 % 3;
    const row2 = Math.floor(index2 / 3);
    const col2 = index2 % 3;

    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);

    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// 交换两个瓦片
function swapTiles(index1, index2) {
    // 保存 index1 的背景图片和位置样式
    const tempBgImage = puzzleTiles[index1].style.backgroundImage;
    const tempBgPosition = puzzleTiles[index1].style.backgroundPosition;

    // 将 index2 的背景图片和位置样式赋给 index1
    puzzleTiles[index1].style.backgroundImage = puzzleTiles[index2].style.backgroundImage;
    puzzleTiles[index1].style.backgroundPosition = puzzleTiles[index2].style.backgroundPosition;

    // 将之前保存的 index1 的背景图片和位置样式赋给 index2
    puzzleTiles[index2].style.backgroundImage = tempBgImage;
    puzzleTiles[index2].style.backgroundPosition = tempBgPosition;

    // 更新空瓦片类
    puzzleTiles.forEach(tile => tile.classList.remove('empty'));
    puzzleTiles[index2].classList.add('empty');

    // 设置背景颜色
    puzzleTiles.forEach(tile => {
        if (tile.classList.contains('empty')) {
            tile.style.backgroundColor = 'transparent';
        } else {
            tile.style.backgroundColor = 'white'; // 恢复默认背景色，让 CSS 样式生效
        }
    });
}

// 检查拼图是否完成
function isPuzzleComplete() {
    for (let i = 0; i < 8; i++) {
        // 检查背景位置是否正确
        const row = Math.floor(i / 3);
        const col = i % 3;
        const correctPosition = `-${col * tileSize}px -${row * tileSize}px`;

        if (puzzleTiles[i].style.backgroundPosition !== correctPosition) {
            return false;
        }
    }
    return true;
}

// 生成可解的拼图排列
function generateSolvablePuzzle() {
    // 创建1-8的数字数组
    let numbers = Array.from({ length: 8 }, (_, i) => i);

    // 执行Fisher-Yates洗牌算法
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // 添加空瓦片（在右下角）
    numbers.push(null);

    // 检查拼图是否可解且不是已完成状态
    while (!isSolvable(numbers) || isComplete(numbers)) {
        // 如果不可解或已完成，重新洗牌
        for (let i = numbers.length - 2; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
    }

    return numbers;
}

// 检查拼图是否可解
function isSolvable(puzzle) {
    // 计算逆序数
    let inversions = 0;
    const puzzleWithoutEmpty = puzzle.filter(tile => tile !== null);

    for (let i = 0; i < puzzleWithoutEmpty.length; i++) {
        for (let j = i + 1; j < puzzleWithoutEmpty.length; j++) {
            if (puzzleWithoutEmpty[i] > puzzleWithoutEmpty[j]) {
                inversions++;
            }
        }
    }

    // 对于3x3拼图，逆序数为偶数时有解
    return inversions % 2 === 0;
}

// 检查拼图是否已经完成
function isComplete(puzzle) {
    // 检查数字顺序是否正确
    for (let i = 0; i < 8; i++) {
        if (puzzle[i] !== i) {
            return false;
        }
    }

    // 检查空白块是否在右下角(索引8)
    return puzzle[8] === null;
}

// 打乱数组（原函数保留但不再使用）
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 显示提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // 显示提示
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 添加提示消息样式
function addToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
    .toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px 20px;
      border-radius: 20px;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 100;
    }
    .toast.show {
      opacity: 1;
    }
  `;
    document.head.appendChild(style);
}

// 打开拼图游戏
if (startPuzzleBtn) {
    startPuzzleBtn.addEventListener('click', () => {
        puzzleModal.classList.add('active');
        // 添加提示样式
        if (!document.querySelector('.toast')) {
            addToastStyles();
        }

        // 等待模态框显示动画完成后再初始化拼图
        setTimeout(() => {
            initPuzzle();
        }, 300); 

        // 监听窗口大小变化，重新调整拼图
        window.addEventListener('resize', () => {
            if (puzzleModal.classList.contains('active')) {
                initPuzzle();
            }
        });
    });
}

// 关闭拼图游戏
puzzleModal.addEventListener('click', (e) => {
    if (e.target === puzzleModal) {
        puzzleModal.classList.remove('active');
    }
});
// 关闭拼图游戏
function closePuzzleGame() {
    puzzleModal.classList.remove('active');
}

// 重置拼图
if (resetPuzzleBtn) {
    resetPuzzleBtn.addEventListener('click', initPuzzle);
}

// 页面加载时设置默认音乐
if (bgm && musicSelect) {
    const defaultMusic = musicSelect.options[0].value;
    bgm.src = defaultMusic;
    bgm.play();
    bgm.muted = false;
    bgmToggle.innerHTML = '<i class="fa fa-pause"></i>'; // 切换为暂停图标
}
// 获取所有关闭按钮
const closeModals = document.querySelectorAll('.close-modal');

// 为每个关闭按钮添加点击事件
closeModals.forEach(closeModal => {
    closeModal.addEventListener('click', () => {
        const modal = closeModal.closest('.game-modal');
        modal.classList.remove('active');
    });
});
