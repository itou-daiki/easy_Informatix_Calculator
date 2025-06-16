import streamlit as st
import struct
import numpy as np

st.set_page_config(
    page_title="浮動小数点数学習",
    page_icon="🔬",
    layout="wide"
)

st.title("🔬 浮動小数点数学習")

st.markdown("""
## 🌊 浮動小数点数とは？

**浮動小数点数**（Floating Point Number）は、コンピュータで小数や非常に大きな数、小さな数を効率的に表現する方法です。
IEEE 754標準に基づいており、32ビット（単精度）と64ビット（倍精度）の形式があります。

### 📊 IEEE 754 単精度（32ビット）の構造

| 符号部 | 指数部 | 仮数部 |
|--------|--------|--------|
| 1ビット | 8ビット | 23ビット |

- **符号部（Sign）**: 正負を表す（0=正、1=負）
- **指数部（Exponent）**: 桁数を表す（127のバイアス付き）
- **仮数部（Mantissa/Fraction）**: 精度を表す（暗黙の1.xxxxx形式）
""")

st.markdown("---")

# バイアス計算の詳細説明セクション
st.subheader("🧮 バイアス計算の詳細")

st.markdown("""
### なぜバイアスが必要なのか？

指数部8ビットで表現できる値は0～255ですが、実際の指数は負の値も必要です。
そこで**バイアス値127**を使って、実際の指数を計算します。

**計算式**: `実際の指数 = 指数部の値 - 127`
""")

col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("### 📊 指数部の範囲")
    st.code("""
指数部 (8ビット): 0 ～ 255

特殊値:
- 0: ゼロ・非正規化数
- 1-254: 正規化数
- 255: 無限大・NaN
    """)

with col2:
    st.markdown("### ⚖️ バイアス適用")
    st.code("""
バイアス値: 127

実際の指数の範囲:
- 1-127 = -126 (最小)
- 254-127 = +127 (最大)
    """)

with col3:
    st.markdown("### 🎯 具体例")
    
    # インタラクティブなバイアス計算例
    exponent_input = st.slider("指数部の値", 1, 254, 127)
    actual_exponent = exponent_input - 127
    
    st.code(f"""
指数部: {exponent_input}
実際の指数: {exponent_input} - 127 = {actual_exponent}
倍率: 2^{actual_exponent} = {2**actual_exponent:.6f}
    """)

st.markdown("---")

# 手動計算練習セクション
st.subheader("✏️ 手動計算練習")

st.markdown("### 🔢 10進数から IEEE 754 形式への変換")

practice_tab1, practice_tab2 = st.tabs(["ステップ学習", "自由練習"])

