// 論理演算学習アプリ

class LogicalOperations {
    constructor() {
        this.init();
    }

    init() {
        // 計算ボタン
        const calcBtn = document.getElementById('calc-btn');
        if (calcBtn) {
            calcBtn.addEventListener('click', () => this.calculate());
        }

        // NOTボタン
        const notBtn = document.getElementById('not-btn');
        if (notBtn) {
            notBtn.addEventListener('click', () => this.calculateNot());
        }

        // 練習問題
        this.initQuiz();
    }

    // 2進数の妥当性チェック
    isValidBinary(value) {
        return /^[01]+$/.test(value);
    }

    // 論理演算の実行
    performOperation(a, b, operation) {
        const len = Math.max(a.length, b.length);
        a = a.padStart(len, '0');
        b = b.padStart(len, '0');

        let result = '';
        for (let i = 0; i < len; i++) {
            const bitA = parseInt(a[i]);
            const bitB = parseInt(b[i]);
            let bitResult;

            switch (operation) {
                case 'and':
                    bitResult = bitA & bitB;
                    break;
                case 'or':
                    bitResult = bitA | bitB;
                    break;
                case 'xor':
                    bitResult = bitA ^ bitB;
                    break;
                case 'nand':
                    bitResult = (bitA & bitB) ? 0 : 1;
                    break;
                case 'nor':
                    bitResult = (bitA | bitB) ? 0 : 1;
                    break;
                default:
                    bitResult = 0;
            }
            result += bitResult;
        }
        return result;
    }

    // NOT演算
    performNot(value) {
        let result = '';
        for (let i = 0; i < value.length; i++) {
            result += value[i] === '0' ? '1' : '0';
        }
        return result;
    }

    // 計算実行
    calculate() {
        const valueA = document.getElementById('value-a').value.trim();
        const valueB = document.getElementById('value-b').value.trim();
        const operation = document.getElementById('operation').value;

        if (!valueA || !valueB) {
            alert('値を入力してください');
            return;
        }

        if (!this.isValidBinary(valueA) || !this.isValidBinary(valueB)) {
            alert('0と1のみで入力してください');
            return;
        }

        const result = this.performOperation(valueA, valueB, operation);
        this.displayResult(valueA, valueB, result, operation);
    }

    // NOT計算
    calculateNot() {
        const value = document.getElementById('not-value').value.trim();

        if (!value) {
            alert('値を入力してください');
            return;
        }

        if (!this.isValidBinary(value)) {
            alert('0と1のみで入力してください');
            return;
        }

        const result = this.performNot(value);
        this.displayNotResult(value, result);
    }

    // 演算名の取得
    getOperationName(operation) {
        const names = {
            'and': 'AND',
            'or': 'OR',
            'xor': 'XOR',
            'nand': 'NAND',
            'nor': 'NOR'
        };
        return names[operation] || operation;
    }

