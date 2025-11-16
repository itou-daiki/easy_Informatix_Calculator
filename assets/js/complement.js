// 2の補数学習アプリ

class ComplementCalculator {
    constructor() {
        this.init();
    }

    init() {
        // 10進数→2の補数
        const toComplementBtn = document.getElementById('to-complement-btn');
        if (toComplementBtn) {
            toComplementBtn.addEventListener('click', () => this.toComplement());
        }

        // 2の補数→10進数
        const toDecimalBtn = document.getElementById('to-decimal-btn');
        if (toDecimalBtn) {
            toDecimalBtn.addEventListener('click', () => this.toDecimal());
        }

        // 加減算
        const calcBtn = document.getElementById('calc-complement-btn');
        if (calcBtn) {
            calcBtn.addEventListener('click', () => this.calculate());
        }

        // 練習問題
        this.initQuiz();
    }

    // 10進数を2の補数に変換
    decimalToComplement(decimal, bits) {
        if (decimal >= 0) {
            // 正の数はそのまま2進数に
            return decimal.toString(2).padStart(bits, '0');
        } else {
            // 負の数は2の補数表現
            const max = Math.pow(2, bits);
            const complement = max + decimal; // 例: 256 + (-5) = 251
            return complement.toString(2).padStart(bits, '0');
        }
    }

    // 2の補数を10進数に変換
    complementToDecimal(binary) {
        const bits = binary.length;
        const msb = binary[0];

        if (msb === '0') {
            // 正の数
            return parseInt(binary, 2);
        } else {
            // 負の数
            const max = Math.pow(2, bits);
            const value = parseInt(binary, 2);
            return value - max;
        }
    }

    // 1の補数を求める（ビット反転）
    getOnesComplement(binary) {
        return binary.split('').map(bit => bit === '0' ? '1' : '0').join('');
    }

    // 2進数に1を加算
    addOne(binary) {
        let result = '';
        let carry = 1;

        for (let i = binary.length - 1; i >= 0; i--) {
            const bit = parseInt(binary[i]);
            const sum = bit + carry;
            result = (sum % 2) + result;
            carry = Math.floor(sum / 2);
        }

        return result;
    }

    // 10進数→2の補数変換
    toComplement() {
        const decimal = parseInt(document.getElementById('decimal-input').value);
        const bits = parseInt(document.getElementById('bit-length').value);

        const min = -(Math.pow(2, bits - 1));
        const max = Math.pow(2, bits - 1) - 1;

        if (isNaN(decimal)) {
            alert('数値を入力してください');
            return;
        }

        if (decimal < min || decimal > max) {
            alert(`${bits}ビットの範囲（${min} ～ ${max}）で入力してください`);
            return;
        }

        const result = this.decimalToComplement(decimal, bits);
        this.displayComplementResult(decimal, result, bits);
    }

    // 2の補数→10進数変換
    toDecimal() {
        const binary = document.getElementById('binary-input').value.trim();

        if (!binary) {
            alert('2進数を入力してください');
            return;
        }

        if (!/^[01]+$/.test(binary)) {
            alert('0と1のみで入力してください');
            return;
        }

        const decimal = this.complementToDecimal(binary);
        this.displayDecimalResult(binary, decimal);
    }

    // 加減算
    calculate() {
        const a = parseInt(document.getElementById('calc-a').value);
        const b = parseInt(document.getElementById('calc-b').value);
        const op = document.getElementById('calc-op').value;

        if (isNaN(a) || isNaN(b)) {
            alert('数値を入力してください');
            return;
        }

        const bits = 8;
        const min = -128;
        const max = 127;

        if (a < min || a > max || b < min || b > max) {
            alert(`8ビットの範囲（-128 ～ 127）で入力してください`);
            return;
        }

        const binaryA = this.decimalToComplement(a, bits);
        const binaryB = this.decimalToComplement(b, bits);

        let result;
        let binaryResult;

        if (op === 'add') {
            result = a + b;
            // 2進数加算
            binaryResult = this.addBinary(binaryA, binaryB, bits);
        } else {
            result = a - b;
            // A - B = A + (-B)
            const negB = this.decimalToComplement(-b, bits);
            binaryResult = this.addBinary(binaryA, negB, bits);
        }

        // オーバーフローチェック
        if (result < min || result > max) {
            this.displayCalculationResult(a, b, op, binaryA, binaryB, binaryResult, result, true);
        } else {
            this.displayCalculationResult(a, b, op, binaryA, binaryB, binaryResult, result, false);
        }
    }