with practice_tab1:
    st.markdown("#### 例: 6.75 を IEEE 754 形式に変換")
    
    step_expander = st.expander("ステップ1: 符号部を決定", expanded=True)
    with step_expander:
        st.markdown("""
        **6.75 は正の数なので:**
        - 符号部 = 0 (正数)
        """)
        st.success("符号部: 0")
    
    step_expander = st.expander("ステップ2: 2進数に変換")
    with step_expander:
        st.markdown("""
        **6.75 を2進数に変換:**
        - 整数部分: 6 = 110₂
        - 小数部分: 0.75 = 0.11₂ (0.5 + 0.25)
        - 結果: 6.75 = 110.11₂
        """)
        st.success("2進数: 110.11")
    
    step_expander = st.expander("ステップ3: 正規化")
    with step_expander:
        st.markdown("""
        **正規化 (1.xxxxx × 2^n の形式に変換):**
        - 110.11₂ = 1.1011₂ × 2²
        - 実際の指数: 2
        """)
        st.success("正規化: 1.1011 × 2²")
    
    step_expander = st.expander("ステップ4: 指数部を計算")
    with step_expander:
        st.markdown("""
        **バイアス付き指数を計算:**
        - 実際の指数: 2
        - バイアス付き指数: 2 + 127 = 129
        - 8ビット2進数: 129 = 10000001₂
        """)
        st.success("指数部: 10000001")
    
    step_expander = st.expander("ステップ5: 仮数部を決定")
    with step_expander:
        st.markdown("""
        **仮数部 (小数部分のみ、23ビット):**
        - 正規化後: 1.1011
        - 小数部分: .1011
        - 23ビットに拡張: 10110000000000000000000
        """)
        st.success("仮数部: 10110000000000000000000")
    
    step_expander = st.expander("ステップ6: 最終結果", expanded=True)
    with step_expander:
        st.markdown("""
        **IEEE 754 形式での最終結果:**
        """)
        final_binary = "01000000110110000000000000000000"
        final_hex = hex(int(final_binary, 2))[2:].upper()
        
        st.code(f"符号部: 0")
        st.code(f"指数部: 10000001")
        st.code(f"仮数部: 10110000000000000000000")
        st.code(f"完全な2進数: {final_binary}")
        st.code(f"16進数: 0x{final_hex}")
        
        # 検証
        import struct
        test_bytes = struct.pack('>I', int(final_binary, 2))
        test_float = struct.unpack('>f', test_bytes)[0]
        st.success(f"検証: {test_float} (元の値: 6.75)")

with practice_tab2:
    st.markdown("#### 自分で計算してみよう！")
    
    col1, col2 = st.columns(2)
    
    with col1:
        practice_number = st.number_input(
            "変換したい数値を入力 (1.0 ～ 100.0)",
            min_value=1.0,
            max_value=100.0,
            value=5.5,
            step=0.25
        )
        
        st.markdown("### 📝 計算手順")
        st.markdown("""
        1. **符号部**: 正数=0, 負数=1
        2. **2進数変換**: 整数部と小数部を分けて変換
        3. **正規化**: 1.xxxxx × 2^n の形式
        4. **指数部**: 実際の指数 + 127
        5. **仮数部**: 正規化後の小数部分を23ビット
        """)
        
        if st.button("答えを表示"):
            st.session_state.show_answer = True
    
    with col2:
        if hasattr(st.session_state, 'show_answer') and st.session_state.show_answer:
            st.markdown("### 📊 正解")
            
            # 実際の計算
            packed = struct.pack('>f', practice_number)
            binary_repr = ''.join(format(byte, '08b') for byte in packed)
            hex_repr = packed.hex().upper()
            
            sign_bit = binary_repr[0]
            exponent_bits = binary_repr[1:9]
            mantissa_bits = binary_repr[9:32]
            
            exponent_value = int(exponent_bits, 2)
            actual_exponent = exponent_value - 127
            
            st.code(f"元の数値: {practice_number}")
            st.code(f"符号部: {sign_bit}")
            st.code(f"指数部: {exponent_bits} ({exponent_value})")
            st.code(f"実際の指数: {actual_exponent}")
            st.code(f"仮数部: {mantissa_bits}")
            st.code(f"完全な2進数: {binary_repr}")
            st.code(f"16進数: 0x{hex_repr}")

st.markdown("---")

# 入力セクション
st.subheader("🎯 実際に試してみよう！")

tab1, tab2 = st.tabs(["10進数から変換", "2進数から変換"])

