import requests
from bs4 import BeautifulSoup

URL = 'https://www.livescore.cz/yesterday.php'
page = requests.get(URL)
soup = BeautifulSoup(page.content, 'html.parser')
results = soup.find_all('tr', class_='match')
try:
    for res in results:
        if(res.find('td', class_="col-state").text == 'FT'):
            home = res.find('td', class_="col-home").find('a').text
            guest = res.find('td', class_="col-guest").find('a').text
            score = res.find('td', class_="col-score").find('a').text.split(":")
            if(score[0] > score[1]):
                result = "1"
            elif(score[1] > score[0]):
                result = "2"
            else:
                result = "X"
            total = "over" if int(score[0])+int(score[1])>2.5 else "under"

            print(home+"-"+guest+"-"+result+"-"+total)
    URL = 'https://www.livescore.cz/index.php'
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    results = soup.find_all('tr', class_='match')
    for res in results:
        if(res.find('td', class_="col-state").text == 'FT'):
            home = res.find('td', class_="col-home").find('a').text
            guest = res.find('td', class_="col-guest").find('a').text
            score = res.find('td', class_="col-score").find('a').text.split(":")
            if(score[0] > score[1]):
                result = "1"
            elif(score[1] > score[0]):
                result = "2"
            else:
                result = "X"
            total = "over" if int(score[0])+int(score[1])>2.5 else "under"
            print(home+"-"+guest+"-"+result+"-"+total)
except Exception:
    print("ooops")