import requests
from bs4 import BeautifulSoup

url = "https://karunkarthik-portfolio.netlify.app/"

headers = {
    "user-agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)

data = BeautifulSoup(response.text, "html.parser")
skill_area = data.find("div", class_="skill_area")
skills = skill_area.find_all("div", class_="single_skill")

for skill in skills:
    title = skill.find("span")
    desc = skill.find("p")
    print("__________________________________")
    print(f"Title: {title.text.strip()}")
    print(f"Description: {desc.text.strip()}")
    print("__________________________________")