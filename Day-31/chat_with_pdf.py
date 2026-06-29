import streamlit as st
from pypdf import PdfReader
import ollama

st.title("Chat with PDF")
st.write("Upload a pdf to start chatting with it using ollama model")

file = st.file_uploader("Choose a pdf file", type="pdf")
pdf_text = ""

if file:
    try: 
        reader = PdfReader(file)
        for page in reader.pages:
            pdf_text += page.extract_text() or ""
        st.success("Pdf loaded successfully!")
    except Exception as e:
        st.error(f"Error reading pdf file: {e}")

if pdf_text:
    user_query = st.text_input("Ask a question about the pdf content:")
    if user_query:
        with st.spinner("Fetching from pdf..."):
            user_prompt = f"Context: {pdf_text[:3000]}\n\nQuestion: {user_query}"
            try:
                messages =[
                    {"role": "system", "content": "You are a helpful assistant who perform a deep thorough analysis on the pdf content and answer my questions."},
                    {"role": "user", "content": user_prompt}
                ]

                response = ollama.chat(
                    model="llama3.2:1b",
                    messages=messages
                )

                results = response["message"]["content"]

                st.markdown(f"**Answer:** {results}")
            except Exception as e:
                st.error(f"Error: Unable to process your query.")