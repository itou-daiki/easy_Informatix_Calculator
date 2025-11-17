// シフト演算の実装

class ShiftCalculator {
    constructor() {
        this.number = 10;
        this.shiftAmount = 1;
        this.shiftType = 'left';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.calculate();
    }

    setupEventListeners() {
        const numberInput = document.getElementById('shift-number');
        const shiftAmount = document.getElementById('shift-amount');
        const shiftType = document.getElementById('shift-type');

        if (numberInput) {
            numberInput.addEventListener('input', (e) => {
                this.number = Math.min(255, Math.max(0, parseInt(e.target.value) || 0));
                numberInput.value = this.number;
                this.calculate();
            });
        }

        if (shiftAmount) {
            shiftAmount.addEventListener('input', (e) => {
                this.shiftAmount = Math.min(7, Math.max(1, parseInt(e.target.value) || 1));
                shiftAmount.value = this.shiftAmount;
                this.calculate();
            });
        }

        if (shiftType) {
            shiftType.addEventListener('change', (e) => {
                this.shiftType = e.target.value;
                this.calculate();
            });
        }
    }

    calculate() {
        const result = this.shiftType === 'left'
            ? this.number << this.shiftAmount
            : this.number >> this.shiftAmount;

        this.displayResults(result);
        this.displayBitVisualization(result);
    }

