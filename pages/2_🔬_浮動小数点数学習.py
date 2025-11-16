import streamlit as st
import struct
import math

st.set_page_config(
    page_title="浮動小数点数学習",
    page_icon="🔬",
    layout="wide"
)

st.title("🔬 浮動小数点数学習")

tab1, tab2, tab3, tab4 = st.tabs(["📚 説明", "🔢 10進数の正規化", "💻 浮動小数点数への変換", "🧩 練習問題"])

with tab1:
    st.subheader("🌊 浮動小数点数とは？")

    st.markdown("""
    小数や非常に大きな数、小さな数を効率的に表現する**IEEE 754標準**の方法です。
    コンピュータ内部では、すべての実数がこの形式で保存されています。

    ### 📊 3つの形式比較
    """)

    # 3つの形式の比較表
    comparison_data = [
        {"形式": "16bit (半精度)", "符号部": "1bit", "指数部": "5bit", "仮数部": "10bit", "バイアス": "15", "精度": "約3桁"},
        {"形式": "32bit (単精度)", "符号部": "1bit", "指数部": "8bit", "仮数部": "23bit", "バイアス": "127", "精度": "約7桁"},
        {"形式": "64bit (倍精度)", "符号部": "1bit", "指数部": "11bit", "仮数部": "52bit", "バイアス": "1023", "精度": "約15桁"}
    ]
    st.dataframe(comparison_data, use_container_width=True, hide_index=True)

    st.markdown("---")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("""
        ### 🎯 符号部（Sign）
        - **0** = 正の数 ➕
        - **1** = 負の数 ➖

        たった1ビットで正負を表現！
        """)

    with col2:
        st.markdown("""
        ### 📈 指数部（Exponent）
        - **バイアス値**を使用
        - 実際の指数 = 値 - バイアス
        - 大きな数・小さな数を表現

        例: 32bit → バイアス127
        """)

    with col3:
        st.markdown("""
        ### 🔬 仮数部（Mantissa）
        - **1.xxxxx**の形式（正規化）
        - 先頭の1は省略（暗黙の1）
        - 小数部分のみ保存

        精度を決定する重要な部分
        """)

    st.markdown("---")

    st.markdown("""
    ### 🧮 計算式（32bitの場合）
    ```
    値 = (-1)^符号部 × (1.仮数部)₂ × 2^(指数部 - 127)
    ```

    **例:** 正の数で、指数部=128、仮数部=すべて0の場合
    - 符号部 = 0 → (-1)⁰ = 1（正の数）
    - 指数部 = 128 → 128 - 127 = 1
    - 仮数部 = すべて0 → 1.0
    - **結果:** 1 × 1.0 × 2¹ = **2.0**
    """)

with tab2:
    st.subheader("🔢 10進数から指数表記")
    
    decimal_input = st.number_input("浮動小数点数を入力", value=3.14)
    
    st.markdown("---")
    
    # 指数表記の分解表示
    if decimal_input != 0:
        sign_str = "-" if decimal_input < 0 else "+"
        abs_val = abs(decimal_input)
        
        # 指数計算（負の数にも対応）
        if abs_val >= 1:
            exponent = int(math.floor(math.log10(abs_val)))
            mantissa = abs_val / (10 ** exponent)
        else:  # 0 < abs_val < 1
            exponent = int(math.floor(math.log10(abs_val)))
            mantissa = abs_val / (10 ** exponent)
        
        st.markdown("### 📊 指数表記への分解")
        
        # より見やすい表示
        st.markdown(f"**元の数値:** `{decimal_input}`")
        st.markdown(f"**符号:** `{sign_str}`")
        st.markdown(f"**仮数:** `{mantissa:.3f}`")
        st.markdown(f"**指数:** `{exponent}`")
        
        st.markdown("---")
        
        # 最終的な指数表記
        if decimal_input < 0:
            st.markdown(f"**指数表記:** `{decimal_input} = -{mantissa:.3f} × 10^{exponent}`")
        else:
            st.markdown(f"**指数表記:** `{decimal_input} = {mantissa:.3f} × 10^{exponent}`")
    
    elif decimal_input == 0:
        st.markdown("### 📊 ゼロの場合")
        st.markdown("**ゼロは特別な値として扱われます**")
    
    else:
        st.info("数値を入力してください")

