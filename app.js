const express = require('express');
const app = express();
const FakeNGA = require('./handler');
const fakeNGA = new FakeNGA;
const cookie = require('./config').cookie;

fakeNGA.setCookie(cookie);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    console.log('requested ' + req.url);
    next();
});

app.get('/index', (request, response) => {
    fakeNGA.requestIndex().then(res => response.send(res));
});

app.get('/forum/:fid/:page', (request, response) => {
    fakeNGA.requestForum(request.params.fid, request.params.page).then(res => response.send(res));
});

app.get('/topic/:tid/:page', (request, response) => {
    fakeNGA.requestTopic(request.params.tid, request.params.page).then(res => response.send(res));
});

app.get('/user/:uid', (request, response) => {
    fakeNGA.requestUser(request.params.uid).then(res => response.send(res));
});

app.post('/post', (request, response) => {

});

app.post('/login', (request, response) => {

});

app.listen(5000);

/**
 * test
 */
//const fakeNGA = new FakeNGA();

//

//fakeNGA.post();
//random = Math.random();
//fakeNGA.getCaptcha(random);

//fakeNGA.login('winderica', 'yqzcr1999117', '', random);

//fakeNGA.requestIndex().then(res => console.log(res[1]['forums']));
//fakeNGA.requestForum(-7).then(res => console.log(res));
//fakeNGA.requestTopic(10737415).then(res => console.log(res));
//fakeNGA.requestUser('ywwuyi').then(res => console.log(res));