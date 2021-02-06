# bollette-server
Express server for my betting web app

Bollette Calcio is a web app which allows to place fake bets on the most popular soccer/football championships.
Server made in Node.js and its famous web-framework Express.

To provide odds I rely on a 3rd party service: [the odds api](https://the-odds-api.com)

To place bets, api must call championship route first, in order to load fresh odds related to the desired market and championship

##ROUTES 
- **GET /championships/:championship/:market/** route takes two parameters: championship and market, because it provides 2 different types of odds (h2h - who wins the game, totals - number of goals).

After desired odds are cached, user can place some bets on them throught the /bets route.

- **POST /bets** can have 3 body attributes: match, odd (required), ticket_id. If no ticket id is provided, will be generated another ticket. To create a ticket with multiple bets, is needed to use it.
If user bets on a game he already betted in, the past bet will be overwritten, because the first rule of betting is that you can't place different - incongruent bets on the same game.

- **DELETE /bets** needs match number and ticket_id on body. Deletes selected bet from specified ticket

- **POST /checkout/:ticket_id** takes one request parameter (ticket id), one body attribute (bet import) and user token from header.  Checks if token is provided, if ticket exists, if user's account has enough money. After that, stores ticket on DB and decrements user's account sum.   

- **GET /ranking** returns fetched list of all users' accounts 
- **GET /ranking/maxwins** returns fetched list of all users' accounts 
- **POST /users/register** needs email, password, repeat password and username. Checks if username or email is already stored on the db, then generates hashed password and a token. Token is stored on Redis' db with expiration on 10 minutes, then is returned as header.
- **POST /users/login** needs email or username and password. Checks if username or email and password are valid, then generates a token. Token is stored on Redis' db with expiration on 10 minutes, then is returned as header.
- **GET /users/account_sum** if authenticated, returns user account sum.
- **GET /users/ticket** if authenticated, returns user's tickets.

##MIDDLEWARES

-**auth** check if token is stored on redis db. If not, returns 401. If it is stored, renews it for 10 minutes and returns respective user.
-**db** MYSQL db setup. Creates a pool and promisify all queries.
-**dbQuery** ALL mysql queries used throughout the app. 
-**fetchOdds** middleware wich calls the external API to fetch all odds, it takes championship and market as parameter. It fixes 3rd API's output to accomplish app's purposes.
-**handleErrors** generic error handler middleware, used to handle express-validator
-**redisConfig** REDIS setup
-**updateMatchResult** middleware wich spawns python scraper, in order to retrieve all ended matches of the current day and the past one. It manipulates its output and calls some db queries to update all stored bets, tickets and user accounts (in case of win)
-**utilities** _fixTeams_ is a function wich removes some letters from teams' names in order to make them equal in both retrieved matches from scraping and odds fetched from 3rd party api.

##EXTERNAL SCRIPT

-**scraper.py** this simple scraper uses BeautifulSoup and scrapes a page www.livescores.cz, fetching all soccer results from the current and past day.


