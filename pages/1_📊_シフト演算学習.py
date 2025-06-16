import streamlit as st
import numpy as np

st.set_page_config(
    page_title="シフト演算学習",
    page_icon="📊",
    layout="wide"
)

st.title("📊 シフト演算学習")

st.markdown("""
## 🔄 シフト演算とは？

**シフト演算**は、2進数の桁を左右に移動させる演算です。コンピュータでは非常に高速に実行できる重要な演算です。

- **左シフト (`<<`)**：ビットを左に移動 → 2の累乗倍の乗算と同じ効果
- **右シフト (`>>`)**：ビットを右に移動 → 2の累乗倍の除算と同じ効果
""")

st.markdown("---")

# 入力セクション
st.subheader("🎯 実際に試してみよう！")

col1, col2 = st.columns(2)

with col1:
    st.markdown("### 📥 入力")
    
    # 数値入力
    number = st.number_input(
        "数値を入力してください（0-255）",
        min_value=0,
        max_value=255,
        value=10,
        step=1
    )
    
    # シフト演算の種類選択
    shift_type = st.selectbox(
        "シフト演算の種類",
        ["左シフト (<<)", "右シフト (>>)"]
    )
    
    # シフト量
    shift_amount = st.slider(
        "シフト量",
        min_value=1,
        max_value=7,
        value=1
    )

with col2:
    st.markdown("### 📊 結果")
    
    # 計算実行
    if shift_type == "左シフト (<<)":
        result = number << shift_amount
        operation_symbol = "<<"
        explanation = f"{number} × 2^{shift_amount} = {number} × {2**shift_amount} = {result}"
    else:
        result = number >> shift_amount
        operation_symbol = ">>"
        explanation = f"{number} ÷ 2^{shift_amount} = {number} ÷ {2**shift_amount} = {result}"
    
    st.info(f"**計算式**: {number} {operation_symbol} {shift_amount} = {result}")
    st.success(f"**数学的意味**: {explanation}")

st.markdown("---")

# 2進数表示セクション
st.subheader("🔢 2進数での表現")

col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("### 🔵 元の数値")
    binary_original = format(number, '08b')
    st.code(f"10進数: {number}")
    st.code(f"2進数: {binary_original}")
    
    # ビット表示（視覚的）
    st.markdown("**ビット表示:**")
    bit_display = ""
    for i, bit in enumerate(binary_original):
        if i == 4:
            bit_display += " "
        bit_display += f"[{bit}]"
    st.markdown(f"`{bit_display}`")

with col2:
    st.markdown("### ⚡ シフト演算")
    
    if shift_type == "左シフト (<<)":
        st.markdown(f"**{shift_amount}ビット左シフト**")
        
        # シフト過程の表示
        shifted_binary = format(number << shift_amount, '08b')
        
        st.markdown("**シフト過程:**")
        original_padded = binary_original + "0" * shift_amount
        st.code(f"元:     {binary_original}")
        st.code(f"シフト: {shifted_binary}")
        
        if len(shifted_binary) > 8:
            st.warning("⚠️ 8ビットを超えました（オーバーフロー）")
            st.code(f"実際:   {shifted_binary[-8:]}")
    else:
        st.markdown(f"**{shift_amount}ビット右シフト**")
        
        # シフト過程の表示
        shifted_binary = format(number >> shift_amount, '08b')
        
        st.markdown("**シフト過程:**")
        st.code(f"元:     {binary_original}")
        st.code(f"シフト: {shifted_binary.zfill(8)}")

with col3:
    st.markdown("### 🎯 結果")
    result_binary = format(result, '08b')
    st.code(f"10進数: {result}")
    st.code(f"2進数: {result_binary}")
    
    # ビット表示（視覚的）
    st.markdown("**ビット表示:**")
    bit_display_result = ""
    for i, bit in enumerate(result_binary):
        if i == 4:
            bit_display_result += " "
        bit_display_result += f"[{bit}]"
    st.markdown(f"`{bit_display_result}`")

st.markdown("---")

# 複数例の表示
st.subheader("📋 様々な例")

examples_data = []
test_numbers = [1, 2, 4, 8, 16, 32]

for num in test_numbers:
    if shift_type == "左シフト (<<)":
        shifted = num << shift_amount
        math_result = num * (2 ** shift_amount)
    else:
        shifted = num >> shift_amount
        math_result = num // (2 ** shift_amount)
    
    examples_data.append({
        "元の数値 (10進)": num,
        "元の数値 (2進)": format(num, '08b'),
        f"{shift_type} {shift_amount}": shifted,
        "結果 (2進)": format(shifted, '08b'),
        "数学的計算": math_result
    })

st.dataframe(examples_data, use_container_width=True)

st.markdown("---")

# 学習ポイント
st.subheader("📚 学習ポイント")

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    ### 🎯 左シフト演算の特徴
    
    - **効果**: 2の累乗倍の乗算
    - **速度**: 通常の乗算より高速
    - **用途**: 
      - 高速な乗算計算
      - ビットフィールドの操作
      - メモリアドレス計算
    
    **例**: `5 << 2` = 5 × 4 = 20
    """)

with col2:
    st.markdown("""
    ### 🎯 右シフト演算の特徴
    
    - **効果**: 2の累乗倍の除算（整数除算）
    - **速度**: 通常の除算より高速
    - **注意**: 小数点以下は切り捨て
    - **用途**:
      - 高速な除算計算
      - ビットマスクの作成
      - 配列インデックス計算
    
    **例**: `20 >> 2` = 20 ÷ 4 = 5
    """)

st.info("💡 **プログラミングのコツ**: シフト演算は2の累乗での乗除算を高速化したい時に使用します！")

st.markdown("---")

# 実践問題
st.subheader("🧩 実践問題")

with st.expander("問題1: 左シフト演算"):
    st.markdown("""
    **問題**: 数値 6 を 3ビット左シフトした結果は？
    
    - 6の2進数表現: 00000110
    - 3ビット左シフト後: ?
    - 10進数での結果: ?
    """)
    
    if st.button("答えを見る", key="q1"):
        st.success("""
        **答え**: 
        - 6 << 3 = 48
        - 2進数: 00110000
        - 計算: 6 × 2³ = 6 × 8 = 48
        """)

with st.expander("問題2: 右シフト演算"):
    st.markdown("""
    **問題**: 数値 56 を 2ビット右シフトした結果は？
    
    - 56の2進数表現: 00111000
    - 2ビット右シフト後: ?
    - 10進数での結果: ?
    """)
    
    if st.button("答えを見る", key="q2"):
        st.success("""
        **答え**: 
        - 56 >> 2 = 14
        - 2進数: 00001110
        - 計算: 56 ÷ 2² = 56 ÷ 4 = 14
        """)

st.markdown("---")

st.success("🎉 シフト演算をマスターして、効率的なプログラミングを身につけましょう！")