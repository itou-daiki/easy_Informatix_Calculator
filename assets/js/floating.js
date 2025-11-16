// 浮動小数点数の実装（16bit/32bit/64bit対応、負の数対応）

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
            input.placeholder = '例: 0.1015625, -3.14, 2.5';
            this.inputValue = '0.1015625';
        } else {
            input.placeholder = '例: 0.0001101, 11.01';
            this.inputValue = '0.0001101';
        }
        input.value = this.inputValue;
    }

    getFormatSpec(bitFormat) {
        const specs = {
            16: { exponentBits: 5, mantissaBits: 10, bias: 15, name: '半精度' },
            32: { exponentBits: 8, mantissaBits: 23, bias: 127, name: '単精度' },
            64: { exponentBits: 11, mantissaBits: 52, bias: 1023, name: '倍精度' }
        };
        return specs[bitFormat];
    }

    convert() {
        try {
            let decimalValue;
            let binaryStr;
            const originalValue = this.inputValue;

            if (this.inputType === 'decimal') {
                decimalValue = parseFloat(this.inputValue);
                if (isNaN(decimalValue)) {
                    throw new Error('有効な数値を入力してください');
                }
                binaryStr = NumberFormatter.decimalToBinaryFraction(Math.abs(decimalValue));
            } else {
                // 2進数入力の検証（負の数は非対応）
                if (!this.inputValue.match(/^[01]+\.[01]+$/)) {
                    throw new Error('有効な2進数形式で入力してください（例: 0.1101）');
                }
                binaryStr = this.inputValue;
                decimalValue = this.binaryToDecimal(this.inputValue);
            }

            if (decimalValue === 0) {
                this.displayZeroCase();
                return;
            }

            const result = this.performConversion(decimalValue, binaryStr, originalValue);
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

    performConversion(decimalValue, binaryStr, originalValue) {
        const steps = [];
        const absDecimal = Math.abs(decimalValue);
        const isNegative = decimalValue < 0;
        const spec = this.getFormatSpec(this.bitFormat);

        // ステップ0: 基数変換（10進数入力の場合のみ）
        if (this.inputType === 'decimal') {
            steps.push({
                title: '⓪ 基数変換（10進数 → 2進数）',
                content: this.generateBaseConversionContent(decimalValue, binaryStr),
                explanation: `
                    <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                        <h4 class="font-semibold mb-2">💡 なぜ2進数に変換するのか？</h4>
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                            コンピュータは内部で2進数（0と1）しか扱えません。そのため、10進数を2進数に変換する必要があります。
                            整数部は2で割り続け、小数部は2を掛け続けることで変換できます。
                        </p>
                    </div>
                `
            });
        }

        // ステップ1: 符号部
        const signBit = isNegative ? 1 : 0;
        steps.push({
            title: '➀ 符号部の決定',
            content: `
                <div class="space-y-4">
                    <p class="text-gray-700 dark:text-gray-300">
                        元の値: <strong class="text-2xl">${originalValue}</strong>
                    </p>
                    <div class="p-4 ${isNegative ? 'bg-red-50 dark:bg-red-900' : 'bg-green-50 dark:bg-green-900'} dark:bg-opacity-20 rounded-lg">
                        <p class="text-lg">
                            この数値は <strong class="text-2xl">${isNegative ? '負' : '正'}</strong> なので、
                            符号ビットは <strong class="text-3xl text-blue-600 dark:text-blue-400">「${signBit}」</strong>
                        </p>
                    </div>
                </div>
            `,
            explanation: `
                <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                    <h4 class="font-semibold mb-2">💡 符号ビットの役割</h4>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        符号ビットは数値の正負を表す最も重要なビットです：
                    </p>
                    <ul class="text-sm text-gray-700 dark:text-gray-300 ml-4 space-y-1">
                        <li>• <strong>0</strong> → 正の数（0を含む）</li>
                        <li>• <strong>1</strong> → 負の数</li>
                        <li>• 符号ビットは常に<strong>最上位ビット（左端）</strong>に配置されます</li>
                    </ul>
                </div>
            `
        });

        // 正規化
        const normalized = this.normalize(binaryStr);

        // ステップ2: 正規化
        steps.push({
            title: '➁ 正規化（1.xxxxx × 2ⁿの形に変換）',
            content: this.generateNormalizationContent(binaryStr, normalized, absDecimal),
            explanation: `
                <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                    <h4 class="font-semibold mb-2">💡 正規化とは？</h4>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        正規化は、どんな2進数でも <strong>1.xxxxx × 2ⁿ</strong> の形に統一する処理です。
                    </p>
                    <ul class="text-sm text-gray-700 dark:text-gray-300 ml-4 space-y-1">
                        <li>• 小数点の位置を調整して、必ず「1.」で始まるようにします</li>
                        <li>• 移動した桁数が指数（n）になります</li>
                        <li>• ${normalized.exponent >= 0 ? '大きい数' : '小さい数'}の場合、指数は${normalized.exponent >= 0 ? '正' : '負'}になります</li>
                        <li>• この統一形式により、効率的に数値を保存できます</li>
                    </ul>
                </div>
            `
        });

        // ステップ3: 指数部
        const biasedExponent = normalized.exponent + spec.bias;

        if (biasedExponent < 0 || biasedExponent >= Math.pow(2, spec.exponentBits) - 1) {
            throw new Error(`指数がサポート範囲外です (${biasedExponent})`);
        }

        steps.push({
            title: '➂ 指数部の計算（バイアス表現）',
            content: this.generateExponentContent(normalized.exponent, spec, biasedExponent),
            explanation: `
                <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                    <h4 class="font-semibold mb-2">💡 なぜバイアスを使うのか？</h4>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        指数は正の数にも負の数にもなりますが、コンピュータで負の数を扱うのは複雑です。
                        そこで「バイアス」という固定値を足すことで、すべて正の数として扱えるようにします。
                    </p>
                    <ul class="text-sm text-gray-700 dark:text-gray-300 ml-4 space-y-1">
                        <li>• ${this.bitFormat}bitのバイアスは <strong>${spec.bias}</strong> です</li>
                        <li>• 実際の指数 ${normalized.exponent} に ${spec.bias} を足すと ${biasedExponent} になります</li>
                        <li>• これで負の指数も正の数として表現できます</li>
                        <li>• 使用時は逆に ${spec.bias} を引き算して元の指数を得ます</li>
                    </ul>
                </div>
            `
        });

        // ステップ4: 仮数部
        const mantissaPadded = (normalized.mantissa + '0'.repeat(spec.mantissaBits)).substring(0, spec.mantissaBits);

        steps.push({
            title: '④ 仮数部の構築',
            content: this.generateMantissaContent(normalized.mantissa, mantissaPadded, spec),
            explanation: `
                <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                    <h4 class="font-semibold mb-2">💡 仮数部の「暗黙の1」とは？</h4>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        正規化すると必ず「1.xxxxx」の形になります。つまり、小数点の左側は<strong>必ず1</strong>です。
                    </p>
                    <ul class="text-sm text-gray-700 dark:text-gray-300 ml-4 space-y-1">
                        <li>• この「1」は常に同じなので、<strong>保存する必要がありません</strong></li>
                        <li>• 小数点以下の部分（xxxxx）だけを仮数部として保存します</li>
                        <li>• これにより1ビット分のスペースを節約できます</li>
                        <li>• ${spec.mantissaBits}ビットで実質${spec.mantissaBits + 1}ビット分の精度を実現！</li>
                    </ul>
                </div>
            `
        });

        // 最終結果
        const exponentBinary = biasedExponent.toString(2).padStart(spec.exponentBits, '0');
        const finalBinary = `${signBit} ${exponentBinary} ${mantissaPadded}`;

        // 検証
        const verification = this.verifyConversion(signBit, exponentBinary, mantissaPadded, spec);

        return {
            steps,
            finalBinary,
            verification,
            binaryStr,
            signBit,
            exponentBinary,
            mantissaPadded,
            spec
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
        const sign = decimalValue < 0 ? '-' : '';

        return `
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">10進数</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">${decimalValue}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            ${sign !== '' ? '符号: ' + sign + ' ' : ''}整数部: ${intPart}, 小数部: ${fracPart.toFixed(10)}
                        </p>
                    </div>
                    <div class="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">2進数（絶対値）</p>
                        <p class="text-xl font-mono font-bold text-gray-900 dark:text-white break-all">${binaryStr}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            符号は別途、符号ビットで表現
                        </p>
                    </div>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">変換手順:</p>
                    <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>① 整数部 ${intPart} → 2進数: ${intPart.toString(2)}</p>
                        <p>② 小数部 ${fracPart.toFixed(6)} → 2進数: ${binaryStr.split('.')[1]}</p>
                        <p>③ 結合: ${binaryStr}</p>
                    </div>
                </div>
            </div>
        `;
    }

    generateNormalizationContent(binaryStr, normalized, absDecimal) {
        const direction = normalized.exponent >= 0 ? '右' : '左';
        const shiftAmount = Math.abs(normalized.exponent);
        const expSuper = NumberFormatter.toSuperscript(normalized.exponent);

        return `
            <div class="space-y-4">
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">元の2進数</p>
                    <p class="text-xl font-mono font-bold text-gray-900 dark:text-white">${binaryStr}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">= ${absDecimal}</p>
                </div>

                <div class="flex items-center justify-center">
                    <div class="text-center">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">小数点を${direction}に${shiftAmount}桁移動</p>
                        <div class="text-4xl">${normalized.exponent >= 0 ? '➡️' : '⬅️'}</div>
                    </div>
                </div>

                <div class="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 dark:bg-opacity-20 rounded-lg">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">正規化後</p>
                    <p class="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                        1.${normalized.mantissa} × 2${expSuper}
                    </p>
                    <div class="mt-3 text-sm text-gray-700 dark:text-gray-300">
                        <p>• 仮数: <span class="font-mono">1.${normalized.mantissa}</span></p>
                        <p>• 指数: ${normalized.exponent}</p>
                    </div>
                </div>
            </div>
        `;
    }

    generateExponentContent(exponent, spec, biasedExponent) {
        const biasFormula = spec.bias === 15 ? '2⁴-1' : spec.bias === 127 ? '2⁷-1' : '2¹⁰-1';

        return `
            <div class="space-y-4">
                <div class="p-4 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 rounded-lg">
                    <h4 class="font-semibold mb-3 text-gray-900 dark:text-white">計算手順</h4>
                    <div class="space-y-2 text-gray-700 dark:text-gray-300">
                        <p>① 実際の指数: <strong class="text-xl">${exponent}</strong></p>
                        <p>② ${spec.name}浮動小数点数（${this.bitFormat}bit）のバイアス: <strong class="text-xl">${spec.bias}</strong></p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 ml-4">※ ${biasFormula} = ${spec.bias}</p>
                        <p>③ バイアス付き指数 = ${exponent} + ${spec.bias} = <strong class="text-2xl text-blue-600 dark:text-blue-400">${biasedExponent}</strong></p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">10進数表現</p>
                        <p class="text-3xl font-bold text-gray-900 dark:text-white">${biasedExponent}</p>
                    </div>
                    <div class="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">2進数表現（${spec.exponentBits}ビット）</p>
                        <p class="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                            ${biasedExponent.toString(2).padStart(spec.exponentBits, '0')}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    generateMantissaContent(mantissa, mantissaPadded, spec) {
        const displayMantissa = mantissa || '0';

        return `
            <div class="space-y-4">
                <div class="p-4 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg">
                    <h4 class="font-semibold mb-3 text-gray-900 dark:text-white">仮数部の抽出</h4>
                    <p class="text-lg text-gray-700 dark:text-gray-300 mb-2">
                        正規化した形: <span class="font-mono text-xl">1.${displayMantissa}</span>
                    </p>
                    <p class="text-gray-700 dark:text-gray-300">
                        → 小数点以下の部分: <span class="font-mono text-xl text-blue-600 dark:text-blue-400">${displayMantissa}</span>
                    </p>
                </div>

                <div class="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        仮数部（${spec.mantissaBits}ビット、不足分は0で埋める）
                    </p>
                    <p class="text-lg font-mono font-bold text-gray-900 dark:text-white break-all">
                        ${mantissaPadded}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        元のビット数: ${displayMantissa.length}、追加した0: ${spec.mantissaBits - displayMantissa.length}個
                    </p>
                </div>
            </div>
        `;
    }

    verifyConversion(signBit, exponentBinary, mantissa, spec) {
        const exponent = parseInt(exponentBinary, 2);

        // 仮数部の値を計算
        let mantissaValue = 1.0;
        for (let i = 0; i < mantissa.length; i++) {
            if (mantissa[i] === '1') {
                mantissaValue += Math.pow(2, -(i + 1));
            }
        }

        // 最終的な値を計算
        const sign = signBit === 0 ? 1 : -1;
        const value = sign * mantissaValue * Math.pow(2, exponent - spec.bias);

        return {
            convertedValue: value,
            originalValue: parseFloat(this.inputValue)
        };
    }

    displayZeroCase() {
        const resultsDiv = document.getElementById('conversion-results');
        if (!resultsDiv) return;

        resultsDiv.innerHTML = `
            <div class="card animate-fadeIn">
                <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">ゼロの特殊表現</h3>
                <div class="space-y-4">
                    <div class="alert alert-info">
                        <p class="font-semibold mb-2">💡 ゼロは特別な値です</p>
                        <p class="text-sm">IEEE 754では、ゼロは全ビットを0にすることで表現されます。</p>
                    </div>
                    <div class="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 dark:bg-opacity-20 rounded-xl">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${this.bitFormat}bit表現</p>
                        <p class="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                            ${'0'.repeat(this.bitFormat)}
                        </p>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        ※ +0と-0が存在しますが、通常は区別されません
                    </p>
                </div>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
    }

    displayResults(result, decimalValue, binaryStr) {
        const resultsDiv = document.getElementById('conversion-results');
        if (!resultsDiv) return;

        resultsDiv.classList.remove('hidden');

        // 2進数表示（10進数入力の場合のみ）
        if (this.inputType === 'decimal') {
            const binaryInfoDiv = document.getElementById('binary-info');
            if (binaryInfoDiv) {
                const sign = decimalValue < 0 ? '-' : '';
                binaryInfoDiv.innerHTML = `
                    <div class="alert alert-info mb-6">
                        <p class="font-semibold mb-2">📌 2進数表現</p>
                        <p class="text-lg font-mono">${sign}${binaryStr}</p>
                        <p class="text-sm mt-1 text-gray-600 dark:text-gray-400">
                            符号は符号ビットで表現されるため、ここでは絶対値のみを表示しています
                        </p>
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
                    ${step.explanation || ''}
                </div>
            `).join('');
        }

        // 最終結果
        const finalResultDiv = document.getElementById('final-result');
        if (finalResultDiv) {
            finalResultDiv.innerHTML = `
                <div class="space-y-4">
                    <div class="p-6 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl animate-fadeIn">
                        <p class="text-sm mb-2 opacity-90">${result.spec.name}浮動小数点数：${this.bitFormat}ビット（IEEE 754形式）</p>
                        <p class="text-2xl font-mono font-bold break-all mb-4">
                            ${result.finalBinary}
                        </p>
                        <div class="grid grid-cols-3 gap-2 text-xs opacity-90">
                            <div class="text-center">
                                <p>符号部(1bit)</p>
                                <p class="font-mono text-lg">${result.signBit}</p>
                            </div>
                            <div class="text-center">
                                <p>指数部(${result.spec.exponentBits}bit)</p>
                                <p class="font-mono text-lg">${result.exponentBinary}</p>
                            </div>
                            <div class="text-center">
                                <p>仮数部(${result.spec.mantissaBits}bit)</p>
                                <p class="font-mono text-sm">${result.mantissaPadded.substring(0, 8)}...</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                        <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">💡 各部分の意味</h4>
                        <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                            <li>• <strong>符号部</strong>: ${result.signBit === 0 ? '正の数' : '負の数'}を表す</li>
                            <li>• <strong>指数部</strong>: 数の大きさ（スケール）を表す</li>
                            <li>• <strong>仮数部</strong>: 数の精度（詳細な値）を表す</li>
                        </ul>
                    </div>
                </div>
            `;
        }

        // 検証
        const verificationDiv = document.getElementById('verification');
        if (verificationDiv && result.verification) {
            const v = result.verification;
            const error = Math.abs(v.originalValue - v.convertedValue);
            const errorPercent = v.originalValue !== 0 ? (error / Math.abs(v.originalValue) * 100).toFixed(10) : 0;

            verificationDiv.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                        <p class="text-xs text-gray-500 dark:text-gray-500">(${errorPercent}%)</p>
                    </div>
                </div>
                <div class="p-4 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 rounded-lg">
                    <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">💡 誤差が生じる理由</h4>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                        浮動小数点数は限られたビット数で表現するため、すべての実数を正確に表現できるわけではありません。
                        特に、10進数で割り切れる数（例：0.1）が2進数では無限小数になることがあり、わずかな誤差が生じます。
                        ${this.bitFormat}bitでは仮数部が${result.spec.mantissaBits}ビットなので、その精度で表現可能な範囲内での近似値となります。
                    </p>
                </div>
            `;
        }

        NotificationManager.show('変換が完了しました！', 'success');
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
