# NFT Universe
Are you passionate about NFT?  Nft Universe is the perfect site for you.
Nft Universe is a site where you can explore NFT collections, NFTs, and NFT creators. You have the possibility to like them and by logging in you will get an overview of your likes on the "my likes" page. Enjoy exploring the site !

## Installation

```bash
npm install
```
## Used packages

```bash
npm i cors
```
```bash
npm i dotenv
```
```bash
npm i express
```
```bash
npm i mongodb
```
```bash
npm i uuid
```
```bash
npm install -g nodemon
```

## API documentation

## User
POST => /login - login of user 
POST => /verifyID - check for empty and faulty ID fields
POST => /register register new user 
PUT => /changename - connected user can change his username

## Likesystem
GET => /like/:id - Get all the liked items of the connected user
POST => /like - post a like to the likes-page
DELETE => /deleteLike - user can delete a like on his like-page.

## Sources

https://stackoverflow.com/questions/3774454/is-it-possible-to-recolor-an-image-using-javascript

https://www.npmjs.com/

https://www.youtube.com/@MikeDerycke

https://nodemon.io/

https://www.mongodb.com/docs/atlas/getting-started/

When I had difficulties I asked for help from Mohamed Mankouchi, Lozano Juan-Luca and Quentin Mignon