with tab1:
    st.markdown("### 📥 10進数を入力")
    
    col1, col2 = st.columns([1, 2])
    
    with col1:
        decimal_input = st.number_input(
            "浮動小数点数を入力",
            value=3.14159,
            format="%.6f",
            step=0.000001
        )
        
        st.markdown("**特殊値を試す:**")
        if st.button("0.0"):
            decimal_input = 0.0
        if st.button("1.0"):
            decimal_input = 1.0
        if st.button("-1.0"):
            decimal_input = -1.0
        if st.button("無限大"):
            decimal_input = float('inf')
        if st.button("NaN"):
            decimal_input = float('nan')
    
    with col2:
        st.markdown("### 📊 IEEE 754 表現")
        
        # バイト配列に変換
        try:
            packed = struct.pack('>f', decimal_input)
            hex_repr = packed.hex().upper()
            binary_repr = ''.join(format(byte, '08b') for byte in packed)
            
            # 各部分を抽出
            sign_bit = binary_repr[0]
            exponent_bits = binary_repr[1:9]
            mantissa_bits = binary_repr[9:32]
            
            # 値を計算
            sign = int(sign_bit)
            exponent = int(exponent_bits, 2)
            mantissa = int(mantissa_bits, 2)
            
            # 表示
            st.code(f"16進数: 0x{hex_repr}")
            st.code(f"2進数:  {binary_repr}")
            
            # ビット分解表示
            st.markdown("**ビット構造:**")
            st.code(f"符号部: {sign_bit} ({'負' if sign else '正'})")
            st.code(f"指数部: {exponent_bits} (10進: {exponent})")
            st.code(f"仮数部: {mantissa_bits}")
            
# 値の計算過程を段階的に表示
            st.markdown("### 🧮 計算過程")
            
            # ステップ1: 符号部の処理
            with st.expander("ステップ1: 符号部の処理", expanded=True):
                st.markdown(f"""
                **符号ビット**: `{sign_bit}`
                - 0 = 正の数
                - 1 = 負の数
                """)
                if sign:
                    st.code("符号: 負 (-)")
                else:
                    st.code("符号: 正 (+)")
            
            # ステップ2: 指数部の処理
            with st.expander("ステップ2: 指数部の処理", expanded=True):
                st.markdown(f"""
                **指数部ビット**: `{exponent_bits}` = {exponent} (10進数)
                
                **バイアス計算**:
                """)
                
                if exponent == 0:
                    st.code("指数部 = 0 → ゼロまたは非正規化数")
                    actual_exponent = -126
                elif exponent == 255:
                    st.code("指数部 = 255 → 無限大またはNaN")
                    actual_exponent = None
                else:
                    actual_exponent = exponent - 127
                    st.code(f"実際の指数 = {exponent} - 127 = {actual_exponent}")
                    st.code(f"指数の倍率 = 2^{actual_exponent} = {2**actual_exponent:.6f}")
            
            # ステップ3: 仮数部の処理
            with st.expander("ステップ3: 仮数部の処理", expanded=True):
                st.markdown(f"""
                **仮数部ビット**: `{mantissa_bits}`
                **10進値**: {mantissa}
                """)
                
                if exponent == 0 and mantissa == 0:
                    st.code("仮数部 = 0 → ゼロ")
                    mantissa_value = 0
                elif exponent == 0:
                    mantissa_value = mantissa / (2**23)
                    st.code(f"非正規化数: 仮数値 = {mantissa} ÷ 2^23 = {mantissa_value:.6f}")
                    st.info("非正規化数では暗黙の1がありません")
                elif exponent == 255:
                    st.code("特殊値のため仮数値は計算不要")
                    mantissa_value = None
                else:
                    mantissa_value = 1 + mantissa / (2**23)
                    fraction_part = mantissa / (2**23)
                    st.code(f"仮数値 = 1 + ({mantissa} ÷ 2^23)")
                    st.code(f"仮数値 = 1 + {fraction_part:.6f} = {mantissa_value:.6f}")
                    st.info("正規化数では暗黙の1を追加します")
            
            # ステップ4: 最終値の計算
            with st.expander("ステップ4: 最終値の計算", expanded=True):
                st.markdown("""
                **IEEE 754 計算式**: `(-1)^符号 × 仮数値 × 2^実際の指数`
                """)
                
                if exponent == 0 and mantissa == 0:
                    if sign:
                        st.success("最終値: -0.0 (負のゼロ)")
                    else:
                        st.success("最終値: +0.0 (正のゼロ)")
                elif exponent == 255:
                    if mantissa == 0:
                        if sign:
                            st.error("最終値: -∞ (負の無限大)")
                        else:
                            st.error("最終値: +∞ (正の無限大)")
                    else:
                        st.error("最終値: NaN (非数)")
                else:
                    if exponent == 0:
                        st.warning("非正規化数")
                        calculated_value = (-1)**sign * mantissa_value * (2**actual_exponent)
                    else:
                        calculated_value = (-1)**sign * mantissa_value * (2**actual_exponent)
                    
                    sign_str = "-" if sign else "+"
                    st.code(f"最終値 = ({sign_str}1) × {mantissa_value:.6f} × 2^{actual_exponent}")
                    st.code(f"最終値 = ({sign_str}1) × {mantissa_value:.6f} × {2**actual_exponent:.6f}")
                    st.success(f"最終値: {calculated_value}")
                    
                    # 入力値との比較
                    st.info(f"入力値: {decimal_input}")
                    if abs(calculated_value - decimal_input) < 1e-6:
                        st.success("✓ 計算が正確です！")
                    else:
                        st.warning(f"⚠️ 浮動小数点の精度限界により微小な誤差があります")
                
        except Exception as e:
            st.error(f"エラー: {e}")