    // 2進数加算
    addBinary(a, b, bits) {
        let result = '';
        let carry = 0;

        for (let i = bits - 1; i >= 0; i--) {
            const bitA = parseInt(a[i]);
            const bitB = parseInt(b[i]);
            const sum = bitA + bitB + carry;
            result = (sum % 2) + result;
            carry = Math.floor(sum / 2);
        }

        return result;
    }

    // 2の補数変換結果表示
    displayComplementResult(decimal, binary, bits) {
        document.getElementById('complement-result').classList.remove('hidden');

        let stepsHtml = '';

        if (decimal >= 0) {
            stepsHtml = `
                <div class="step-card">
                    <p class="mb-3 text-gray-700 dark:text-gray-300">
                        <strong>${decimal}</strong> は正の数なので、そのまま${bits}ビットの2進数に変換します。
                    </p>
                    <div class="code-block">
${decimal}₁₀ = ${binary}₂
                    </div>
                </div>
            `;
        } else {
            // 負の数の場合はステップを表示
            const positive = Math.abs(decimal);
            const positiveBinary = positive.toString(2).padStart(bits, '0');
            const onesComp = this.getOnesComplement(positiveBinary);
            const twosComp = this.addOne(onesComp);

            stepsHtml = `
                <div class="space-y-4">
                    <div class="step-card">
                        <h4 class="font-bold mb-2 text-gray-900 dark:text-white">ステップ1: 絶対値を2進数に変換</h4>
                        <div class="code-block">
${positive}₁₀ = ${positiveBinary}₂
                        </div>
                    </div>

                    <div class="step-card">
                        <h4 class="font-bold mb-2 text-gray-900 dark:text-white">ステップ2: ビット反転（1の補数）</h4>
                        <div class="code-block">
${positiveBinary} → ${onesComp}
                        </div>
                    </div>

                    <div class="step-card">
                        <h4 class="font-bold mb-2 text-gray-900 dark:text-white">ステップ3: 1を加算（2の補数）</h4>
                        <div class="code-block">
  ${onesComp}<br>
+ 00000001<br>
= ${twosComp}
                        </div>
                    </div>
                </div>
            `;
        }

        const html = `
            <div class="text-center mb-6">
                <div class="text-3xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                    ${decimal}₁₀ = ${binary}₂
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                    ${bits}ビット2の補数表現
                </p>
            </div>
            ${stepsHtml}
        `;

        document.getElementById('complement-result').innerHTML = html;
    }

    // 10進数変換結果表示
    displayDecimalResult(binary, decimal) {
        document.getElementById('decimal-result').classList.remove('hidden');

        const isNegative = binary[0] === '1';
        let stepsHtml = '';

        if (!isNegative) {
            stepsHtml = `
                <div class="step-card">
                    <p class="mb-3 text-gray-700 dark:text-gray-300">
                        最上位ビットが <strong>0</strong> なので正の数です。そのまま2進数として変換します。
                    </p>
                    <div class="code-block">
${binary}₂ = ${decimal}₁₀
                    </div>
                </div>
            `;
        } else {
            // 負の数の場合
            const onesComp = this.getOnesComplement(binary);
            const temp = this.addOne(onesComp);
            const positive = parseInt(temp, 2);

            stepsHtml = `
                <div class="space-y-4">
                    <div class="step-card">
                        <h4 class="font-bold mb-2 text-gray-900 dark:text-white">ステップ1: 最上位ビットが1なので負の数</h4>
                        <p class="text-gray-700 dark:text-gray-300">2の補数から元の値を求めます。</p>
                    </div>

                    <div class="step-card">
                        <h4 class="font-bold mb-2 text-gray-900 dark:text-white">ステップ2: ビット反転</h4>
                        <div class="code-block">
${binary} → ${onesComp}
                        </div>
                    </div>

                    <div class="step-card">
                        <h4 class="font-bold mb-2 text-gray-900 dark:text-white">ステップ3: 1を加算</h4>
                        <div class="code-block">
  ${onesComp}<br>
+ ${'1'.padStart(binary.length, '0')}<br>
= ${temp}
                        </div>
                    </div>

                    <div class="step-card">
                        <h4 class="font-bold mb-2 text-gray-900 dark:text-white">ステップ4: 負の符号をつける</h4>
                        <div class="code-block">
${temp}₂ = ${positive}₁₀<br>
負の数なので → -${positive} = ${decimal}
                        </div>
                    </div>
                </div>
            `;
        }

        const html = `
            <div class="text-center mb-6">
                <div class="text-3xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                    ${binary}₂ = ${decimal}₁₀
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                    ${binary.length}ビット2の補数表現
                </p>
            </div>
            ${stepsHtml}
        `;

        document.getElementById('decimal-result').innerHTML = html;
    }

