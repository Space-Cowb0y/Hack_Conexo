import requests
from bs4 import BeautifulSoup
import json
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
main_find = '<script defer="defer"'
html = requests.get("https://conexo.ws",verify=False).content
soup = BeautifulSoup(html, 'html.parser')
html = soup.prettify()
for i in html:
    if i.__contains__(main_find):
        print(i)
    
    
    
html = requests.get("https://conexo.ws/static/js/main.b951ff3d.js",verify=False).content 

soup = BeautifulSoup(html, 'html.parser')

html = soup.prettify()

index_S = html.find("ir=JSON.parse('") + len("ir=JSON.parse('")
index_E = html.find("'),ur={")
resposta = html[index_S:index_E]

y = json.dumps(resposta, separators=(",", ":"))    
with open("C:\\Users\\e5693423\\OneDrive - FIS\\Documents\\proj\\campeonato_conexo\\data.json", "w") as text_file:
    a = json.dump(resposta, text_file, indent=1)
            