with tab2:
    st.markdown("### 📥 32ビット2進数を入力")
    
    col1, col2 = st.columns([1, 2])
    
    with col1:
        binary_input = st.text_input(
            "32ビットの2進数を入力",
            value="01000000010010010000111111011011",
            max_chars=32
        )
        
        if len(binary_input) != 32:
            st.error("32ビットで入力してください")
        elif not all(c in '01' for c in binary_input):
            st.error("0と1のみで入力してください")
        else:
            st.success("✓ 正しい形式です")
    
    with col2:
        if len(binary_input) == 32 and all(c in '01' for c in binary_input):
            st.markdown("### 📊 変換結果")
            
            # 各部分を抽出
            sign_bit = binary_input[0]
            exponent_bits = binary_input[1:9]
            mantissa_bits = binary_input[9:32]
            
            sign = int(sign_bit)
            exponent = int(exponent_bits, 2)
            mantissa = int(mantissa_bits, 2)
            
            # 16進数変換
            hex_value = hex(int(binary_input, 2))[2:].upper().zfill(8)
            
            st.code(f"16進数: 0x{hex_value}")
            
            # ビット分解表示
            st.markdown("**ビット構造:**")
            st.code(f"符号部: {sign_bit} ({'負' if sign else '正'})")
            st.code(f"指数部: {exponent_bits} (10進: {exponent})")
            st.code(f"仮数部: {mantissa_bits}")
            
            # 浮動小数点値を計算
            try:
                bytes_data = struct.pack('>I', int(binary_input, 2))
                float_value = struct.unpack('>f', bytes_data)[0]
                
                st.success(f"浮動小数点値: {float_value}")
                
                # 計算過程の表示
                if exponent == 0 and mantissa == 0:
                    st.info("ゼロ")
                elif exponent == 255:
                    if mantissa == 0:
                        st.error("無限大")
                    else:
                        st.error("NaN (非数)")
                else:
                    if exponent == 0:
                        actual_exponent = -126
                        mantissa_value = mantissa / (2**23)
                        st.warning("非正規化数")
                    else:
                        actual_exponent = exponent - 127
                        mantissa_value = 1 + mantissa / (2**23)
                    
                    st.info(f"実際の指数: {actual_exponent}")
                    st.info(f"仮数値: {mantissa_value:.6f}")
                    
            except Exception as e:
                st.error(f"変換エラー: {e}")

st.markdown("---")

# 比較表示セクション
st.subheader("📋 様々な数値の表現")

sample_numbers = [0.0, 1.0, -1.0, 0.5, 0.1, 3.14159, 42.0, -42.0, 0.000001]

