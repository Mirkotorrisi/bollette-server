# import requests
# from bs4 import BeautifulSoup

# URL = 'https://www.livescore.cz/yesterday.php'
# page = requests.get(URL)
# soup = BeautifulSoup(page.content, 'html.parser')
# results = soup.find_all('tr', class_='match')
# for res in results:
#     home = res.find('td', class_="col-home").find('a').text
#     guest = res.find('td', class_="col-guest").find('a').text
#     score = res.find('td', class_="col-score").find('a').text.split(":")
#     if(score[0] > score[1]):
#         result = "1"
#     elif(score[1] > score[0]):
#         result = "2"
#     else:
#         result = "X"
#     print(home+"-"+guest+"-"+result)
# URL = 'https://www.livescore.cz/index.php'
# page = requests.get(URL)
# soup = BeautifulSoup(page.content, 'html.parser')
# results = soup.find_all('tr', class_='match')
# for res in results:
#     if(res.find('td', class_="col-state").text == 'FT'):
#         home = res.find('td', class_="col-home").find('a').text
#         guest = res.find('td', class_="col-guest").find('a').text
#         score = res.find('td', class_="col-score").find('a').text.split(":")
#         if(score[0] > score[1]):
#             result = "1"
#         elif(score[1] > score[0]):
#             result = "2"
#         else:
#             result = "X"
#         print(home+"-"+guest+"-"+result)
print("oleeeeeeeeeeeeeeeeeeeeeeeeeeeeee")