    displayResults(result) {
        const operation = this.shiftType === 'left' ? '<<' : '>>';
        const multiplier = Math.pow(2, this.shiftAmount);
        const mathOperation = this.shiftType === 'left'
            ? `${this.number} × ${multiplier}`
            : `${this.number} ÷ ${multiplier}`;

        // ステップ1: 元の数値
        const step1Content = document.getElementById('step1-content');
        if (step1Content) {
            step1Content.innerHTML = `
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">10進数</p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white">${this.number}</p>
                        </div>
                        <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">2進数（8ビット）</p>
                            <p class="text-2xl font-mono font-bold text-gray-900 dark:text-white">${NumberFormatter.toBinary(this.number, 8)}</p>
                        </div>
                    </div>
                    <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">ビット位置</p>
                        <div class="flex justify-between font-mono text-lg">
                            ${[7,6,5,4,3,2,1,0].map(i => `<span class="text-gray-700 dark:text-gray-300">${i}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        // ステップ2: シフト演算の実行
        const step2Content = document.getElementById('step2-content');
        if (step2Content) {
            const shiftTypeName = this.shiftType === 'left' ? '左シフト' : '右シフト';
            const direction = this.shiftType === 'left' ? '左' : '右';
            const fillSide = this.shiftType === 'left' ? '右側' : '左側';
            const lossSide = this.shiftType === 'left' ? '左端' : '右端';

            step2Content.innerHTML = `
                <div class="space-y-4">
                    <div class="alert alert-info">
                        <p class="font-semibold mb-2">
                            ${shiftTypeName} (${operation}) は、すべてのビットを <span class="text-blue-600 dark:text-blue-400 font-bold">${direction}</span> に移動させます
                        </p>
                        <ul class="space-y-1 text-sm ml-4">
                            <li>• ${fillSide}の空いた部分は <span class="text-green-600 dark:text-green-400 font-bold">0</span> で埋めます</li>
                            <li>• ${lossSide}からはみ出したビットは <span class="text-red-600 dark:text-red-400 font-bold">消失</span> します</li>
                            <li>• 数学的効果: <strong>${mathOperation} = ${result}</strong></li>
                        </ul>
                    </div>
                    <div class="p-4 bg-gray-100 dark:bg-gray-800 border-2 border-primary rounded-lg">
                        <p class="text-lg font-semibold text-center text-gray-900 dark:text-white">
                            ${this.number} ${operation} ${this.shiftAmount} = ${result}
                        </p>
                    </div>
                </div>
            `;
        }

        // ステップ4: 結果の確認
        const step4Content = document.getElementById('step4-content');
        if (step4Content) {
            step4Content.innerHTML = `
                <div class="overflow-x-auto">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>演算</th>
                                <th>2進数</th>
                                <th>10進数</th>
                                <th>数学的効果</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="font-mono font-bold">${this.number} ${operation} ${this.shiftAmount}</td>
                                <td class="font-mono">
                                    ${NumberFormatter.toBinary(this.number, 8)} →
                                    <span class="text-blue-600 dark:text-blue-400 font-bold">${NumberFormatter.toBinary(result, 8)}</span>
                                </td>
                                <td class="font-bold">
                                    ${this.number} →
                                    <span class="text-blue-600 dark:text-blue-400">${result}</span>
                                </td>
                                <td class="font-bold">
                                    ${this.shiftType === 'left' ? '×' : '÷'}${multiplier}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        }

        // 浮動小数点数での応用
        const floatingAppContent = document.getElementById('floating-app-content');
        if (floatingAppContent) {
            if (this.shiftType === 'left') {
                floatingAppContent.innerHTML = `
                    <div class="alert alert-info">
                        <p class="font-semibold mb-2">💡 浮動小数点数の正規化での応用:</p>
                        <ul class="space-y-2 text-sm ml-4">
                            <li>• 0.0001101₂ のような小数を正規化する際に左シフトを使用</li>
                            <li>• 小数点を右に移動させることで 1.101 × 2⁻⁴ の形にする</li>
                            <li>• コンピュータ内部では実際にビットを左にシフトして処理</li>
                        </ul>
                    </div>
                `;
            } else {
                floatingAppContent.innerHTML = `
                    <div class="alert alert-info">
                        <p class="font-semibold mb-2">💡 浮動小数点数での右シフト応用:</p>
                        <ul class="space-y-2 text-sm ml-4">
                            <li>• 非正規化数の処理で使用される場合がある</li>
                            <li>• オーバーフロー時の調整に利用</li>
                            <li>• 精度の調整や丸め処理で活用</li>
                        </ul>
                    </div>
                `;
            }
        }
    }

    displayBitVisualization(result) {
        const step3Content = document.getElementById('step3-content');
        if (!step3Content) return;

        const originalBits = NumberFormatter.toBinary(this.number, 8);
        const resultBits = NumberFormatter.toBinary(result, 8);

        step3Content.innerHTML = `
            <div class="space-y-6">
                <!-- 移動前 -->
                <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 font-semibold">移動前</p>
                    <div class="overflow-x-auto mb-4">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr>
                                    ${[7,6,5,4,3,2,1,0].map(i => `
                                        <th class="p-3 text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 font-mono text-sm">
                                            bit${i}
                                        </th>
                                    `).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    ${originalBits.split('').map((bit, i) => `
                                        <td class="p-3 text-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                                            <div class="text-3xl font-bold font-mono ${bit === '1' ? 'text-primary' : 'text-gray-400 dark:text-gray-600'}">
                                                ${bit}
                                            </div>
                                        </td>
                                    `).join('')}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-center font-mono text-lg font-bold text-gray-900 dark:text-white">
                        10進数: ${this.number}
                    </p>
                </div>

                <!-- シフト方向 -->
                <div class="flex justify-center items-center">
                    <div class="text-5xl animate-pulse">
                        ${this.shiftType === 'left' ? '⬅️' : '➡️'}
                    </div>
                    <div class="ml-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                        ${this.shiftType === 'left' ? '左シフト' : '右シフト'}
                    </div>
                </div>

                <!-- 移動後 -->
                <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 font-semibold">
                        ${this.shiftType === 'left' ? '左シフト' : '右シフト'}後
                    </p>
                    <div class="overflow-x-auto mb-4">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr>
                                    ${[7,6,5,4,3,2,1,0].map(i => `
                                        <th class="p-3 text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 font-mono text-sm">
                                            bit${i}
                                        </th>
                                    `).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    ${resultBits.split('').map((bit, i) => {
                                        const originalBit = originalBits[i];
                                        const changed = bit !== originalBit;
                                        return `
                                            <td class="p-3 text-center border border-gray-300 dark:border-gray-600 ${changed ? 'bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20' : 'bg-white dark:bg-gray-900'}">
                                                <div class="text-3xl font-bold font-mono ${bit === '1' ? 'text-primary' : 'text-gray-400 dark:text-gray-600'}">
                                                    ${bit}
                                                </div>
                                            </td>
                                        `;
                                    }).join('')}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-center font-mono text-lg font-bold text-gray-900 dark:text-white">
                        10進数: ${result}
                    </p>
                </div>
            </div>
        `;
    }
}

// 練習問題の管理
class ShiftQuizManager {
    constructor() {
        this.quizzes = [
            {
                id: 'q1',
                question: '6 を 3ビット左シフトした結果は？',
                answer: 48,
                explanation: '計算: 6 × 2³ = 6 × 8 = 48',
                hint: '左シフトは2の累乗倍になります'
            },
            {
                id: 'q2',
                question: '56 を 2ビット右シフトした結果は？',
                answer: 14,
                explanation: '計算: 56 ÷ 2² = 56 ÷ 4 = 14',
                hint: '右シフトは2の累乗で割ります'
            },
            {
                id: 'q3',
                question: '2進数 10110 を1ビット左シフトした結果は？（2進数で回答）',
                answer: '101100',
                explanation: '10進数: 22 → 44',
                hint: 'すべてのビットを左に1つ移動し、右側を0で埋めます'
            },
            {
                id: 'q4',
                question: '32 を 3ビット右シフトした結果は？',
                answer: 4,
                explanation: '計算: 32 ÷ 2³ = 32 ÷ 8 = 4',
                hint: '32 = 2⁵ なので、3ビット右シフトすると 2² = 4'
            },
            {
                id: 'q5',
                question: '15 を 2ビット左シフトした結果は？',
                answer: 60,
                explanation: '計算: 15 × 2² = 15 × 4 = 60',
                hint: '2ビット左シフトは4倍と同じです'
            }
        ];

        this.init();
    }

    init() {
        this.quizzes.forEach(quiz => {
            const checkBtn = document.getElementById(`check-${quiz.id}`);
            const hintBtn = document.getElementById(`hint-${quiz.id}`);

            if (checkBtn) {
                checkBtn.addEventListener('click', () => this.checkAnswer(quiz));
            }

            if (hintBtn) {
                hintBtn.addEventListener('click', () => this.showHint(quiz));
            }
        });
    }

    checkAnswer(quiz) {
        const answerInput = document.getElementById(`answer-${quiz.id}`);
        const resultDiv = document.getElementById(`result-${quiz.id}`);

        if (!answerInput || !resultDiv) return;

        const userAnswer = answerInput.value.trim();
        const isCorrect = userAnswer == quiz.answer;

        if (isCorrect) {
            resultDiv.innerHTML = `
                <div class="alert alert-success mt-3 animate-fadeIn">
                    <p class="font-semibold">✓ 正解！</p>
                    <p class="text-sm mt-1">${quiz.explanation}</p>
                </div>
            `;
            NotificationManager.show('正解です！', 'success');
            window.progressManager.markComplete('shift-quiz', quiz.id);
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-error mt-3 animate-fadeIn">
                    <p class="font-semibold">✗ 不正解</p>
                    <p class="text-sm mt-1">正解は ${quiz.answer} です</p>
                    <p class="text-sm mt-1">${quiz.explanation}</p>
                </div>
            `;
            NotificationManager.show('もう一度挑戦してみましょう', 'error');
        }
    }

    showHint(quiz) {
        const resultDiv = document.getElementById(`result-${quiz.id}`);
        if (!resultDiv) return;

        resultDiv.innerHTML = `
            <div class="alert alert-info mt-3 animate-fadeIn">
                <p class="font-semibold">💡 ヒント</p>
                <p class="text-sm mt-1">${quiz.hint}</p>
            </div>
        `;
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // シフト計算機の初期化
    if (document.getElementById('shift-number')) {
        window.shiftCalculator = new ShiftCalculator();
    }

    // クイズマネージャーの初期化
    if (document.getElementById('check-q1')) {
        window.shiftQuizManager = new ShiftQuizManager();
    }

    // タブマネージャーの初期化
    if (document.getElementById('shift-tabs')) {
        new TabManager('shift-tabs');
    }
});
