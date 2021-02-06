# bollette-server
Express server for my betting web app

Bollette Calcio is a web app which allows to place fake bets on the most popular soccer/football championships.
Server made in Node.js and its famous web-framework Express.

To provide odds I rely on a 3rd party service: [the odds api](https://the-odds-api.com)

To place bets, api must call championship route first, in order to load fresh odds related to the desired market and championship

GET /championship route takes two parameters: championship and market, because it provides 2 different types of odds (h2h - who wins the game, totals - number of goals).

After desired odds are cached, user can place some bets on them throught the /bets route.

POST /bets can have 3 body attributes: match, odd (required), ticket_id. If no ticket id is provided, will be generated another ticket. To create a ticket with multiple bets, is needed to use it.
If user bets on a game he already betted in, the past bet will be overwritten, because the first rule of betting is that you can't place different - incongruent bets on the same game.