comparison_data = []
for num in sample_numbers:
    try:
        packed = struct.pack('>f', num)
        hex_repr = packed.hex().upper()
        binary_repr = ''.join(format(byte, '08b') for byte in packed)
        
        sign_bit = binary_repr[0]
        exponent_bits = binary_repr[1:9]
        mantissa_bits = binary_repr[9:32]
        
        comparison_data.append({
            "10進数": num,
            "16進数": f"0x{hex_repr}",
            "符号": sign_bit,
            "指数部": exponent_bits,
            "仮数部": mantissa_bits[:12] + "..."
        })
    except:
        comparison_data.append({
            "10進数": num,
            "16進数": "Error",
            "符号": "-",
            "指数部": "-",
            "仮数部": "-"
        })

st.dataframe(comparison_data, use_container_width=True)

st.markdown("---")

# 精度の限界
st.subheader("⚠️ 浮動小数点数の限界")

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    ### 🚨 精度の問題
    
    浮動小数点数は有限のビット数で表現するため、完全な精度は保証されません。
    """)
    
    st.code("""
    # Python での例
    >>> 0.1 + 0.2
    0.30000000000000004
    
    >>> 0.1 + 0.2 == 0.3
    False
    """)
    
    # 実際に計算して表示
    result = 0.1 + 0.2
    st.code(f"実際の計算結果: {result}")
    st.code(f"期待値との比較: {result} == 0.3 → {result == 0.3}")

with col2:
    st.markdown("""
    ### 🎯 対策方法
    
    浮動小数点数を扱う際の注意点と対策：
    """)
    
    st.code("""
    # 等価比較の対策
    import math
    
    def float_equal(a, b, tolerance=1e-9):
        return abs(a - b) < tolerance
    
    # 使用例
    result = 0.1 + 0.2
    print(float_equal(result, 0.3))  # True
    """)
    
    # 実際にテスト
    def float_equal(a, b, tolerance=1e-9):
        return abs(a - b) < tolerance
    
    result = 0.1 + 0.2
    st.code(f"改良版比較: {float_equal(result, 0.3)}")

st.markdown("---")

# 特殊値
st.subheader("🔍 特殊値")

col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("### ∞ 無限大")
    
    inf_pos = float('inf')
    inf_neg = float('-inf')
    
    packed_pos = struct.pack('>f', inf_pos)
    packed_neg = struct.pack('>f', inf_neg)
    
    binary_pos = ''.join(format(byte, '08b') for byte in packed_pos)
    binary_neg = ''.join(format(byte, '08b') for byte in packed_neg)
    
    st.code(f"+∞: {binary_pos}")
    st.code(f"-∞: {binary_neg}")
    
    st.info("指数部が全て1、仮数部が全て0")

with col2:
    st.markdown("### 🚫 NaN")
    
    nan_val = float('nan')
    packed_nan = struct.pack('>f', nan_val)
    binary_nan = ''.join(format(byte, '08b') for byte in packed_nan)
    
    st.code(f"NaN: {binary_nan}")
    st.info("指数部が全て1、仮数部が0以外")
    
    st.markdown("**NaNが発生する例：**")
    st.code("0.0 / 0.0")
    st.code("inf - inf")
    st.code("sqrt(-1)")

with col3:
    st.markdown("### 🔄 ゼロ")
    
    zero_pos = 0.0
    zero_neg = -0.0
    
    packed_zero_pos = struct.pack('>f', zero_pos)
    packed_zero_neg = struct.pack('>f', zero_neg)
    
    binary_zero_pos = ''.join(format(byte, '08b') for byte in packed_zero_pos)
    binary_zero_neg = ''.join(format(byte, '08b') for byte in packed_zero_neg)
    
    st.code(f"+0: {binary_zero_pos}")
    st.code(f"-0: {binary_zero_neg}")
    
    st.info("符号部のみが異なる")
    st.code(f"+0 == -0: {zero_pos == zero_neg}")

st.markdown("---")

# 実践問題
st.subheader("🧩 実践問題")

with st.expander("問題1: 2.0の表現"):
    st.markdown("""
    **問題**: 数値 2.0 をIEEE 754形式で表現してください。
    
    ヒント：
    - 2.0 = 1.0 × 2¹
    - 符号部：0（正数）
    - 指数部：1 + 127 = 128
    - 仮数部：1.0の小数部分は0
    """)
    
    if st.button("答えを見る", key="fp_q1"):
        packed_2 = struct.pack('>f', 2.0)
        binary_2 = ''.join(format(byte, '08b') for byte in packed_2)
        hex_2 = packed_2.hex().upper()
        
        st.success(f"""
        **答え**: 
        - 2進数: {binary_2}
        - 16進数: 0x{hex_2}
        - 符号部: 0
        - 指数部: 10000000 (128)
        - 仮数部: 00000000000000000000000
        """)

with st.expander("問題2: 0.5の表現"):
    st.markdown("""
    **問題**: 数値 0.5 をIEEE 754形式で表現してください。
    
    ヒント：
    - 0.5 = 1.0 × 2⁻¹
    - 符号部：0（正数）
    - 指数部：-1 + 127 = 126
    - 仮数部：1.0の小数部分は0
    """)
    
    if st.button("答えを見る", key="fp_q2"):
        packed_half = struct.pack('>f', 0.5)
        binary_half = ''.join(format(byte, '08b') for byte in packed_half)
        hex_half = packed_half.hex().upper()
        
        st.success(f"""
        **答え**: 
        - 2進数: {binary_half}
        - 16進数: 0x{hex_half}
        - 符号部: 0
        - 指数部: 01111110 (126)
        - 仮数部: 00000000000000000000000
        """)

st.markdown("---")

# 学習ポイント
st.subheader("📚 学習ポイント")

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    ### 🎯 重要なポイント
    
    1. **有限精度**: 浮動小数点数は近似値
    2. **特殊値**: 無限大、NaN、±0の存在
    3. **正規化**: 1.xxxxx × 2^n の形式
    4. **バイアス**: 指数部に127を加算
    5. **暗黙の1**: 仮数部の最上位ビットは省略
    """)

