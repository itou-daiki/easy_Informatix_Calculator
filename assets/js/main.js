// 共通ユーティリティ関数

// ダークモード管理
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        this.updateToggleButton();
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        document.documentElement.classList.toggle('dark');
        this.updateToggleButton();
    }

    updateToggleButton() {
        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.innerHTML = this.theme === 'light'
                ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>'
                : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>';
        }
    }
}

// プログレス管理
class ProgressManager {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('learning-progress') || '{}');
    }

    markComplete(section, item) {
        if (!this.data[section]) {
            this.data[section] = [];
        }
        if (!this.data[section].includes(item)) {
            this.data[section].push(item);
            this.save();
        }
    }

    isComplete(section, item) {
        return this.data[section] && this.data[section].includes(item);
    }

    getProgress(section) {
        return this.data[section] ? this.data[section].length : 0;
    }

    save() {
        localStorage.setItem('learning-progress', JSON.stringify(this.data));
    }

    reset() {
        this.data = {};
        this.save();
    }
}

// タブ管理
class TabManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (this.container) {
            this.init();
        }
    }

    init() {
        const tabButtons = this.container.querySelectorAll('[data-tab]');
        const tabContents = this.container.querySelectorAll('[data-tab-content]');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');

                // Update buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('border-blue-500', 'text-blue-600', 'dark:border-blue-400', 'dark:text-blue-400');
                    btn.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
                });
                button.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
                button.classList.add('border-blue-500', 'text-blue-600', 'dark:border-blue-400', 'dark:text-blue-400');

                // Update contents
                tabContents.forEach(content => {
                    if (content.getAttribute('data-tab-content') === tabName) {
                        content.classList.remove('hidden');
                        content.classList.add('animate-fadeIn');
                    } else {
                        content.classList.add('hidden');
                    }
                });
            });
        });
    }
}

// アニメーション付きカウンター
function animateCounter(element, start, end, duration) {
    let startTime = null;

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// 数値フォーマッター
const NumberFormatter = {
    toBinary: (num, bits = 8) => {
        return num.toString(2).padStart(bits, '0');
    },

    toDecimal: (binary) => {
        return parseInt(binary, 2);
    },

    toSuperscript: (num) => {
        const superscriptMap = {
            '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³',
            '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
        };
        return String(num).split('').map(c => superscriptMap[c] || c).join('');
    },

    decimalToBinaryFraction: (decimal, precision = 23) => {
        if (decimal === 0) return "0.0";

        const integerPart = Math.floor(Math.abs(decimal));
        let fractionalPart = Math.abs(decimal) - integerPart;

        const binaryInt = integerPart === 0 ? "0" : integerPart.toString(2);

        let binaryFrac = "";
        let count = 0;
        while (fractionalPart > 0 && count < precision) {
            fractionalPart *= 2;
            if (fractionalPart >= 1) {
                binaryFrac += "1";
                fractionalPart -= 1;
            } else {
                binaryFrac += "0";
            }
            count++;
        }

        return `${binaryInt}.${binaryFrac}`;
    }
};

// 通知表示
class NotificationManager {
    static show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notification-container') || this.createContainer();

        const notification = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };

        notification.className = `${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 mb-2`;
        notification.textContent = message;
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';

        container.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    static createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-4 right-4 z-50';
        document.body.appendChild(container);
        return container;
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.progressManager = new ProgressManager();

    // テーマ切り替えボタンのイベント
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            window.themeManager.toggle();
        });
    }

    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// エクスポート（グローバルスコープで使用可能にする）
window.ThemeManager = ThemeManager;
window.ProgressManager = ProgressManager;
window.TabManager = TabManager;
window.animateCounter = animateCounter;
window.NumberFormatter = NumberFormatter;
window.NotificationManager = NotificationManager;
