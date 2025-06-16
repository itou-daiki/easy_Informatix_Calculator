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
    st.subheader("🔢 10進数から浮動小数点数")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # セッション状態の初期化
        if 'decimal_input' not in st.session_state:
            st.session_state.decimal_input = 3.14
        
        decimal_input = st.number_input("浮動小数点数を入力", value=st.session_state.decimal_input, format="%.6f")
        st.session_state.decimal_input = decimal_input
        
        # 指数表記の分解表示
        if decimal_input != 0:
            sign_str = "-" if decimal_input < 0 else ""
            abs_val = abs(decimal_input)
            
            if abs_val >= 1:
                exponent = int(math.floor(math.log10(abs_val)))
                mantissa = abs_val / (10 ** exponent)
            elif abs_val < 1:
                exponent = int(math.floor(math.log10(abs_val)))
                mantissa = abs_val / (10 ** exponent)
            
            st.markdown("### 📊 指数表記")
            st.code(f"{decimal_input}")
            st.code(f"= {sign_str}{mantissa:.2f} × 10^{exponent}")
        
    
    with col2:
        # 右側は空のスペースまたは簡単な説明のみ
        pass

with tab3:
    st.subheader("💻 2進数から浮動小数点数")
    
    col1, col2 = st.columns(2)
    
    with col1:
        binary_input = st.text_input(
            "32ビット2進数を入力",
            value="01000000010010010000111111011011",
            max_chars=32
        )
        
        if len(binary_input) != 32:
            st.error("32ビットで入力してください")
        elif not all(c in '01' for c in binary_input):
            st.error("0と1のみで入力してください")
    
    with col2:
        if len(binary_input) == 32 and all(c in '01' for c in binary_input):
            sign_bit = binary_input[0]
            exponent_bits = binary_input[1:9]
            mantissa_bits = binary_input[9:32]
            
            sign = int(sign_bit)
            exponent = int(exponent_bits, 2)
            mantissa = int(mantissa_bits, 2)
            
            st.code(f"符号部: {sign_bit} ({'負' if sign else '正'})")
            st.code(f"指数部: {exponent_bits} ({exponent})")
            st.code(f"仮数部: {mantissa_bits[:12]}...")
            
            try:
                bytes_data = struct.pack('>I', int(binary_input, 2))
                float_value = struct.unpack('>f', bytes_data)[0]
                st.success(f"浮動小数点値: {float_value}")
                
                if exponent != 0 and exponent != 255:
                    actual_exp = exponent - 127
                    st.info(f"実際の指数: {actual_exp}")
            except:
                st.error("変換エラー")
    
    # バイアス計算の例
    st.subheader("⚖️ バイアス計算")
    exponent_demo = st.slider("指数部の値", 1, 254, 127)
    actual_exponent = exponent_demo - 127
    st.code(f"指数部: {exponent_demo} → 実際の指数: {exponent_demo} - 127 = {actual_exponent}")
    st.code(f"倍率: 2^{actual_exponent} = {2**actual_exponent:.6f}")

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