def decimal_to_binary_fraction(decimal_val, precision=23):
    """10進数を2進小数に変換"""
    if decimal_val == 0:
        return "0.0"
    
    integer_part = int(abs(decimal_val))
    fractional_part = abs(decimal_val) - integer_part
    
    # 整数部の2進変換
    if integer_part == 0:
        binary_int = "0"
    else:
        binary_int = bin(integer_part)[2:]
    
    # 小数部の2進変換
    binary_frac = ""
    count = 0
    while fractional_part > 0 and count < precision:
        fractional_part *= 2
        if fractional_part >= 1:
            binary_frac += "1"
            fractional_part -= 1
        else:
            binary_frac += "0"
        count += 1
    
    return f"{binary_int}.{binary_frac}"

def perform_step_conversion(value, is_binary=True, bit_format=32):
    """ステップバイステップで浮動小数点数に変換"""
    steps = []

    try:
        # ビット形式に応じた設定
        if bit_format == 16:
            exponent_bits = 5
            mantissa_bits = 10
            bias = 15
            format_name = "半精度 (16bit)"
        elif bit_format == 32:
            exponent_bits = 8
            mantissa_bits = 23
            bias = 127
            format_name = "単精度 (32bit)"
        else:  # 64
            exponent_bits = 11
            mantissa_bits = 52
            bias = 1023
            format_name = "倍精度 (64bit)"

        if is_binary:
            if '.' not in value:
                return None, "小数点を含む2進数を入力してください"

            # 負の2進数対応（先頭が-の場合）
            is_negative = value.startswith('-')
            binary_str = value[1:] if is_negative else value

            # 2進数を10進数に変換
            decimal_val = 0
            parts = binary_str.split('.')
            integer_part = parts[0]
            fractional_part = parts[1] if len(parts) > 1 else ""

            # 整数部
            for i, bit in enumerate(reversed(integer_part)):
                if bit == '1':
                    decimal_val += 2**i

            # 小数部
            for i, bit in enumerate(fractional_part):
                if bit == '1':
                    decimal_val += 2**(-(i+1))

            # 負の数の場合
            if is_negative:
                decimal_val = -decimal_val

            binary_str = ('-' if is_negative else '') + binary_str
        else:
            decimal_val = float(value)
            # 負の数にも対応した2進数変換
            is_negative = decimal_val < 0
            binary_str = decimal_to_binary_fraction(decimal_val)
            if is_negative:
                binary_str = '-' + binary_str.lstrip('-')

        if decimal_val == 0:
            return None, "ゼロの場合は特別な表現になります（すべてのビットが0）"

        # ステップ0: 基数変換（10進数入力の場合のみ）
        if not is_binary:
            abs_val = abs(decimal_val)
            integer_part_dec = int(abs_val)
            fractional_part_dec = abs_val - integer_part_dec

            # 小数部の変換過程を詳しく表示
            conversion_steps = []
            temp = fractional_part_dec
            for i in range(10):  # 最大10ステップ
                if temp == 0:
                    break
                temp *= 2
                if temp >= 1:
                    conversion_steps.append(f"  {i+1}. {temp-1:.7f} × 2 = {temp:.7f} → **1** を取る、残り = {temp-1:.7f}")
                    temp -= 1
                else:
                    conversion_steps.append(f"  {i+1}. {temp:.7f} × 2 = {temp:.7f} → **0** を取る")

            conversion_detail = "\n".join(conversion_steps) if conversion_steps else "  （小数部なし）"

            step0_content = f"""
**元の10進数:** `{decimal_val}`

### 📝 2進数への変換手順

**整数部の変換:**
- 整数部 `{integer_part_dec}` → 2進数 `{bin(integer_part_dec)[2:] if integer_part_dec > 0 else '0'}`

**小数部の変換:**（小数部 × 2 を繰り返し、整数部を取り出す）
{conversion_detail}

### ✅ 変換結果
`({decimal_val})₁₀` = `({binary_str})₂`
"""
            steps.append(("⓪ 基数変換", step0_content))

        # ステップ1: 符号部
        sign_bit = 0 if decimal_val >= 0 else 1
        sign_explanation = f"""
この数値は **{'正の数 ➕' if sign_bit == 0 else '負の数 ➖'}** です。

- **符号ビット = `{sign_bit}`**
  - `0` なら正の数
  - `1` なら負の数

IEEE 754形式では、符号部は常に**先頭の1ビット**で表現されます。
"""
        steps.append(("➀ 符号部の決定", sign_explanation))

        abs_decimal = abs(decimal_val)
        # 負の符号を除去した2進数表現
        binary_str_abs = binary_str.lstrip('-')

        # ステップ2: 正規化
        if abs_decimal >= 1:
            # 1以上の場合
            binary_parts = binary_str_abs.split('.')
            integer_part = binary_parts[0]
            fractional_part = binary_parts[1] if len(binary_parts) > 1 else ""

            # 最初の1を見つける
            first_one_pos = integer_part.find('1')
            if first_one_pos == -1:
                return None, "有効な数値ではありません"

            # 正規化
            exponent = len(integer_part) - first_one_pos - 1
            normalized_mantissa = integer_part[first_one_pos+1:] + fractional_part

            # 上付き文字変換
            superscript_map = {'-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'}
            exp_super = ''.join(superscript_map.get(c, c) for c in str(exponent))

            normalization_explanation = f"""
### 🎯 正規化の目的
2進数を **1.xxxxx × 2ⁿ** の形式に変換します。

### 📊 変換過程
**元の2進数:** `{binary_str_abs}`

**小数点の位置調整:**
- 小数点を**左から{first_one_pos + 1}桁目**（最初の1の直後）に移動
- 移動した桁数 = **{exponent}桁** → これが指数になります

**正規化後:** `1.{normalized_mantissa} × 2{exp_super}`

💡 **なぜ正規化？**
- 先頭が必ず1になるので、この1を省略できます（暗黙の1）
- 限られたビット数で最大限の精度を確保できます！
"""
            steps.append(("➁ 正規化（1以上の場合）", normalization_explanation))

        else:
            # 1未満の場合
            if '.' not in binary_str_abs:
                return None, "無効な2進数形式です"

            fractional_part = binary_str_abs.split('.')[1]

            # 最初の1を見つける
            first_one_pos = -1
            for i, bit in enumerate(fractional_part):
                if bit == '1':
                    first_one_pos = i + 1
                    break

            if first_one_pos == -1:
                return None, "有効な2進小数ではありません"

            exponent = -first_one_pos
            normalized_mantissa = fractional_part[first_one_pos-1:]

            # 上付き文字変換
            superscript_map = {'-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'}
            exp_super = ''.join(superscript_map.get(c, c) for c in str(exponent))

            normalization_explanation = f"""
### 🎯 正規化の目的
2進数を **1.xxxxx × 2ⁿ** の形式に変換します。

### 📊 変換過程
**元の2進数:** `{binary_str_abs}`

**小数点の位置調整:**
- 小数点以下で最初の1が現れるのは**{first_one_pos}桁目**
- 小数点を**右に{first_one_pos}桁移動**
- 移動した桁数 = **-{first_one_pos}** → これが指数になります

**正規化後:** `1.{normalized_mantissa[1:]} × 2{exp_super}`

💡 **ポイント:**
- 0.000...から始まる小数も、1.xxxの形に正規化できます
- 指数が負になることで、元の小さな値を表現します
"""
            steps.append(("➁ 正規化（1未満の場合）", normalization_explanation))

        # ステップ3: 指数部
        biased_exponent = exponent + bias

        if biased_exponent < 0 or biased_exponent >= (2**exponent_bits - 1):
            return None, f"指数がサポート範囲外です ({biased_exponent})"

        # バイアス式の表示
        if bit_format == 16:
            bias_formula = "2⁴-1 = 15"
        elif bit_format == 32:
            bias_formula = "2⁷-1 = 127"
        else:
            bias_formula = "2¹⁰-1 = 1023"

        exponent_explanation = f"""
### 📈 バイアス表現とは？
指数部では**負の数も扱う**必要がありますが、符号ビットは別にあるため、バイアス（offset）方式を使います。

### 🧮 計算方法
**{format_name}のバイアス:** `{bias}` （計算式: {bias_formula}）

**実際の指数:** `{exponent}`
**バイアスを加算:** `{exponent} + {bias} = {biased_exponent}`

### 💾 2進数表現
**指数部（{exponent_bits}ビット）:** `{format(biased_exponent, f'0{exponent_bits}b')}`

💡 **なぜバイアス方式？**
- 負の指数も扱える（例: 2⁻³ など）
- 浮動小数点数の大小比較が簡単になる
- ビット列として扱いやすい
"""
        steps.append(("➂ 指数部の計算", exponent_explanation))

        # ステップ4: 仮数部
        if abs_decimal >= 1:
            mantissa_fraction = normalized_mantissa
        else:
            mantissa_fraction = normalized_mantissa[1:] if len(normalized_mantissa) > 1 else ""

        mantissa_padded = (mantissa_fraction + "0" * mantissa_bits)[:mantissa_bits]

        mantissa_explanation = f"""
### 🔬 仮数部の構成
正規化により、**1.xxxxx** の形になっています。
先頭の**1は暗黙**（Implicit Leading Bit）として省略し、**小数部分のみ**を保存します。

### 📝 小数部分の取り出し
**正規化後:** `1.{mantissa_fraction}`
**保存する部分:** `{mantissa_fraction}` （小数点以下のみ）

### 💾 ビット調整
**仮数部のビット数:** {mantissa_bits}ビット
**実際の小数部:** `{mantissa_fraction}` （{len(mantissa_fraction)}ビット）

{'**0で埋める:** ' + str(mantissa_bits - len(mantissa_fraction)) + 'ビット不足 → 末尾に0を追加' if len(mantissa_fraction) < mantissa_bits else '**切り捨て:** ' + str(len(mantissa_fraction) - mantissa_bits) + 'ビット超過 → 先頭' + str(mantissa_bits) + 'ビットのみ使用'}

**最終的な仮数部:** `{mantissa_padded}`

💡 **暗黙の1のメリット:**
- 1ビット分の精度が向上！
- すべての正規化された数は1.xxxの形なので、1を保存する必要がない
"""
        steps.append(("④ 仮数部の構成", mantissa_explanation))
        
        # 最終結果
        final_binary = f"{sign_bit} {format(biased_exponent, f'0{exponent_bits}b')} {mantissa_padded}"

        # 検証（ビット列から実際の値を復元）
        verification = None
        try:
            if bit_format == 16:
                # 16bitの場合は手動計算（structに直接のサポートがないため）
                # 値 = (-1)^sign × 2^(exponent-15) × (1 + mantissa/2^10)
                mantissa_value = int(mantissa_padded, 2) / (2 ** mantissa_bits)
                float_value = ((-1) ** sign_bit) * (2 ** (biased_exponent - bias)) * (1 + mantissa_value)
            elif bit_format == 32:
                binary_int = str(sign_bit) + format(biased_exponent, '08b') + mantissa_padded
                bytes_data = struct.pack('>I', int(binary_int, 2))
                float_value = struct.unpack('>f', bytes_data)[0]
            else:  # 64
                binary_int = str(sign_bit) + format(biased_exponent, '011b') + mantissa_padded
                bytes_data = struct.pack('>Q', int(binary_int, 2))
                float_value = struct.unpack('>d', bytes_data)[0]

            verification = {
                'original': decimal_val,
                'converted': float_value,
                'error': abs(decimal_val - float_value),
                'relative_error': abs(decimal_val - float_value) / abs(decimal_val) if decimal_val != 0 else 0
            }
        except Exception as e:
            verification = None

        return {
            'steps': steps,
            'final_binary': final_binary,
            'verification': verification,
            'binary_representation': binary_str,
            'format_name': format_name,
            'sign_bit': sign_bit,
            'exponent_bits': exponent_bits,
            'exponent_value': biased_exponent,
            'mantissa_bits': mantissa_bits,
            'mantissa_value': mantissa_padded
        }, None
        
    except Exception as e:
        return None, f"エラー: {str(e)}"

