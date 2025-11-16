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
            let calculations = [];
            let sum = 0;

            digits.forEach((digit, index) => {
                const digitValue = parseInt(digit, base);
                const positionValue = Math.pow(base, index);
                const contribution = digitValue * positionValue;
                sum += contribution;

                calculations.push({
                    digit: digit,
                    value: digitValue,
                    position: index,
                    base: base,
                    positionValue: positionValue,
                    contribution: contribution
                });
            });

            html = `
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>位取り記数法</strong>を使って各桁の値を計算します：
                </p>
                <div class="space-y-2 mb-4">
                    ${calculations.reverse().map((calc, i) => `
                        <div class="calculation-step">
                            <div class="flex items-center space-x-2">
                                <div class="digit-box">${calc.digit}</div>
                                <span class="text-gray-700 dark:text-gray-300">×</span>
                                <span class="text-gray-700 dark:text-gray-300 font-mono">
                                    ${base}<sup>${calc.position}</sup> = ${calc.digit} × ${calc.positionValue} = ${calc.contribution}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg mb-4">
                    <p class="text-gray-700 dark:text-gray-300 font-mono">
                        ${calculations.reverse().map(c => c.contribution).join(' + ')} = ${sum}
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
            // 割り算による変換過程
            let steps = [];
            let current = decimal;

            if (current === 0) {
                steps.push({ quotient: 0, remainder: 0 });
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

            html = `
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    10進数を${base}で<strong>割り算</strong>を繰り返し、余りを逆順に並べます：
                </p>
                <div class="space-y-2 mb-4">
                    ${steps.map((step, i) => `
                        <div class="calculation-step">
                            <span class="text-gray-700 dark:text-gray-300 font-mono">
                                ${step.dividend} ÷ ${base} = ${step.quotient} 余り
                                <span class="inline-block px-2 py-1 bg-primary text-white rounded font-bold">${step.remainderChar}</span>
                            </span>
                        </div>
                    `).join('')}
                </div>
                <div class="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg mb-4">
                    <p class="text-gray-700 dark:text-gray-300 font-semibold mb-2">余りを<strong>下から上</strong>に読みます：</p>
                    <div class="flex items-center space-x-2 flex-wrap">
                        ${steps.reverse().map(s => `<div class="digit-box">${s.remainderChar}</div>`).join('')}
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