    // 結果表示
    displayResult(valueA, valueB, result, operation) {
        document.getElementById('calc-result').classList.remove('hidden');

        const opName = this.getOperationName(operation);
        const len = Math.max(valueA.length, valueB.length);
        valueA = valueA.padStart(len, '0');
        valueB = valueB.padStart(len, '0');

        // ビット毎の計算過程を表示
        let bitByBitHtml = '<div class="space-y-2 mb-4">';
        for (let i = 0; i < len; i++) {
            const bitA = valueA[i];
            const bitB = valueB[i];
            const bitResult = result[i];
            bitByBitHtml += `
                <div class="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span class="text-gray-700 dark:text-gray-300 text-sm">ビット${i}:</span>
                    <div class="digit-box">${bitA}</div>
                    <span class="text-gray-700 dark:text-gray-300 font-semibold">${opName}</span>
                    <div class="digit-box">${bitB}</div>
                    <span class="text-gray-700 dark:text-gray-300 font-semibold">=</span>
                    <div class="digit-box">${bitResult}</div>
                </div>
            `;
        }
        bitByBitHtml += '</div>';

        const html = `
            <div class="space-y-4">
                <div class="text-center mb-6">
                    <div class="text-2xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                        ${valueA} ${opName} ${valueB} = ${result}
                    </div>
                    <p class="text-gray-600 dark:text-gray-400">
                        10進数: ${parseInt(valueA, 2)} ${opName} ${parseInt(valueB, 2)} = ${parseInt(result, 2)}
                    </p>
                </div>

                <div class="step-card">
                    <h4 class="font-bold mb-3 text-gray-900 dark:text-white">ビット毎の計算</h4>
                    ${bitByBitHtml}
                </div>

                <div class="grid grid-cols-3 gap-4 text-center">
                    <div class="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">値A</p>
                        <p class="font-mono font-bold text-gray-900 dark:text-white">${valueA}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">(${parseInt(valueA, 2)})</p>
                    </div>
                    <div class="p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">値B</p>
                        <p class="font-mono font-bold text-gray-900 dark:text-white">${valueB}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">(${parseInt(valueB, 2)})</p>
                    </div>
                    <div class="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">結果</p>
                        <p class="font-mono font-bold text-gray-900 dark:text-white">${result}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">(${parseInt(result, 2)})</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('result-display').innerHTML = html;
    }

    // NOT結果表示
    displayNotResult(value, result) {
        document.getElementById('not-result').classList.remove('hidden');

        // ビット毎の計算過程を表示
        let bitByBitHtml = '<div class="space-y-2 mb-4">';
        for (let i = 0; i < value.length; i++) {
            bitByBitHtml += `
                <div class="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span class="text-gray-700 dark:text-gray-300 text-sm">ビット${i}:</span>
                    <span class="text-gray-700 dark:text-gray-300 font-semibold">NOT</span>
                    <div class="digit-box">${value[i]}</div>
                    <span class="text-gray-700 dark:text-gray-300 font-semibold">=</span>
                    <div class="digit-box">${result[i]}</div>
                </div>
            `;
        }
        bitByBitHtml += '</div>';

        const html = `
            <div class="space-y-4">
                <div class="text-center mb-6">
                    <div class="text-2xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                        NOT ${value} = ${result}
                    </div>
                    <p class="text-gray-600 dark:text-gray-400">
                        10進数: NOT ${parseInt(value, 2)} = ${parseInt(result, 2)}
                    </p>
                </div>

                <div class="step-card">
                    <h4 class="font-bold mb-3 text-gray-900 dark:text-white">ビット毎の計算</h4>
                    ${bitByBitHtml}
                </div>

                <div class="grid grid-cols-2 gap-4 text-center">
                    <div class="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">入力</p>
                        <p class="font-mono font-bold text-gray-900 dark:text-white">${value}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">(${parseInt(value, 2)})</p>
                    </div>
                    <div class="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">結果</p>
                        <p class="font-mono font-bold text-gray-900 dark:text-white">${result}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">(${parseInt(result, 2)})</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('not-result-display').innerHTML = html;
    }

    // 練習問題の初期化
    initQuiz() {
        // 問題1: 1101 AND 1011 = 1001
        const checkQ1 = document.getElementById('check-q1');
        if (checkQ1) {
            checkQ1.addEventListener('click', () => {
                const answer = document.getElementById('answer-q1').value.trim();
                const correct = '1001';
                this.showQuizResult('result-q1', answer, correct,
                    '計算過程: 1 AND 1=1, 1 AND 0=0, 0 AND 1=0, 1 AND 1=1 → 1001');
            });
        }

        // 問題2: 0110 OR 1010 = 1110
        const checkQ2 = document.getElementById('check-q2');
        if (checkQ2) {
            checkQ2.addEventListener('click', () => {
                const answer = document.getElementById('answer-q2').value.trim();
                const correct = '1110';
                this.showQuizResult('result-q2', answer, correct,
                    '計算過程: 0 OR 1=1, 1 OR 0=1, 1 OR 1=1, 0 OR 0=0 → 1110');
            });
        }

        // 問題3: 1100 XOR 1010 = 0110
        const checkQ3 = document.getElementById('check-q3');
        if (checkQ3) {
            checkQ3.addEventListener('click', () => {
                const answer = document.getElementById('answer-q3').value.trim();
                const correct = '0110';
                this.showQuizResult('result-q3', answer, correct,
                    '計算過程: 1 XOR 1=0, 1 XOR 0=1, 0 XOR 1=1, 0 XOR 0=0 → 0110');
            });
        }

        // 問題4: NOT 1010 = 0101
        const checkQ4 = document.getElementById('check-q4');
        if (checkQ4) {
            checkQ4.addEventListener('click', () => {
                const answer = document.getElementById('answer-q4').value.trim();
                const correct = '0101';
                this.showQuizResult('result-q4', answer, correct,
                    '計算過程: NOT 1=0, NOT 0=1, NOT 1=0, NOT 0=1 → 0101');
            });
        }
    }

    // 練習問題の結果表示
    showQuizResult(elementId, answer, correct, explanation) {
        const element = document.getElementById(elementId);
        const isCorrect = answer === correct;

        const html = `
            <div class="alert ${isCorrect ? 'alert-success' : 'alert-warning'}">
                <p class="font-bold mb-2">${isCorrect ? '✅ 正解です！' : '❌ 不正解です'}</p>
                <p class="text-sm">${explanation}</p>
                ${!isCorrect ? `<p class="text-sm mt-2">正解: ${correct}</p>` : ''}
            </div>
        `;

        element.innerHTML = html;
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new LogicalOperations();
});
