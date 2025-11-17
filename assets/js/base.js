// 基数変換学習アプリ

class BaseConverter {
    constructor() {
        this.init();
    }

    init() {
        // 変換ボタン
        const convertBtn = document.getElementById('convert-base-btn');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.convert());
        }

        // 練習問題
        this.initQuiz();
    }

    // 基数変換実行
    convert() {
        const inputValue = document.getElementById('input-value').value.trim();
        const fromBase = parseInt(document.getElementById('from-base').value);
        const toBase = parseInt(document.getElementById('to-base').value);

        if (!inputValue) {
            alert('値を入力してください');
            return;
        }

        // 入力値の妥当性チェック
        if (!this.isValidNumber(inputValue, fromBase)) {
            alert(`${fromBase}進数として無効な値です`);
            return;
        }

        // 変換実行
        const decimalValue = this.toDecimal(inputValue, fromBase);
        const result = this.fromDecimal(decimalValue, toBase);

        // 結果表示
        this.displayResult(inputValue, fromBase, toBase, decimalValue, result);
    }

    // 有効な数値かチェック
    isValidNumber(value, base) {
        const validChars = '0123456789ABCDEF'.substring(0, base);
        return value.toUpperCase().split('').every(char => validChars.includes(char));
    }

    // n進数を10進数に変換
    toDecimal(value, base) {
        return parseInt(value, base);
    }

    // 10進数をn進数に変換
    fromDecimal(decimal, base) {
        if (decimal === 0) return '0';
        return decimal.toString(base).toUpperCase();
    }

    // 結果表示
    displayResult(inputValue, fromBase, toBase, decimalValue, result) {
        document.getElementById('conversion-result').classList.remove('hidden');

        // 入力値表示
        this.displayInput(inputValue, fromBase);

        // ステップ1: 10進数への変換
        this.displayStep1(inputValue, fromBase, decimalValue);

        // ステップ2: 目的の進数への変換
        this.displayStep2(decimalValue, toBase, result);

        // 最終結果
        this.displayFinalResult(inputValue, fromBase, result, toBase);
    }

    // 入力値表示
    displayInput(value, base) {
        const html = `
            <div class="base-box">
                ${value} (${base}進数)
            </div>
        `;
        document.getElementById('input-display').innerHTML = html;
    }

    // ステップ1: 10進数への変換表示
    displayStep1(value, base, decimal) {
        let html = '';

        if (base === 10) {
            html = `
                <p class="text-gray-700 dark:text-gray-300 mb-4">すでに10進数です。</p>
                <div class="base-box">${decimal}₁₀</div>
            `;
        } else {
            // 位取り記数法による計算過程
            const digits = value.toUpperCase().split('').reverse();

            // 位取り表を作成
            html = `
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>位取り記数法</strong>を使って各桁の値を計算します：
                </p>

                <!-- 位取り表 -->
                <div class="overflow-x-auto mb-6">
                    <table class="w-full border-collapse">
                        <thead>
                            <tr>
                                <th class="p-2 text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">桁</th>
                                ${digits.map((_, i) => `
                                    <th class="p-2 text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 font-mono">
                                        ${base}<sup>${digits.length - 1 - i}</sup>
                                    </th>
                                `).reverse().join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="p-2 text-center font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">重み</td>
                                ${digits.map((_, i) => {
                                    const position = digits.length - 1 - i;
                                    const weight = Math.pow(base, position);
                                    return `
                                        <td class="p-2 text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 font-mono font-bold">
                                            ${weight}
                                        </td>
                                    `;
                                }).reverse().join('')}
                            </tr>
                            <tr>
                                <td class="p-2 text-center font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">値</td>
                                ${digits.map((digit, i) => `
                                    <td class="p-2 text-center border border-gray-300 dark:border-gray-600">
                                        <div class="digit-box">${digit}</div>
                                    </td>
                                `).reverse().join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 計算式 -->
                <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg mb-4">
                    <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">計算式：</p>
                    <p class="text-gray-700 dark:text-gray-300 font-mono text-lg">
                        ${digits.map((digit, i) => {
                            const digitValue = parseInt(digit, base);
                            const position = digits.length - 1 - i;
                            const weight = Math.pow(base, position);
                            return `${digit}×${weight}`;
                        }).reverse().join(' + ')}
                    </p>
                    <p class="text-gray-700 dark:text-gray-300 font-mono text-lg mt-2">
                        = ${digits.map((digit, i) => {
                            const digitValue = parseInt(digit, base);
                            const position = digits.length - 1 - i;
                            const weight = Math.pow(base, position);
                            return digitValue * weight;
                        }).reverse().join(' + ')}
                    </p>
                    <p class="text-gray-700 dark:text-gray-300 font-mono text-lg mt-2">
                        = <strong class="text-primary text-2xl">${decimal}</strong>
                    </p>
                </div>

                <div class="base-box">${decimal}₁₀</div>
            `;
        }

        document.getElementById('step1-base').innerHTML = html;
    }

    // ステップ2: 目的の進数への変換表示
    displayStep2(decimal, base, result) {
        let html = '';

        if (base === 10) {
            html = `
                <p class="text-gray-700 dark:text-gray-300 mb-4">すでに10進数なので変換不要です。</p>
                <div class="base-box">${decimal}₁₀</div>
            `;
        } else {
            // ステップ2-1: 位取り記数法
            html = `
                <div class="mb-8">
                    <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 border-primary">
                        ステップ2-1: 位取り記数法による変換
                    </h4>

                    <p class="text-gray-700 dark:text-gray-300 mb-4">
                        ${decimal}₁₀ を ${base}進数で表すと <strong class="text-primary text-xl">${result}</strong> になります。
                    </p>

                    <!-- 位取り表 -->
                    <div class="overflow-x-auto mb-4">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th class="p-2 text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">桁</th>
                                    ${result.split('').map((_, i) => `
                                        <th class="p-2 text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 font-mono">
                                            ${base}<sup>${result.length - 1 - i}</sup>
                                        </th>
                                    `).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="p-2 text-center font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">重み</td>
                                    ${result.split('').map((_, i) => {
                                        const position = result.length - 1 - i;
                                        const weight = Math.pow(base, position);
                                        return `
                                            <td class="p-2 text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 font-mono font-bold">
                                                ${weight}
                                            </td>
                                        `;
                                    }).join('')}
                                </tr>
                                <tr>
                                    <td class="p-2 text-center font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">値</td>
                                    ${result.split('').map(digit => `
                                        <td class="p-2 text-center border border-gray-300 dark:border-gray-600">
                                            <div class="digit-box">${digit}</div>
                                        </td>
                                    `).join('')}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- 検算 -->
                    <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">検算：</p>
                        <p class="text-gray-700 dark:text-gray-300 font-mono">
                            ${result.split('').map((digit, i) => {
                                const position = result.length - 1 - i;
                                const weight = Math.pow(base, position);
                                return `${digit}×${weight}`;
                            }).join(' + ')}
                        </p>
                        <p class="text-gray-700 dark:text-gray-300 font-mono mt-2">
                            = ${result.split('').map((digit, i) => {
                                const position = result.length - 1 - i;
                                const weight = Math.pow(base, position);
                                const digitValue = parseInt(digit, base);
                                return digitValue * weight;
                            }).join(' + ')}
                        </p>
                        <p class="text-gray-700 dark:text-gray-300 font-mono mt-2">
                            = <strong class="text-primary text-xl">${decimal}</strong>₁₀ ✓
                        </p>
                    </div>
                </div>

                <!-- ステップ2-2: 別解（割り算法） -->
                <div class="mb-6">
                    <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 border-secondary">
                        ステップ2-2: 別解（割り算による変換）
                    </h4>

                    <p class="text-gray-700 dark:text-gray-300 mb-4">
                        10進数を${base}で<strong>割り算</strong>を繰り返し、余りを逆順に並べる方法もあります：
                    </p>
            `;

            // 割り算による変換過程
            let steps = [];
            let current = decimal;

            if (current === 0) {
                steps.push({ quotient: 0, remainder: 0, remainderChar: '0' });
            } else {
                while (current > 0) {
                    const quotient = Math.floor(current / base);
                    const remainder = current % base;
                    const remainderChar = remainder < 10 ? remainder.toString() : String.fromCharCode(65 + remainder - 10);
                    steps.push({
                        dividend: current,
                        quotient: quotient,
                        remainder: remainder,
                        remainderChar: remainderChar
                    });
                    current = quotient;
                }
            }

            html += `
                    <div class="space-y-2 mb-4">
                        ${steps.map((step, i) => `
                            <div class="calculation-step">
                                <span class="text-gray-700 dark:text-gray-300 font-mono">
                                    ${step.dividend} ÷ ${base} = ${step.quotient} 余り
                                    <span class="inline-block px-2 py-1 bg-secondary text-white rounded font-bold">${step.remainderChar}</span>
                                </span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg mb-4">
                        <p class="text-gray-700 dark:text-gray-300 font-semibold mb-2">余りを<strong>下から上</strong>に読みます：</p>
                        <div class="flex items-center space-x-2 flex-wrap">
                            ${steps.reverse().map(s => `<div class="digit-box">${s.remainderChar}</div>`).join('')}
                        </div>
                        <p class="text-gray-700 dark:text-gray-300 mt-3">
                            → 結果: <strong class="text-secondary text-xl">${result}</strong> (${base}進数) ✓
                        </p>
                    </div>
                </div>

                <div class="base-box">${result} (${base}進数)</div>
            `;
        }

        document.getElementById('step2-base').innerHTML = html;
    }

    // 最終結果表示
    displayFinalResult(input, fromBase, result, toBase) {
        const html = `
            <div class="text-center">
                <div class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                    ${input}<sub>${fromBase}</sub> = ${result}<sub>${toBase}</sub>
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                    ${fromBase}進数の「${input}」は、${toBase}進数で「${result}」です
                </p>
            </div>
        `;
        document.getElementById('final-base-result').innerHTML = html;
    }

    // 練習問題の初期化
    initQuiz() {
        // 問題1: 1101₂ → 10進数 = 13
        const checkQ1 = document.getElementById('check-q1');
        if (checkQ1) {
            checkQ1.addEventListener('click', () => {
                const answer = parseInt(document.getElementById('answer-q1').value);
                const correct = 13;
                this.showQuizResult('result-q1', answer, correct,
                    '計算過程: 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13');
            });
        }

        // 問題2: 15₁₀ → 2進数 = 1111
        const checkQ2 = document.getElementById('check-q2');
        if (checkQ2) {
            checkQ2.addEventListener('click', () => {
                const answer = document.getElementById('answer-q2').value.trim();
                const correct = '1111';
                this.showQuizResult('result-q2', answer, correct,
                    '計算過程: 15÷2=7余り1, 7÷2=3余り1, 3÷2=1余り1, 1÷2=0余り1 → 1111');
            });
        }

        // 問題3: 1A₁₆ → 10進数 = 26
        const checkQ3 = document.getElementById('check-q3');
        if (checkQ3) {
            checkQ3.addEventListener('click', () => {
                const answer = parseInt(document.getElementById('answer-q3').value);
                const correct = 26;
                this.showQuizResult('result-q3', answer, correct,
                    '計算過程: 1×16¹ + A×16⁰ = 1×16 + 10×1 = 16 + 10 = 26');
            });
        }
    }

    // 練習問題の結果表示
    showQuizResult(elementId, answer, correct, explanation) {
        const element = document.getElementById(elementId);
        const isCorrect = answer == correct;

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
    new BaseConverter();
});