with tab3:
    st.subheader("💻 実数から浮動小数点数への変換")

    # 設定部分
    col1, col2 = st.columns([2, 1])

    with col1:
        input_type = st.radio("入力形式を選択", ["10進数", "2進数"], horizontal=True)

    with col2:
        bit_format = st.selectbox(
            "ビット形式",
            [16, 32, 64],
            index=1,  # デフォルトは32bit
            format_func=lambda x: f"{x}bit ({'半精度' if x == 16 else '単精度' if x == 32 else '倍精度'})"
        )

    st.markdown("---")

    # 入力部分
    if input_type == "10進数":
        user_input = st.text_input(
            "10進数を入力してください (例: 0.1015625, -3.14, 123.456)",
            value="0.1015625",
            help="正・負の小数、整数どちらでも入力可能です"
        )
        is_binary_input = False
    else:
        user_input = st.text_input(
            "2進数を入力してください (例: 0.0001101, -11.01, 1101.1)",
            value="0.0001101",
            help="2進数の実数を入力（整数部.小数部の形式、負の数は先頭に-を付ける）"
        )
        is_binary_input = True

    # 変換処理
    if user_input:
        try:
            if input_type == "10進数":
                # 入力検証
                float(user_input)

                # 10進数から2進数への変換を表示
                binary_repr = decimal_to_binary_fraction(float(user_input))
                st.info(f"**2進数表現:** `{binary_repr}`")

                # 基数変換の詳細表示
                with st.expander("🔍 基数変換の詳細（位取り記数法）", expanded=False):
                    val = float(user_input)
                    integer_part = int(abs(val))
                    fractional_part = abs(val) - integer_part

                    st.markdown("### 📊 位取り記数法による基数変換")

                    # 10進数の位取り記数法表現（表形式）
                    st.markdown("**📋 10進数の位取り記数法分解表:**")

                    # 数値を文字列に変換して各桁を取得
                    val_str = f"{val:.7f}".rstrip('0').rstrip('.')
                    if '.' in val_str:
                        int_part_str, frac_part_str = val_str.split('.')
                    else:
                        int_part_str, frac_part_str = val_str, ""

                    # 10進数位取り表の作成
                    decimal_table_data = []

                    # 整数部（右から左へ）
                    for i, digit in enumerate(reversed(int_part_str)):
                        if int(digit) > 0:  # 0でない桁のみ表示
                            decimal_table_data.append({
                                "位": f"10{chr(8304+i) if i < 10 else f'^{i}'}",
                                "位の値": f"{10**i}",
                                "桁の値": digit,
                                "計算": f"{digit} × {10**i}",
                                "結果": f"{int(digit) * (10**i)}"
                            })

                    # 小数部（左から右へ）
                    for i, digit in enumerate(frac_part_str):
                        if int(digit) > 0:  # 0でない桁のみ表示
                            pos = -(i+1)
                            # 負の指数用上付き文字
                            superscript_map = {'-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'}
                            pos_super = ''.join(superscript_map.get(c, c) for c in str(pos))
                            decimal_table_data.append({
                                "位": f"10{pos_super}",
                                "位の値": f"{10**pos:.7f}".rstrip('0'),
                                "桁の値": digit,
                                "計算": f"{digit} × {10**pos:.7f}".rstrip('0'),
                                "結果": f"{int(digit) * (10**pos):.7f}".rstrip('0')
                            })

                    if decimal_table_data:
                        st.dataframe(decimal_table_data, use_container_width=True)

                        # 合計の表示
                        total_parts = [f"{row['桁の値']} × {row['位の値']}" for row in decimal_table_data]
                        st.code(f"{val} = " + " + ".join(total_parts))

                    st.markdown("---")

                    # 2進数の位取り記数法表現
                    st.markdown("**📋 2進数の位取り記数法分解表:**")

                    # 2進数変換
                    binary_int = bin(integer_part)[2:] if integer_part > 0 else "0"

                    # 小数部の2進変換
                    binary_frac = ""
                    temp = fractional_part
                    for i in range(15):  # 最大15桁まで
                        if temp == 0:
                            break
                        temp *= 2
                        if temp >= 1:
                            binary_frac += "1"
                            temp -= 1
                        else:
                            binary_frac += "0"

                    # 2進数位取り表の作成
                    binary_table_data = []

                    # 上付き文字マッピング
                    superscript_map = {'-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'}

                    # 整数部（右から左へ）
                    for i, bit in enumerate(reversed(binary_int)):
                        if bit == '1':  # 1のビットのみ表示
                            i_super = ''.join(superscript_map.get(c, c) for c in str(i))
                            binary_table_data.append({
                                "位": f"2{i_super}",
                                "位の値": f"{2**i}",
                                "ビット": bit,
                                "計算": f"{bit} × {2**i}",
                                "結果": f"{int(bit) * (2**i)}"
                            })

                    # 小数部（左から右へ）
                    for i, bit in enumerate(binary_frac):
                        if bit == '1':  # 1のビットのみ表示
                            pos = -(i+1)
                            pos_super = ''.join(superscript_map.get(c, c) for c in str(pos))
                            binary_table_data.append({
                                "位": f"2{pos_super}",
                                "位の値": f"{2**pos:.7f}".rstrip('0'),
                                "ビット": bit,
                                "計算": f"{bit} × {2**pos:.7f}".rstrip('0'),
                                "結果": f"{int(bit) * (2**pos):.7f}".rstrip('0')
                            })

                    if binary_table_data:
                        st.dataframe(binary_table_data, use_container_width=True)

                        # 合計の表示
                        binary_parts = [f"{row['ビット']} × {row['位の値']}" for row in binary_table_data]
                        binary_result = binary_int + ("." + binary_frac if binary_frac else "")
                        st.code(f"{val}₁₀ ≈ " + " + ".join(binary_parts) + f" = {binary_result}₂")

                    st.markdown("---")
                    st.success(f"**📍 変換結果:** {val}₁₀ = {binary_repr}₂")

                result, error = perform_step_conversion(user_input, False, bit_format)
            else:
                # 2進数入力の検証
                clean_input = user_input.lstrip('-')  # 負号を除去して検証
                if not all(c in '01.' for c in clean_input) or clean_input.count('.') != 1:
                    st.error("有効な2進数形式で入力してください（例: 0.1101、-11.01）")
                else:
                    result, error = perform_step_conversion(user_input, True, bit_format)
            
            if error:
                st.error(error)
            elif result:
                st.markdown("---")

                # ステップ表示
                for step_title, step_content in result['steps']:
                    with st.container():
                        st.markdown(f"### {step_title}")
                        st.markdown(step_content)
                        st.markdown("")

                # 最終結果
                st.markdown("---")
                st.markdown("### 🎯 最終結果")

                # ビット構成を視覚的に表示
                col1, col2, col3 = st.columns([1, 2, 4])

                with col1:
                    st.markdown("**符号部**")
                    st.code(f"{result['sign_bit']}", language=None)
                    st.caption("1bit")

                with col2:
                    st.markdown("**指数部**")
                    exp_bits = result['exponent_bits']
                    exp_val = result['exponent_value']
                    st.code(f"{format(exp_val, f'0{exp_bits}b')}", language=None)
                    st.caption(f"{exp_bits}bit")

                with col3:
                    st.markdown("**仮数部**")
                    st.code(f"{result['mantissa_value']}", language=None)
                    st.caption(f"{result['mantissa_bits']}bit")

                # 完全なビット列
                st.markdown("### 📋 完全なビット列")
                st.success(f"**{result['format_name']}（IEEE 754形式）:** `{result['final_binary']}`")

                # ビット構成の説明
                with st.expander("📖 ビット構成の詳細", expanded=False):
                    st.markdown(f"""
                    ### ビットの役割

                    | 部分 | ビット位置 | 値 | 意味 |
                    |------|-----------|-----|------|
                    | **符号部** | 先頭1bit | `{result['sign_bit']}` | {'正の数 ➕' if result['sign_bit'] == 0 else '負の数 ➖'} |
                    | **指数部** | 次の{result['exponent_bits']}bit | `{result['exponent_value']}` (10進数) | バイアス付き指数 |
                    | **仮数部** | 残り{result['mantissa_bits']}bit | `{result['mantissa_value']}` | 小数部分（暗黙の1を除く） |

                    ### 計算式による復元
                    ```
                    値 = (-1)^{result['sign_bit']} × (1.{result['mantissa_value']})₂ × 2^({result['exponent_value']} - バイアス)
                    ```
                    """)

                # 検証
                if result['verification']:
                    st.markdown("### ✅ 検証（逆変換）")
                    v = result['verification']

                    col1, col2, col3 = st.columns(3)

                    with col1:
                        st.metric("元の値", f"{v['original']:.10f}")

                    with col2:
                        st.metric("変換後の値", f"{v['converted']:.10f}")

                    with col3:
                        st.metric("絶対誤差", f"{v['error']:.2e}")

                    # 相対誤差の表示
                    if v['relative_error'] > 1e-6:
                        st.warning(f"⚠️ 相対誤差: {v['relative_error']*100:.6f}% - {bit_format}bitでは完全に表現できない数値です")
                    else:
                        st.success(f"✅ 相対誤差: {v['relative_error']*100:.10f}% - {bit_format}bitで正確に表現できています")
                
        except ValueError:
            st.error("有効な数値を入力してください")
        except Exception as e:
            st.error(f"処理エラー: {str(e)}")
    
    # 参考情報
    st.markdown("---")
    st.subheader("📋 選択中のビット構成")

    if bit_format == 16:
        st.markdown("""
        **16bit (半精度 / Half Precision):**
        - **符号部:** 1ビット
        - **指数部:** 5ビット（バイアス: 15 = 2⁴-1）
        - **仮数部:** 10ビット
        - **表現範囲:** 約 ±6.10×10⁻⁵ ～ ±6.55×10⁴
        - **用途:** GPU計算、機械学習（メモリ節約）
        """)
    elif bit_format == 32:
        st.markdown("""
        **32bit (単精度 / Single Precision):**
        - **符号部:** 1ビット
        - **指数部:** 8ビット（バイアス: 127 = 2⁷-1）
        - **仮数部:** 23ビット
        - **表現範囲:** 約 ±1.18×10⁻³⁸ ～ ±3.40×10³⁸
        - **用途:** 一般的なプログラミング（float型）
        """)
    else:
        st.markdown("""
        **64bit (倍精度 / Double Precision):**
        - **符号部:** 1ビット
        - **指数部:** 11ビット（バイアス: 1023 = 2¹⁰-1）
        - **仮数部:** 52ビット
        - **表現範囲:** 約 ±2.23×10⁻³⁰⁸ ～ ±1.80×10³⁰⁸
        - **用途:** 高精度計算（double型）
        """)

