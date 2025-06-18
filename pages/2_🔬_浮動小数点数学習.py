import streamlit as st
import struct
import math

st.set_page_config(
    page_title="浮動小数点数学習",
    page_icon="🔬",
    layout="wide"
)

st.title("🔬 浮動小数点数学習")

tab1, tab2, tab3, tab4 = st.tabs(["📚 説明", "🔢 10進数", "💻 2進数", "🧩 練習問題"])

with tab1:
    st.subheader("🌊 浮動小数点数とは？")
    
    st.markdown("""
    小数や非常に大きな数、小さな数を効率的に表現するIEEE 754標準の方法です。
    
    ### 32ビット構造
    | 符号部 | 指数部 | 仮数部 |
    |--------|--------|--------|
    | 1ビット | 8ビット | 23ビット |
    """)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        ### 符号部
        - 0 = 正の数
        - 1 = 負の数
        """)
    
    with col2:
        st.markdown("""
        ### 指数部
        - バイアス値: 127
        - 実際の指数 = 値 - 127
        - 範囲: -126 ～ +127
        """)
    
    with col3:
        st.markdown("""
        ### 仮数部
        - 暗黙の1.xxxxx形式
        - 23ビットで小数部分を表現
        - 精度を決定
        """)
    
    st.markdown("""
    ### 計算式
    ```
    値 = (-1)^符号 × (1 + 仮数部/2²³) × 2^(指数部-127)
    ```
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
        if is_binary:
            if '.' not in value:
                return None, "小数点を含む2進数を入力してください"
            binary_str = value
            # 2進数を10進数に変換
            decimal_val = 0
            parts = value.split('.')
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
        else:
            decimal_val = float(value)
            binary_str = decimal_to_binary_fraction(decimal_val)
        
        if decimal_val == 0:
            return None, "ゼロの場合は特別な表現になります"
        
        # ステップ0: 基数変換（10進数入力の場合のみ）
        if not is_binary:
            steps.append(("⓪ 基数変換", f"**10進数:** `{decimal_val}`\n\n**2進数変換過程:**\n\n整数部: `{int(abs(decimal_val))}` → `{bin(int(abs(decimal_val)))[2:] if int(abs(decimal_val)) > 0 else '0'}`\n\n小数部: `{abs(decimal_val) - int(abs(decimal_val)):.10f}` → 小数部×2を繰り返し計算\n\n**結果:** `({decimal_val})₁₀` → `({binary_str})₂`"))
        
        # ステップ1: 符号部
        sign_bit = 0 if decimal_val >= 0 else 1
        steps.append(("➀ 符号部", f"この数値は{'正' if sign_bit == 0 else '負'}なので、符号ビットは **「{sign_bit}」** です。"))
        
        abs_decimal = abs(decimal_val)
        
        # ステップ2: 正規化
        if abs_decimal >= 1:
            # 1以上の場合
            binary_parts = binary_str.split('.')
            integer_part = binary_parts[0]
            fractional_part = binary_parts[1] if len(binary_parts) > 1 else ""
            
            # 最初の1を見つける
            first_one_pos = integer_part.find('1')
            if first_one_pos == -1:
                return None, "有効な数値ではありません"
            
            # 正規化
            exponent = len(integer_part) - first_one_pos - 1
            normalized_mantissa = integer_part[first_one_pos+1:] + fractional_part
            
            steps.append(("➁ 正規化", f"数値を **1.xxxxx** の形に変換\n\n**「{binary_str}」** を右にシフトして **「1.{normalized_mantissa} × 2^{exponent}」** にします。"))
            
        else:
            # 1未満の場合
            if '.' not in binary_str:
                return None, "無効な2進数形式です"
            
            fractional_part = binary_str.split('.')[1]
            
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
            
            steps.append(("➁ 正規化", f"数値を **1.xxxxx** の形に変換\n\n**「{binary_str}」** を左にシフトして **「1.{normalized_mantissa[1:]} × 2^{exponent}」** にします。"))
        
        # ステップ3: 指数部
        bias = 127 if bit_format == 32 else 1023
        exponent_bits = 8 if bit_format == 32 else 11
        mantissa_bits = 23 if bit_format == 32 else 52
        
        biased_exponent = exponent + bias
        
        if biased_exponent < 0 or biased_exponent >= (2**exponent_bits - 1):
            return None, f"指数がサポート範囲外です ({biased_exponent})"
        
        bias_formula = "2^7-1" if bit_format == 32 else "2^10-1"
        steps.append(("➂ 指数部", f"バイアスを使用して指数を変換\n\n{bit_format//8*4}精度浮動小数点数のバイアスは **{bias}** ← {bias_formula}で覚えよう\n\n実際の指数 **{exponent}** に{bias}を加えた **{biased_exponent}**（2進数で **{format(biased_exponent, f'0{exponent_bits}b')}**）が指数部に"))
        
        # ステップ4: 仮数部
        if abs_decimal >= 1:
            mantissa_fraction = normalized_mantissa
        else:
            mantissa_fraction = normalized_mantissa[1:] if len(normalized_mantissa) > 1 else ""
        
        mantissa_padded = (mantissa_fraction + "0" * mantissa_bits)[:mantissa_bits]
        
        steps.append(("④ 仮数部", f"正規化した数の小数部分を取る\n\n**1.{mantissa_fraction}** の小数部分は **{mantissa_fraction}** 　仮数部は{mantissa_bits}ビット　残りのビットは0で埋める"))
        
        # 最終結果
        final_binary = f"{sign_bit} {format(biased_exponent, f'0{exponent_bits}b')} {mantissa_padded}"
        
        # 検証
        try:
            if bit_format == 32:
                binary_int = str(sign_bit) + format(biased_exponent, '08b') + mantissa_padded
                bytes_data = struct.pack('>I', int(binary_int, 2))
                float_value = struct.unpack('>f', bytes_data)[0]
            else:
                binary_int = str(sign_bit) + format(biased_exponent, '011b') + mantissa_padded
                bytes_data = struct.pack('>Q', int(binary_int, 2))
                float_value = struct.unpack('>d', bytes_data)[0]
            
            verification = {
                'original': decimal_val,
                'converted': float_value,
                'error': abs(decimal_val - float_value)
            }
        except:
            verification = None
        
        return {
            'steps': steps,
            'final_binary': final_binary,
            'verification': verification,
            'binary_representation': binary_str if is_binary else binary_str
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
        bit_format = st.selectbox("ビット形式", [32, 64], format_func=lambda x: f"{x}bit")
    
    st.markdown("---")
    
    # 入力部分
    if input_type == "10進数":
        user_input = st.text_input(
            "10進数を入力してください (例: 0.1015625, 3.14)",
            value="0.1015625",
            help="正の小数または整数を入力"
        )
        is_binary_input = False
    else:
        user_input = st.text_input(
            "2進数を入力してください (例: 0.0001101, 11.01)",
            value="0.0001101",
            help="2進数の実数を入力（整数部.小数部の形式）"
        )
        is_binary_input = True
    
    # 変換処理
    if user_input:
        try:
            if input_type == "10進数":
                # 入力検証
                float(user_input)
                if float(user_input) < 0:
                    st.warning("現在は正の数のみサポートしています（負の数は符号ビットを1にするだけです）")
                else:
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
                                    "位": f"10^{i}",
                                    "位の値": f"{10**i}",
                                    "桁の値": digit,
                                    "計算": f"{digit} × {10**i}",
                                    "結果": f"{int(digit) * (10**i)}"
                                })
                        
                        # 小数部（左から右へ）
                        for i, digit in enumerate(frac_part_str):
                            if int(digit) > 0:  # 0でない桁のみ表示
                                pos = -(i+1)
                                decimal_table_data.append({
                                    "位": f"10^({pos})",
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
                        
                        # 整数部（右から左へ）
                        for i, bit in enumerate(reversed(binary_int)):
                            if bit == '1':  # 1のビットのみ表示
                                binary_table_data.append({
                                    "位": f"2^{i}",
                                    "位の値": f"{2**i}",
                                    "ビット": bit,
                                    "計算": f"{bit} × {2**i}",
                                    "結果": f"{int(bit) * (2**i)}"
                                })
                        
                        # 小数部（左から右へ）
                        for i, bit in enumerate(binary_frac):
                            if bit == '1':  # 1のビットのみ表示
                                pos = -(i+1)
                                binary_table_data.append({
                                    "位": f"2^({pos})",
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
                if not all(c in '01.' for c in user_input) or user_input.count('.') != 1:
                    st.error("有効な2進数形式で入力してください（例: 0.1101）")
                else:
                    result, error = perform_step_conversion(user_input, True, bit_format)
            
            if error:
                st.error(error)
            elif result:
                st.markdown("---")
                
                # ステップ表示
                for step_title, step_content in result['steps']:
                    st.markdown(f"### {step_title}")
                    st.markdown(step_content)
                    st.markdown("")
                
                # 最終結果
                st.markdown("### 🎯 最終結果")
                st.success(f"**IEEE 754 ({bit_format}bit)形式:** `{result['final_binary']}`")
                
                # 検証
                if result['verification']:
                    st.markdown("### ✅ 検証")
                    v = result['verification']
                    st.info(f"元の値: {v['original']:.10f}")
                    st.info(f"変換後の値: {v['converted']:.10f}")
                    st.info(f"誤差: {v['error']:.2e}")
                
        except ValueError:
            st.error("有効な数値を入力してください")
        except Exception as e:
            st.error(f"処理エラー: {str(e)}")
    
    # 参考情報
    st.markdown("---")
    st.subheader("📋 ビット構成")
    
    if bit_format == 32:
        st.markdown("""
        **32bit (単精度):**
        - 符号部: 1ビット
        - 指数部: 8ビット (バイアス: 127)
        - 仮数部: 23ビット
        """)
    else:
        st.markdown("""
        **64bit (倍精度):**
        - 符号部: 1ビット  
        - 指数部: 11ビット (バイアス: 1023)
        - 仮数部: 52ビット
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