    // 計算結果表示
    displayCalculationResult(a, b, op, binaryA, binaryB, binaryResult, result, overflow) {
        document.getElementById('calc-complement-result').classList.remove('hidden');

        const opSymbol = op === 'add' ? '+' : '-';
        const opName = op === 'add' ? '加算' : '減算';

        let processHtml = '';
        if (op === 'sub') {
            const negB = this.decimalToComplement(-b, 8);
            processHtml = `
                <div class="step-card mb-4">
                    <h4 class="font-bold mb-2 text-gray-900 dark:text-white">減算は加算に変換</h4>
                    <p class="text-gray-700 dark:text-gray-300 mb-2">
                        ${a} - ${b} = ${a} + (-${b})
                    </p>
                    <div class="code-block">
-${b}の2の補数: ${negB}
                    </div>
                </div>
            `;
        }

        const html = `
            <div class="space-y-4">
                <div class="text-center mb-6">
                    <div class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        ${a} ${opSymbol} ${b} = ${result}
                    </div>
                    ${overflow ? '<p class="text-red-600 font-bold">⚠️ オーバーフロー発生</p>' : ''}
                </div>

                ${processHtml}

                <div class="step-card">
                    <h4 class="font-bold mb-3 text-gray-900 dark:text-white">2進数での${opName}</h4>
                    <div class="code-block text-right">
  ${binaryA} (${a})<br>
${op === 'add' ? '+' : '+'} ${op === 'sub' ? this.decimalToComplement(-b, 8) : binaryB} (${op === 'sub' ? -b : b})<br>
= ${binaryResult}
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4 text-center">
                    <div class="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">値A</p>
                        <p class="font-mono font-bold text-gray-900 dark:text-white">${binaryA}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">(${a})</p>
                    </div>
                    <div class="p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">値B</p>
                        <p class="font-mono font-bold text-gray-900 dark:text-white">${binaryB}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">(${b})</p>
                    </div>
                    <div class="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">結果</p>
                        <p class="font-mono font-bold text-gray-900 dark:text-white">${binaryResult}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">(${overflow ? 'オーバーフロー' : result})</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('calc-complement-result').innerHTML = html;
    }

    // 練習問題の初期化
    initQuiz() {
        // 問題1: -7 = 11111001
        const checkQ1 = document.getElementById('check-q1');
        if (checkQ1) {
            checkQ1.addEventListener('click', () => {
                const answer = document.getElementById('answer-q1').value.trim();
                const correct = '11111001';
                this.showQuizResult('result-q1', answer, correct,
                    '7の2進数: 00000111 → 反転: 11111000 → +1: 11111001');
            });
        }

        // 問題2: 11111101 = -3
        const checkQ2 = document.getElementById('check-q2');
        if (checkQ2) {
            checkQ2.addEventListener('click', () => {
                const answer = parseInt(document.getElementById('answer-q2').value);
                const correct = -3;
                this.showQuizResult('result-q2', answer, correct,
                    'MSBが1なので負の数。反転: 00000010 → +1: 00000011 = 3 → -3');
            });
        }

        // 問題3: 00000101 + 11111100 = 00000001 (5 + (-4) = 1)
        const checkQ3 = document.getElementById('check-q3');
        if (checkQ3) {
            checkQ3.addEventListener('click', () => {
                const answer = document.getElementById('answer-q3').value.trim();
                const correct = '00000001';
                this.showQuizResult('result-q3', answer, correct,
                    '00000101(5) + 11111100(-4) = 00000001(1)。桁上がりは無視。');
            });
        }

        // 問題4: 10 - 15 = -5 = 11111011
        const checkQ4 = document.getElementById('check-q4');
        if (checkQ4) {
            checkQ4.addEventListener('click', () => {
                const answer = document.getElementById('answer-q4').value.trim();
                const correct = '11111011';
                this.showQuizResult('result-q4', answer, correct,
                    '10 - 15 = -5。5の2進数: 00000101 → 反転: 11111010 → +1: 11111011');
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
    new ComplementCalculator();
});