with tab4:
    st.subheader("🧩 練習問題")
    
    with st.expander("問題1: 2.0の表現", expanded=True):
        st.markdown("""
        **2.0をIEEE 754形式で表現してください**
        
        ヒント: 2.0 = 1.0 × 2¹
        """)
        
        col1, col2 = st.columns(2)
        with col1:
            st.markdown("符号部:")
            sign_ans = st.radio("", ["0", "1"], key="q1_sign")
            st.markdown("指数部 (10進数):")
            exp_ans = st.number_input("", 0, 255, key="q1_exp")
        
        with col2:
            if st.button("正解確認", key="check_q1"):
                if sign_ans == "0" and exp_ans == 128:
                    st.success("✓ 正解！")
                    st.info("符号部: 0 (正数)")
                    st.info("指数部: 1 + 127 = 128")
                    st.info("仮数部: すべて0")
                else:
                    st.error("✗ 不正解")
                    st.info("正解: 符号部=0, 指数部=128")
    
    with st.expander("問題2: 0.5の表現"):
        st.markdown("""
        **0.5のバイアス付き指数部は？**
        
        ヒント: 0.5 = 1.0 × 2⁻¹
        """)
        
        col1, col2 = st.columns(2)
        with col1:
            exp_ans2 = st.number_input("指数部 (10進数)", 0, 255, key="q2")
        
        with col2:
            if st.button("正解確認", key="check_q2"):
                if exp_ans2 == 126:
                    st.success("✓ 正解！")
                    st.info("実際の指数: -1")
                    st.info("バイアス付き: -1 + 127 = 126")
                else:
                    st.error("✗ 不正解。正解は126")
    
    with st.expander("問題3: 特殊値"):
        st.markdown("**無限大の指数部と仮数部の特徴は？**")
        
        col1, col2 = st.columns(2)
        with col1:
            inf_exp = st.selectbox("指数部", ["すべて0", "すべて1", "その他"], key="q3_exp")
            inf_man = st.selectbox("仮数部", ["すべて0", "すべて1", "その他"], key="q3_man")
        
        with col2:
            if st.button("正解確認", key="check_q3"):
                if inf_exp == "すべて1" and inf_man == "すべて0":
                    st.success("✓ 正解！")
                    st.info("無限大: 指数部=255, 仮数部=0")
                else:
                    st.error("✗ 不正解")
                    st.info("無限大: 指数部=すべて1, 仮数部=すべて0")

# フッター
st.markdown("---")
st.markdown("")
st.markdown("")

# フィードバックとコピーライト
col1, col2 = st.columns([3, 1])

with col1:
    st.markdown(
        """
        <div style='text-align: left; color: #666; font-size: 0.9em;'>
        ご意見・ご要望は <a href='https://github.com/itou-daiki/Floating-Point-Suppoter/issues' target='_blank' style='color: #0066cc;'>こちら</a>
        </div>
        """,
        unsafe_allow_html=True
    )

with col2:
    st.markdown(
        """
        <div style='text-align: right; color: #666; font-size: 0.85em;'>
        © 2022-2025 Dit-Lab.(Daiki Ito).<br>All Rights Reserved.
        </div>
        """,
        unsafe_allow_html=True
    )