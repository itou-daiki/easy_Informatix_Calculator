import streamlit as st

st.set_page_config(
    page_title="シフト演算学習",
    page_icon="📊",
    layout="wide"
)

st.title("📊 シフト演算学習")

tab1, tab2, tab3 = st.tabs(["📚 説明", "💻 2進数", "🧩 練習問題"])

with tab1:
    st.subheader("🔄 シフト演算とは？")
    
    st.markdown("""
    コンピュータでビットを左右に移動させる高速演算です。
    
    ### 基本概念
    - **左シフト (`<<`)**: ビットを左に移動 → 2の累乗倍
    - **右シフト (`>>`)**: ビットを右に移動 → 2の累乗で除算
    """)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        ### 左シフト例
        ```
        5 << 1 = 10  (5 × 2¹)
        5 << 2 = 20  (5 × 2²)
        ```
        """)
    
    with col2:
        st.markdown("""
        ### 右シフト例
        ```
        20 >> 1 = 10  (20 ÷ 2¹)
        20 >> 2 = 5   (20 ÷ 2²)
        ```
        """)
    
    st.info("💡 シフト演算は通常の乗除算より高速です")

with tab2:
    st.subheader("💻 2進数でシフト演算")
    
    col1, col2 = st.columns(2)
    
    with col1:
        binary_num = st.number_input("数値 (0-255)", 0, 255, 10, key="bin")
        binary_shift_type = st.selectbox("演算", ["左シフト", "右シフト"], key="bin_type")
        
        binary_shift_amount = st.number_input("シフト量", 1, 7, 1, key="bin_shift")
    
    with col2:
        if binary_shift_type == "左シフト":
            binary_result = binary_num << binary_shift_amount
            operation_symbol = "<<"
        else:
            binary_result = binary_num >> binary_shift_amount
            operation_symbol = ">>"
        
        st.markdown("**計算結果:**")
        st.code(f"{binary_num} {operation_symbol} {binary_shift_amount} = {binary_result}")
        st.code(f"2進数: {format(binary_num, '08b')} → {format(binary_result, '08b')}")
        
        # 浮動小数点数での応用説明
        if binary_shift_type == "左シフト":
            st.info(f"💡 浮動小数点数では、正規化時に同じ左シフトの原理を使用します")
        else:
            st.info(f"💡 浮動小数点数では、非正規化数の処理で右シフトが使われることがあります")
    
    # ビット移動の視覚化
    st.subheader("🔍 ビット移動の可視化")
    
    original_bits = format(binary_num, '08b')
    result_bits = format(binary_result, '08b')
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("**元のビット**")
        bit_display = ""
        for i, bit in enumerate(original_bits):
            bit_display += f"[{bit}]"
            if i == 3:
                bit_display += " "
        st.markdown(f"`{bit_display}`")
    
    with col2:
        st.markdown(f"**{binary_shift_type}後**")
        bit_display_result = ""
        for i, bit in enumerate(result_bits):
            bit_display_result += f"[{bit}]"
            if i == 3:
                bit_display_result += " "
        st.markdown(f"`{bit_display_result}`")

with tab3:
    st.subheader("🧩 練習問題")
    
    with st.expander("問題1: 左シフト", expanded=True):
        st.markdown("**6 を 3ビット左シフトした結果は？**")
        
        col1, col2 = st.columns(2)
        with col1:
            answer1 = st.number_input("答え", 0, 1000, key="q1")
        with col2:
            if st.button("正解確認", key="check1"):
                correct = 6 << 3
                if answer1 == correct:
                    st.success(f"✓ 正解！ {correct}")
                    st.info("計算: 6 × 2³ = 6 × 8 = 48")
                else:
                    st.error(f"✗ 不正解。正解は {correct}")
    
    with st.expander("問題2: 右シフト"):
        st.markdown("**56 を 2ビット右シフトした結果は？**")
        
        col1, col2 = st.columns(2)
        with col1:
            answer2 = st.number_input("答え", 0, 100, key="q2")
        with col2:
            if st.button("正解確認", key="check2"):
                correct = 56 >> 2
                if answer2 == correct:
                    st.success(f"✓ 正解！ {correct}")
                    st.info("計算: 56 ÷ 2² = 56 ÷ 4 = 14")
                else:
                    st.error(f"✗ 不正解。正解は {correct}")
    
    with st.expander("問題3: 2進数シフト"):
        st.markdown("**2進数 `10110` を1ビット左シフトした結果は？**")
        
        col1, col2 = st.columns(2)
        with col1:
            answer3 = st.text_input("答え (2進数)", key="q3")
        with col2:
            if st.button("正解確認", key="check3"):
                original = int('10110', 2)  # 22
                result = original << 1      # 44
                correct_binary = format(result, 'b')
                
                if answer3 == correct_binary:
                    st.success(f"✓ 正解！ {correct_binary}")
                    st.info(f"10進数: {original} → {result}")
                else:
                    st.error(f"✗ 不正解。正解は {correct_binary}")