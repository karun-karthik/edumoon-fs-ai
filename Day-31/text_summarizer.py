import streamlit as st
from newspaper import Article
import ollama


def summarize_ollama(text):
    messages =[
        {"role": "system", "content": "You are a highly capable text summarizer. Provide a concise and accurate summary of the following text."},
        {"role": "user", "content": text}
    ]

    response = ollama.chat(
        model="llama3.2:1b",
        messages=messages
    )

    return response["message"]["content"]


st.title("Text summarizer")
st.write("Enter a news article url to summarize it using a local ollama model")

url = st.text_input("Enter a news article url")

if url:
    try:
        article = Article(url)
        article.download()
        article.parse()
        st.title("Title")
        st.write(article.title)
        st.subheader("Extracted text preview: ")
        st.write(article.text[:200] + "...")

        if st.button("Summarize"):
            with st.spinner("Processing with Ollama..."):
                try:
                    summary = summarize_ollama(article.text[:3000])
                    st.subheader("Summary")
                    st.write(summary)
                except Error as e:
                    st.error(f"Error: Unable to summarize the article. Details: {e}")
    except Exception as e:
        st.error(f"Error processing article: {e}")