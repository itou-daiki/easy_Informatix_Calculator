// 浮動小数点数の実装

class FloatingPointConverter {
    constructor() {
        this.inputValue = '0.1015625';
        this.inputType = 'decimal';
        this.bitFormat = 32;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.convert();
    }

    setupEventListeners() {
        const inputValue = document.getElementById('fp-input');
        const inputType = document.querySelectorAll('input[name="input-type"]');
        const bitFormat = document.getElementById('bit-format');
        const convertBtn = document.getElementById('convert-btn');

        if (inputValue) {
            inputValue.addEventListener('input', (e) => {
                this.inputValue = e.target.value;
            });
        }

        inputType.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.inputType = e.target.value;
                this.updateInputPlaceholder();
            });
        });

        if (bitFormat) {
            bitFormat.addEventListener('change', (e) => {
                this.bitFormat = parseInt(e.target.value);
            });
        }

        if (convertBtn) {
            convertBtn.addEventListener('click', () => {
                this.convert();
            });
        }
    }

    updateInputPlaceholder() {
        const input = document.getElementById('fp-input');
        if (!input) return;

        if (this.inputType === 'decimal') {
            input.placeholder = '例: 0.1015625, 3.14';
            this.inputValue = '0.1015625';
        } else {
            input.placeholder = '例: 0.0001101, 11.01';
            this.inputValue = '0.0001101';
        }
        input.value = this.inputValue;
    }

    convert() {
        try {
            let decimalValue;
            let binaryStr;

            if (this.inputType === 'decimal') {
                decimalValue = parseFloat(this.inputValue);
                if (isNaN(decimalValue)) {
                    throw new Error('有効な数値を入力してください');
                }
                binaryStr = NumberFormatter.decimalToBinaryFraction(decimalValue);
            } else {
                // 2進数入力の検証
                if (!this.inputValue.match(/^[01]+\.[01]+$/)) {
                    throw new Error('有効な2進数形式で入力してください（例: 0.1101）');
                }
                binaryStr = this.inputValue;
                decimalValue = this.binaryToDecimal(this.inputValue);
            }

            if (decimalValue < 0) {
                throw new Error('現在は正の数のみサポートしています');
            }

            if (decimalValue === 0) {
                throw new Error('ゼロの場合は特別な表現になります');
            }

            const result = this.performConversion(decimalValue, binaryStr);
            this.displayResults(result, decimalValue, binaryStr);
        } catch (error) {
            this.displayError(error.message);
        }
    }

    binaryToDecimal(binary) {
        const parts = binary.split('.');
        const intPart = parts[0] || '0';
        const fracPart = parts[1] || '';

        let decimal = 0;

        // 整数部
        for (let i = 0; i < intPart.length; i++) {
            if (intPart[intPart.length - 1 - i] === '1') {
                decimal += Math.pow(2, i);
            }
        }

        // 小数部
        for (let i = 0; i < fracPart.length; i++) {
            if (fracPart[i] === '1') {
                decimal += Math.pow(2, -(i + 1));
            }
        }

        return decimal;
    }

    performConversion(decimalValue, binaryStr) {
        const steps = [];
        const absDecimal = Math.abs(decimalValue);

        // ステップ0: 基数変換（10進数入力の場合のみ）
        if (this.inputType === 'decimal') {
            steps.push({
                title: '⓪ 基数変換',
                content: this.generateBaseConversionContent(decimalValue, binaryStr)
            });
        }

        // ステップ1: 符号部
        const signBit = decimalValue >= 0 ? 0 : 1;
        steps.push({
            title: '➀ 符号部',
            content: `この数値は <strong>${signBit === 0 ? '正' : '負'}</strong> なので、符号ビットは <strong class="text-blue-600 dark:text-blue-400">「${signBit}」</strong> です。`
        });

        // 正規化
        const normalized = this.normalize(binaryStr);

        // ステップ2: 正規化
        steps.push({
            title: '➁ 正規化',
            content: this.generateNormalizationContent(binaryStr, normalized)
        });

        // ステップ3: 指数部
        const bias = this.bitFormat === 32 ? 127 : 1023;
        const exponentBits = this.bitFormat === 32 ? 8 : 11;
        const mantissaBits = this.bitFormat === 32 ? 23 : 52;

        const biasedExponent = normalized.exponent + bias;

        if (biasedExponent < 0 || biasedExponent >= Math.pow(2, exponentBits) - 1) {
            throw new Error(`指数がサポート範囲外です (${biasedExponent})`);
        }

        steps.push({
            title: '➂ 指数部',
            content: this.generateExponentContent(normalized.exponent, bias, biasedExponent, exponentBits)
        });

        // ステップ4: 仮数部
        const mantissaPadded = (normalized.mantissa + '0'.repeat(mantissaBits)).substring(0, mantissaBits);

        steps.push({
            title: '④ 仮数部',
            content: this.generateMantissaContent(normalized.mantissa, mantissaPadded, mantissaBits)
        });

        // 最終結果
        const exponentBinary = biasedExponent.toString(2).padStart(exponentBits, '0');
        const finalBinary = `${signBit} ${exponentBinary} ${mantissaPadded}`;

        // 検証
        const verification = this.verifyConversion(signBit, exponentBinary, mantissaPadded);

        return {
            steps,
            finalBinary,
            verification,
            binaryStr
        };
    }

    normalize(binaryStr) {
        const parts = binaryStr.split('.');
        const intPart = parts[0];
        const fracPart = parts[1] || '';

        let exponent;
        let mantissa;

        // 1以上の場合
        if (intPart !== '0' && intPart.includes('1')) {
            const firstOnePos = intPart.indexOf('1');
            exponent = intPart.length - firstOnePos - 1;
            mantissa = intPart.substring(firstOnePos + 1) + fracPart;
        } else {
            // 1未満の場合
            const firstOnePos = fracPart.indexOf('1');
            if (firstOnePos === -1) {
                throw new Error('有効な2進小数ではありません');
            }
            exponent = -(firstOnePos + 1);
            mantissa = fracPart.substring(firstOnePos + 1);
        }

        return { exponent, mantissa };
    }

    generateBaseConversionContent(decimalValue, binaryStr) {
        const intPart = Math.floor(Math.abs(decimalValue));
        const fracPart = Math.abs(decimalValue) - intPart;

        return `
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">10進数</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">${decimalValue}</p>
                    </div>
                    <div class="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">2進数</p>
                        <p class="text-xl font-mono font-bold text-gray-900 dark:text-white">${binaryStr}</p>
                    </div>
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>整数部:</strong> ${intPart} → ${intPart.toString(2)}</p>
                    <p><strong>小数部:</strong> ${fracPart.toFixed(10)} → 小数部×2を繰り返し計算</p>
                </div>
            </div>
        `;
    }

    generateNormalizationContent(binaryStr, normalized) {
        const direction = normalized.exponent >= 0 ? '右' : '左';
        const expSuper = NumberFormatter.toSuperscript(normalized.exponent);

        return `
            <div class="space-y-4">
                <p class="text-gray-700 dark:text-gray-300">
                    数値を <strong>1.xxxxx</strong> の形に変換
                </p>
                <div class="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 dark:bg-opacity-20 rounded-lg">
                    <p class="font-mono text-lg">
                        <span class="text-gray-600 dark:text-gray-400">${binaryStr}</span>
                        <span class="mx-3">→</span>
                        <span class="text-blue-600 dark:text-blue-400 font-bold">
                            1.${normalized.mantissa} × 2${expSuper}
                        </span>
                    </p>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    小数点を<strong>${direction}</strong>に移動して正規化しました
                </p>
            </div>
        `;
    }

    generateExponentContent(exponent, bias, biasedExponent, exponentBits) {
        const biasFormula = this.bitFormat === 32 ? '2⁷-1' : '2¹⁰-1';
        const precision = this.bitFormat === 32 ? '単' : '倍';

        return `
            <div class="space-y-4">
                <p class="text-gray-700 dark:text-gray-300">
                    <strong>バイアス</strong> を使用して指数を変換
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">バイアス値</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">${bias}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-500">${biasFormula}</p>
                    </div>
                    <div class="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">バイアス付き指数</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">${biasedExponent}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-500">${exponent} + ${bias}</p>
                    </div>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">2進数表現</p>
                    <p class="text-xl font-mono font-bold text-gray-900 dark:text-white">
                        ${biasedExponent.toString(2).padStart(exponentBits, '0')}
                    </p>
                </div>
            </div>
        `;
    }

    generateMantissaContent(mantissa, mantissaPadded, mantissaBits) {
        return `
            <div class="space-y-4">
                <p class="text-gray-700 dark:text-gray-300">
                    正規化した数の <strong>小数部分</strong> を取る
                </p>
                <div class="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">正規化後の小数部</p>
                    <p class="text-xl font-mono font-bold text-gray-900 dark:text-white">
                        1.<span class="text-blue-600 dark:text-blue-400">${mantissa}</span>
                    </p>
                </div>
                <div class="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">仮数部（${mantissaBits}ビット、0で埋める）</p>
                    <p class="text-lg font-mono font-bold text-gray-900 dark:text-white break-all">
                        ${mantissaPadded}
                    </p>
                </div>
            </div>
        `;
    }

    verifyConversion(signBit, exponentBinary, mantissa) {
        const exponent = parseInt(exponentBinary, 2);
        const bias = this.bitFormat === 32 ? 127 : 1023;

        // 仮数部の値を計算
        let mantissaValue = 1.0;
        for (let i = 0; i < mantissa.length; i++) {
            if (mantissa[i] === '1') {
                mantissaValue += Math.pow(2, -(i + 1));
            }
        }

        // 最終的な値を計算
        const sign = signBit === 0 ? 1 : -1;
        const value = sign * mantissaValue * Math.pow(2, exponent - bias);

        return {
            convertedValue: value,
            originalValue: parseFloat(this.inputValue)
        };
    }

    displayResults(result, decimalValue, binaryStr) {
        const resultsDiv = document.getElementById('conversion-results');
        if (!resultsDiv) return;

        resultsDiv.classList.remove('hidden');

        // 2進数表示（10進数入力の場合のみ）
        if (this.inputType === 'decimal') {
            const binaryInfoDiv = document.getElementById('binary-info');
            if (binaryInfoDiv) {
                binaryInfoDiv.innerHTML = `
                    <div class="alert alert-info mb-6">
                        <p class="font-semibold mb-2">📌 2進数表現</p>
                        <p class="text-lg font-mono">${binaryStr}</p>
                    </div>
                `;
                binaryInfoDiv.classList.remove('hidden');
            }
        }

        // ステップ表示
        const stepsDiv = document.getElementById('conversion-steps');
        if (stepsDiv) {
            stepsDiv.innerHTML = result.steps.map((step, index) => `
                <div class="p-6 ${this.getStepBgClass(index)} rounded-xl animate-fadeIn" style="animation-delay: ${index * 0.1}s;">
                    <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                        ${step.title}
                    </h3>
                    <div>${step.content}</div>
                </div>
            `).join('');
        }

        // 最終結果
        const finalResultDiv = document.getElementById('final-result');
        if (finalResultDiv) {
            const formatName = this.bitFormat === 32 ? '単精度浮動小数点' : '倍精度浮動小数点';
            finalResultDiv.innerHTML = `
                <div class="p-6 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl animate-fadeIn">
                    <p class="text-sm mb-2 opacity-90">${formatName}：${this.bitFormat}ビット（IEEE 754形式）</p>
                    <p class="text-2xl font-mono font-bold break-all">
                        ${result.finalBinary}
                    </p>
                </div>
            `;
        }

        // 検証
        const verificationDiv = document.getElementById('verification');
        if (verificationDiv && result.verification) {
            const v = result.verification;
            const error = Math.abs(v.originalValue - v.convertedValue);
            verificationDiv.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">元の値</p>
                        <p class="text-xl font-bold text-gray-900 dark:text-white">${v.originalValue.toFixed(10)}</p>
                    </div>
                    <div class="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">変換後の値</p>
                        <p class="text-xl font-bold text-gray-900 dark:text-white">${v.convertedValue.toFixed(10)}</p>
                    </div>
                    <div class="p-4 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">誤差</p>
                        <p class="text-xl font-bold text-gray-900 dark:text-white">${error.toExponential(2)}</p>
                    </div>
                </div>
            `;
        }

        NotificationManager.show('変換が完了しました', 'success');
    }

    displayError(message) {
        const resultsDiv = document.getElementById('conversion-results');
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="alert alert-error animate-fadeIn">
                    <p class="font-semibold">エラー</p>
                    <p class="text-sm mt-1">${message}</p>
                </div>
            `;
            resultsDiv.classList.remove('hidden');
        }
        NotificationManager.show(message, 'error');
    }

    getStepBgClass(index) {
        const colors = [
            'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 dark:bg-opacity-30',
            'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 dark:bg-opacity-30',
            'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 dark:bg-opacity-30',
            'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 dark:bg-opacity-30',
            'bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900 dark:to-pink-800 dark:bg-opacity-30'
        ];
        return colors[index % colors.length];
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('fp-input')) {
        window.floatingPointConverter = new FloatingPointConverter();
    }

    // タブマネージャーの初期化
    if (document.getElementById('floating-tabs')) {
        new TabManager('floating-tabs');
    }
});
