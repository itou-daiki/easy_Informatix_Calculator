import streamlit as st

st.set_page_config(
    page_title="シフト演算・浮動小数点数学習アプリ",
    page_icon="🔢",
    layout="wide"
)

st.title("🔢 シフト演算・浮動小数点数学習アプリ")

st.markdown("""
高校生向けのコンピュータ数値表現学習アプリです。

### 📚 学習内容

**🔄 シフト演算**: ビットを左右に移動させる高速演算  
**🌊 浮動小数点数**: 小数や大きな数を効率的に表現する方法
""")

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    ### シフト演算
    - 左シフト: `<<` (×2効果)
    - 右シフト: `>>` (÷2効果)
    - 例: `5 << 1 = 10`
    """)

with col2:
    st.markdown("""
    ### 浮動小数点数
    - 符号部 + 指数部 + 仮数部
    - IEEE 754標準
    - 例: 3.14 → 32ビット表現
    """)

st.info("💡 左のサイドバーから学習したいページを選択してください")