with col2:
    st.markdown("""
    ### 💡 プログラミングでの注意
    
    1. **等価比較**: 直接==は使わない
    2. **累積誤差**: 繰り返し計算で誤差蓄積
    3. **アンダーフロー**: 非常に小さい値の扱い
    4. **オーバーフロー**: 無限大への変換
    5. **NaN伝播**: NaNは他の値に伝播
    """)

st.success("🎉 浮動小数点数の仕組みを理解して、より正確なプログラムを作成しましょう！")

st.markdown("---")

# 参考資料
with st.expander("📖 参考資料・詳細情報"):
    st.markdown("""
    ### 🔗 参考リンク
    
    - [IEEE 754 標準](https://en.wikipedia.org/wiki/IEEE_754)
    - [What Every Programmer Should Know About Floating-Point Arithmetic](https://floating-point-gui.de/)
    - [Python decimal モジュール](https://docs.python.org/3/library/decimal.html)
    
    ### 📊 より詳しい形式
    
    - **単精度 (32ビット)**: 符号1 + 指数8 + 仮数23
    - **倍精度 (64ビット)**: 符号1 + 指数11 + 仮数52
    - **半精度 (16ビット)**: 符号1 + 指数5 + 仮数10
    
    ### 🧮 数学的背景
    
    値の計算式：`(-1)^S × (1 + M) × 2^(E-bias)`
    
    - S: 符号ビット
    - M: 仮数部の値（0.0 ≤ M < 1.0）
    - E: 指数部の値
    - bias: バイアス値（単精度では127）
    """)