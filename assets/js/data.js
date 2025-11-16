// データ量学習アプリ

class DataSizeCalculator {
    constructor() {
        this.units = {
            bit: 1,
            byte: 8,
            kb: 8 * 1024,
            mb: 8 * 1024 * 1024,
            gb: 8 * 1024 * 1024 * 1024,
            tb: 8 * 1024 * 1024 * 1024 * 1024
        };

        this.unitNames = {
            bit: 'bit',
            byte: 'Byte',
            kb: 'KB',
            mb: 'MB',
            gb: 'GB',
            tb: 'TB'
        };

        this.init();
    }

    init() {
        // 単位変換
        const convertBtn = document.getElementById('convert-unit-btn');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.convertUnit());
        }

        // 画像計算
        const calcImageBtn = document.getElementById('calc-image-btn');
        if (calcImageBtn) {
            calcImageBtn.addEventListener('click', () => this.calculateImage());
        }

        // 音声計算
        const calcAudioBtn = document.getElementById('calc-audio-btn');
        if (calcAudioBtn) {
            calcAudioBtn.addEventListener('click', () => this.calculateAudio());
        }

        // 動画計算
        const calcVideoBtn = document.getElementById('calc-video-btn');
        if (calcVideoBtn) {
            calcVideoBtn.addEventListener('click', () => this.calculateVideo());
        }
    }

    // ビットからバイト、KB、MB、GBに変換
    formatSize(bits) {
        const units = ['bit', 'Byte', 'KB', 'MB', 'GB', 'TB'];
        const bytes = bits / 8;

        if (bits < 8) {
            return `${bits.toFixed(2)} bit`;
        }

        if (bytes < 1024) {
            return `${bytes.toFixed(2)} Byte`;
        }

        const kb = bytes / 1024;
        if (kb < 1024) {
            return `${kb.toFixed(2)} KB`;
        }

        const mb = kb / 1024;
        if (mb < 1024) {
            return `${mb.toFixed(2)} MB`;
        }

        const gb = mb / 1024;
        if (gb < 1024) {
            return `${gb.toFixed(2)} GB`;
        }

        const tb = gb / 1024;
        return `${tb.toFixed(2)} TB`;
    }

    // 全単位で表示
    formatAllUnits(bits) {
        const bytes = bits / 8;
        const kb = bytes / 1024;
        const mb = kb / 1024;
        const gb = mb / 1024;
        const tb = gb / 1024;

        return `
            <div class="space-y-2">
                <div class="calculation-step">
                    <strong>${bits.toLocaleString()}</strong> bit
                </div>
                <div class="calculation-step">
                    <strong>${bytes.toLocaleString()}</strong> Byte
                </div>
                <div class="calculation-step">
                    <strong>${kb.toFixed(2)}</strong> KB
                </div>
                <div class="calculation-step">
                    <strong>${mb.toFixed(2)}</strong> MB
                </div>
                <div class="calculation-step">
                    <strong>${gb.toFixed(4)}</strong> GB
                </div>
                <div class="calculation-step">
                    <strong>${tb.toFixed(6)}</strong> TB
                </div>
            </div>
        `;
    }

    // 単位変換
    convertUnit() {
        const value = parseFloat(document.getElementById('unit-value').value);
        const fromUnit = document.getElementById('from-unit').value;
        const toUnit = document.getElementById('to-unit').value;

        if (isNaN(value) || value < 0) {
            alert('正しい値を入力してください');
            return;
        }

        // ビットに変換
        const bits = value * this.units[fromUnit];

        // 目的の単位に変換
        const result = bits / this.units[toUnit];

        // 結果表示
        document.getElementById('unit-result').classList.remove('hidden');

        const html = `
            <div class="text-center">
                <div class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    ${value} ${this.unitNames[fromUnit]} = ${result.toLocaleString()} ${this.unitNames[toUnit]}
                </div>
            </div>
        `;
        document.getElementById('unit-result-display').innerHTML = html;

        // 計算過程
        const calcHtml = `
            <div class="space-y-3">
                <div class="calculation-step">
                    <strong>ステップ1:</strong> ${value} ${this.unitNames[fromUnit]} をビットに変換<br>
                    ${value} × ${this.units[fromUnit].toLocaleString()} = ${bits.toLocaleString()} bit
                </div>
                <div class="calculation-step">
                    <strong>ステップ2:</strong> ビットから${this.unitNames[toUnit]}に変換<br>
                    ${bits.toLocaleString()} ÷ ${this.units[toUnit].toLocaleString()} = ${result.toLocaleString()} ${this.unitNames[toUnit]}
                </div>
            </div>
        `;
        document.getElementById('unit-calculation').innerHTML = calcHtml;
    }

    // 画像のデータ量計算
    calculateImage() {
        const width = parseInt(document.getElementById('image-width').value);
        const height = parseInt(document.getElementById('image-height').value);
        const depth = parseInt(document.getElementById('image-depth').value);

        if (!width || !height || width <= 0 || height <= 0) {
            alert('正しい値を入力してください');
            return;
        }

        // ビット数で計算
        const totalBits = width * height * depth;
        const totalBytes = totalBits / 8;

        // 結果表示
        document.getElementById('image-result').classList.remove('hidden');

        // 計算式
        const formulaHtml = `
            <div class="code-block">
                データ量 = 幅 × 高さ × 色深度 ÷ 8<br>
                <span class="text-primary font-bold">
                    = ${width} × ${height} × ${depth} ÷ 8<br>
                    = ${totalBits.toLocaleString()} bit ÷ 8<br>
                    = ${totalBytes.toLocaleString()} Byte
                </span>
            </div>
        `;
        document.getElementById('image-formula').innerHTML = formulaHtml;

        // 結果
        const resultHtml = `
            <div class="base-box mb-4">
                ${this.formatSize(totalBits)}
            </div>
            ${this.formatAllUnits(totalBits)}
            <div class="mt-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    <strong>解像度:</strong> ${width} × ${height} = ${(width * height).toLocaleString()} ピクセル<br>
                    <strong>色深度:</strong> ${depth} bit/ピクセル
                </p>
            </div>
        `;
        document.getElementById('image-result-display').innerHTML = resultHtml;
    }

    // 音声のデータ量計算
    calculateAudio() {
        const rate = parseInt(document.getElementById('audio-rate').value);
        const depth = parseInt(document.getElementById('audio-depth').value);
        const channels = parseInt(document.getElementById('audio-channels').value);
        const duration = parseInt(document.getElementById('audio-duration').value);

        if (!duration || duration <= 0) {
            alert('正しい時間を入力してください');
            return;
        }

        // ビット数で計算
        const totalBits = rate * depth * channels * duration;
        const totalBytes = totalBits / 8;

        // 結果表示
        document.getElementById('audio-result').classList.remove('hidden');

        // 計算式
        const formulaHtml = `
            <div class="code-block">
                データ量 = サンプリングレート × ビット深度 × チャンネル数 × 時間 ÷ 8<br>
                <span class="text-primary font-bold">
                    = ${rate.toLocaleString()} × ${depth} × ${channels} × ${duration} ÷ 8<br>
                    = ${totalBits.toLocaleString()} bit ÷ 8<br>
                    = ${totalBytes.toLocaleString()} Byte
                </span>
            </div>
        `;
        document.getElementById('audio-formula').innerHTML = formulaHtml;

        // 結果
        const resultHtml = `
            <div class="base-box mb-4">
                ${this.formatSize(totalBits)}
            </div>
            ${this.formatAllUnits(totalBits)}
            <div class="mt-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    <strong>サンプリングレート:</strong> ${(rate / 1000).toFixed(1)} kHz (${rate.toLocaleString()} Hz)<br>
                    <strong>ビット深度:</strong> ${depth} bit<br>
                    <strong>チャンネル:</strong> ${channels === 1 ? 'モノラル' : channels === 2 ? 'ステレオ' : channels + 'ch'}<br>
                    <strong>時間:</strong> ${duration} 秒
                </p>
            </div>
        `;
        document.getElementById('audio-result-display').innerHTML = resultHtml;
    }

    // 動画のデータ量計算
    calculateVideo() {
        const resolution = document.getElementById('video-resolution').value.split(',');
        const width = parseInt(resolution[0]);
        const height = parseInt(resolution[1]);
        const depth = parseInt(document.getElementById('video-depth').value);
        const fps = parseInt(document.getElementById('video-fps').value);
        const duration = parseInt(document.getElementById('video-duration').value);
        const includeAudio = document.getElementById('video-audio').checked;

        if (!duration || duration <= 0) {
            alert('正しい時間を入力してください');
            return;
        }

        // 画像のデータ量（1フレーム）
        const imagePerFrame = width * height * depth;

        // 動画のデータ量（映像のみ）
        const videoBits = imagePerFrame * fps * duration;

        // 音声のデータ量
        const audioBits = includeAudio ? 44100 * 16 * 2 * duration : 0;

        // 合計
        const totalBits = videoBits + audioBits;

        // 結果表示
        document.getElementById('video-result').classList.remove('hidden');

        // 計算式
        let formulaHtml = `
            <div class="code-block text-sm">
                <strong>映像:</strong><br>
                1フレームのデータ量 = 幅 × 高さ × 色深度<br>
                = ${width} × ${height} × ${depth} = ${imagePerFrame.toLocaleString()} bit<br>
                <br>
                映像全体 = 1フレーム × フレームレート × 時間<br>
                = ${imagePerFrame.toLocaleString()} × ${fps} × ${duration}<br>
                <span class="text-primary font-bold">= ${videoBits.toLocaleString()} bit</span>
        `;

        if (includeAudio) {
            formulaHtml += `
                <br><br>
                <strong>音声:</strong><br>
                = 44,100 × 16 × 2 × ${duration}<br>
                <span class="text-primary font-bold">= ${audioBits.toLocaleString()} bit</span>
                <br><br>
                <strong>合計:</strong><br>
                = ${videoBits.toLocaleString()} + ${audioBits.toLocaleString()}<br>
                <span class="text-primary font-bold">= ${totalBits.toLocaleString()} bit</span>
            `;
        }

        formulaHtml += `
            </div>
        `;
        document.getElementById('video-formula').innerHTML = formulaHtml;

        // 結果
        const resultHtml = `
            <div class="base-box mb-4">
                ${this.formatSize(totalBits)}
            </div>
            ${this.formatAllUnits(totalBits)}
            <div class="mt-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    <strong>解像度:</strong> ${width} × ${height}<br>
                    <strong>色深度:</strong> ${depth} bit<br>
                    <strong>フレームレート:</strong> ${fps} fps<br>
                    <strong>時間:</strong> ${duration} 秒<br>
                    <strong>音声:</strong> ${includeAudio ? 'あり (44.1kHz, 16bit, ステレオ)' : 'なし'}
                </p>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4">
                <div class="p-3 bg-purple-50 dark:bg-gray-700 rounded-lg">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">映像のみ</p>
                    <p class="font-bold text-gray-900 dark:text-white">${this.formatSize(videoBits)}</p>
                </div>
                ${includeAudio ? `
                <div class="p-3 bg-green-50 dark:bg-gray-700 rounded-lg">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">音声のみ</p>
                    <p class="font-bold text-gray-900 dark:text-white">${this.formatSize(audioBits)}</p>
                </div>
                ` : ''}
            </div>
        `;
        document.getElementById('video-result-display').innerHTML = resultHtml;
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new DataSizeCalculator();
});
