import streamlit as st

st.set_page_config(
    page_title="シフト演算・浮動小数点数学習アプリ",
    page_icon="🔢",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("🔢 シフト演算・浮動小数点数学習アプリ")

# 進捗表示
with st.container():
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("📚 学習コンテンツ", "2種類", "シフト演算・浮動小数点数")
    
    with col2:
        st.metric("🎯 対応形式", "16/32/64bit", "IEEE 754標準")
    
    with col3:
        st.metric("🧩 練習問題", "7問", "段階的難易度")

st.markdown("---")

st.markdown("""
**高校生向け**のコンピュータ数値表現学習アプリです。
プログラミングやコンピュータサイエンスの基礎となる重要な概念を学びましょう。

### 📚 学習内容

**🔄 シフト演算**: ビットを左右に移動させる高速演算（乗除算の高速化に活用）  
**🌊 浮動小数点数**: 小数や大きな数を効率的に表現する方法（IEEE 754標準）

### 🎯 学習目標
- コンピュータの内部でどのように数値が処理されるかを理解
- プログラミングでの数値計算の仕組みを把握
- ハードウェアとソフトウェアの関係を学習
""")

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    ### 🔄 シフト演算学習
    - 基本概念: `<<` (左シフト), `>>` (右シフト)
    - 10進数と2進数での計算体験
    - 浮動小数点数での実用例
    - 例: `5 << 1 = 10` (5 × 2¹)
    """)
    
    if st.button("🚀 シフト演算を学ぶ", use_container_width=True):
        st.switch_page("pages/1_📊_シフト演算学習.py")

with col2:
    st.markdown("""
    ### 🌊 浮動小数点数学習
    - IEEE 754標準の詳細理解
    - 段階的な変換プロセス（0→④のステップ）
    - 16bit/32bit/64bit対応（半精度～倍精度）
    - 正・負の実数に完全対応
    - 例: 0.1015625 → IEEE 754形式
    """)
    
    if st.button("🚀 浮動小数点数を学ぶ", use_container_width=True):
        st.switch_page("pages/2_🔬_浮動小数点数学習.py")

# サイドバーに学習ガイド
with st.sidebar:
    st.markdown("### 📖 学習ガイド")
    st.markdown("""
    **推奨学習順序:**
    1. 🔄 **シフト演算** から開始
    2. 🌊 **浮動小数点数** で応用を学習
    3. 両者の関係性を理解
    
    **学習のコツ:**
    - まず具体例で試してみる
    - 2進数表現を意識する
    - 実際の計算機での応用を考える
    """)
    
    st.markdown("### 🎓 対象レベル")
    st.markdown("""
    - **高校生**: 情報科目の発展学習
    - **大学生**: コンピュータサイエンス基礎
    - **プログラマー**: 低レベル処理の理解
    """)

st.info("💡 左のサイドバーから学習したいページを選択するか、上のボタンから直接アクセスできます")

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