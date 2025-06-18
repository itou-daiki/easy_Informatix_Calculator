import streamlit as st

st.set_page_config(
    page_title="シフト演算学習",
    page_icon="📊",
    layout="wide"
)

st.title("📊 シフト演算学習")

tab1, tab2, tab3 = st.tabs(["📚 説明", "💻 シフト演算体験", "🧩 練習問題"])

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
    st.subheader("💻 シフト演算体験")
    
    # 入力セクション
    col1, col2 = st.columns(2)
    
    with col1:
        binary_num = st.number_input("数値 (0-255)", 0, 255, 10, key="bin")
        binary_shift_type = st.selectbox("演算", ["左シフト", "右シフト"], key="bin_type")
        
    with col2:
        binary_shift_amount = st.number_input("シフト量", 1, 7, 1, key="bin_shift")
    
    # 計算実行
    if binary_shift_type == "左シフト":
        binary_result = binary_num << binary_shift_amount
        operation_symbol = "<<"
    else:
        binary_result = binary_num >> binary_shift_amount
        operation_symbol = ">>"
    
    st.markdown("---")
    
    # ステップバイステップ説明
    st.subheader("📋 ステップバイステップ解説")
    
    # ステップ1: 元の数値の確認
    st.markdown("### ステップ1: 元の数値を2進数で表現")
    step1_data = [{
        "項目": "10進数",
        "値": f"{binary_num}",
        "説明": "入力された数値"
    }, {
        "項目": "2進数",
        "値": f"{format(binary_num, '08b')}",
        "説明": "8ビットで表現した2進数"
    }, {
        "項目": "ビット位置",
        "値": "76543210",
        "説明": "各ビットの位置（右から0番目）"
    }]
    st.dataframe(step1_data, use_container_width=True)
    
    # ステップ2: シフト演算の実行
    st.markdown(f"### ステップ2: {binary_shift_type}を{binary_shift_amount}ビット実行")
    
    # 上付き文字マッピング
    superscript_map = {'0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'}
    shift_super = ''.join(superscript_map.get(c, c) for c in str(binary_shift_amount))
    
    if binary_shift_type == "左シフト":
        st.markdown(f"""
        **左シフト (<<)** は、すべてのビットを :blue[**左に移動**] させます：
        - 右側の空いた部分は :green[**0**] で埋めます
        - 左端からはみ出したビットは :red[**消失**] します
        - 数学的効果: **元の値 × 2{shift_super} = {binary_num} × {2**binary_shift_amount} = {binary_result}**
        """)
    else:
        st.markdown(f"""
        **右シフト (>>)** は、すべてのビットを :blue[**右に移動**] させます：
        - 左側の空いた部分は :green[**0**] で埋めます
        - 右端からはみ出したビットは :red[**消失**] します
        - 数学的効果: **元の値 ÷ 2{shift_super} = {binary_num} ÷ {2**binary_shift_amount} = {binary_result}**
        """)
    
    # ステップ3: ビット移動の可視化（データフレーム）
    st.markdown("### ステップ3: ビット移動の可視化")
    
    # 移動前後の比較データ
    original_bits = format(binary_num, '08b')
    result_bits = format(binary_result, '08b')
    
    bit_comparison_data = []
    
    # ヘッダー行
    bit_comparison_data.append({
        "状態": "移動前",
        "ビット7": original_bits[0],
        "ビット6": original_bits[1],
        "ビット5": original_bits[2],
        "ビット4": original_bits[3],
        "ビット3": original_bits[4],
        "ビット2": original_bits[5],
        "ビット1": original_bits[6],
        "ビット0": original_bits[7],
        "10進数": f"{binary_num}"
    })
    
    bit_comparison_data.append({
        "状態": f"{binary_shift_type}後",
        "ビット7": result_bits[0],
        "ビット6": result_bits[1],
        "ビット5": result_bits[2],
        "ビット4": result_bits[3],
        "ビット3": result_bits[4],
        "ビット2": result_bits[5],
        "ビット1": result_bits[6],
        "ビット0": result_bits[7],
        "10進数": f"{binary_result}"
    })
    
    # データフレームにスタイリングを適用
    import pandas as pd
    df = pd.DataFrame(bit_comparison_data)
    
    # ビット位置に応じてセルに色を付ける関数
    def highlight_bits(val):
        if val == '1':
            return 'background-color: #90EE90'  # 薄い緑
        elif val == '0':
            return 'background-color: #FFB6C1'  # 薄いピンク
        else:
            return ''
    
    # ビット列のみにスタイリングを適用
    bit_columns = ['ビット7', 'ビット6', 'ビット5', 'ビット4', 'ビット3', 'ビット2', 'ビット1', 'ビット0']
    styled_df = df.style.applymap(highlight_bits, subset=bit_columns)
    
    st.dataframe(styled_df, use_container_width=True)
    
    # ステップ4: 結果の確認
    st.markdown("### ステップ4: 結果の確認")
    result_data = [{
        "演算": f"{binary_num} {operation_symbol} {binary_shift_amount}",
        "2進数": f"{format(binary_num, '08b')} → {format(binary_result, '08b')}",
        "10進数": f"{binary_num} → {binary_result}",
        "数学的効果": f"×{2**binary_shift_amount}" if binary_shift_type == "左シフト" else f"÷{2**binary_shift_amount}"
    }]
    st.dataframe(result_data, use_container_width=True)
    
    # 浮動小数点数との関連性
    st.markdown("---")
    st.subheader("🌊 浮動小数点数での応用")
    
    if binary_shift_type == "左シフト":
        st.info("""
        💡 **浮動小数点数の正規化での応用:**
        - 0.0001101₂ のような小数を正規化する際に左シフトを使用
        - 小数点を右に移動させることで 1.101 × 2⁻⁴ の形にする
        - コンピュータ内部では実際にビットを左にシフトして処理
        """)
    else:
        st.info("""
        💡 **浮動小数点数での右シフト応用:**
        - 非正規化数の処理で使用される場合がある
        - オーバーフロー時の調整に利用
        - 精度の調整や丸め処理で活用
        """)

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