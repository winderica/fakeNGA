/**
 * libraries
 */
const request = require('request');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false });
const parseString = parser.parseString;
const iconv = require('iconv-lite');
const fs = require('fs');
const fidToName = require('./config').fidToName;

/**
 * defaults
 * @type {string}
 */
const host = 'https://bbs.ngacn.cc';

class FakeNGA {
    /**
     * cut the head of illegal JSON string
     * @param data
     * @returns {string}
     */

    cutHead(data) {
        let i = 0;
        while (data[i] !== '{') i++;
        return data.slice(i);
    };

    /**
     * connect url
     * @param path
     * @param args
     * @returns {string}
     */
    connectUrl(path, ...args) {
        return host + path + args.map((v, i) => (i === 0 ? '?' : '&') + v).join('');
    };

    /**
     * @param categories
     * @returns []
     */
    initCategory(categories) {
        return Object.values(categories['all']).map(category => {
            const id = category['id'];
            const name = category['name'];
            /*const pic = category['pic']; TODO*/
            const forum = category['content'];
            /**
             * @param forum
             * @returns {{fid: *, name: *, info: *}}
             */
            const initForum = (forum) => {
                const fid = forum['fid'];
                const name = forum['name'];
                const info = forum['info'];
                let icon = categories['icons'][`${fid}`];
                icon = icon === undefined ? '00' : icon === 0 ? fid : icon;
                return { fid, name, info, icon };
            };

            const forums = Object.values(forum).filter(i => i['content']['0']).map(i => Object.values(i['content']).map(i => initForum(i)));
            return { id, name, forums };
        });
    };



    /**
     * @param subForum
     * @returns {{fid: *, name: *, info: *, rest: *[]}}
     */
    initSubForum(subForum) {
        const fid = subForum['0'];
        const name = subForum['1'];
        const info = subForum['2'];
        const rest = [subForum['3'], subForum['4']];
        return { fid, name, info, rest };
    };

    /**
     * @param user
     * @returns {Promise<{uid: *, username: *, medal: *, groupId: *, avatar: *, yz: (*|undefined), site: *, honor: *, regDate: *, muteTime: *, postNum: *, rvrc: *, money: *, thisVisit: *, signature: *, bitData: *}>}
     */
    async initUser(user) {
        const data = await new Promise(resolve => {
            request.get({
                url: this.connectUrl('/nuke.php', 'uid=' + user['uid'], 'lite=js', '__act=get', '__lib=ucp'),
                encoding: null
            }, (err, res, data) => {
                data = iconv.decode(data, 'GBK');
                data = JSON.parse(this.cutHead(data));
                resolve(data);
            });
        });
        const uid = user['uid'];
        const username = data['data']['0']['username'];
        const medal = user['medal'];
        const groupId = user['groupid'] === -1 ? user['memberid'] : user['groupid'];
        const avatar = data['data']['0']['avatar'];
        const yz = user['yz'] || user['verified'] || undefined;
        const site = user['site'];
        const honor = user['honor'] || user['title'];
        const regDate = user['regdate'];
        const muteTime = user['mute_time'];
        const postNum = user['postnum'];
        const rvrc = user['rvrc'];
        const money = user['money'];
        const thisVisit = user['thisvisit'];
        const signature = user['signature'];
        const bitData = user['bit_data'];
        return {
            uid,
            username,
            medal,
            groupId,
            avatar,
            yz,
            site,
            honor,
            regDate,
            muteTime,
            postNum,
            rvrc,
            money,
            thisVisit,
            signature,
            bitData
        };
    };

    /**
     * @returns {Promise<*>}
     */
    async requestIndex() {
        return await new Promise(resolve => {
            request.get({
                url: this.connectUrl('/nuke.php', '__lib=nga_index&__act=get_all_forums&raw=1'),
                encoding: null
            }, (err, res, data) => {
                data = iconv.decode(data, 'GBK');
                data = JSON.parse(this.cutHead(data));
                resolve(this.initCategory(data['data'][0]));
            });
        })
    };

    /**
     * @param fid
     * @param page
     * @returns {Promise<*>}
     */
    async requestForum(fid, page = 1) {
        if (!this.cookie) {
            return 'You\'d better login first!';
        }
        return await new Promise(resolve => {
            request.get({
                url: this.connectUrl('/thread.php', `fid=${fid}`, `page=${page}`, 'lite=js'),
                headers: { 'Cookie': this.cookie },
                encoding: null
            }, (err, res, data) => {
                data = iconv.decode(data, 'GBK');
                data = JSON.parse(this.cutHead(data));
                const forum = data['data']['__F'];
                const topics = data['data']['__T'];
                const subForums = Object.values(forum['sub_forums']).map(i => this.initSubForum(i));
                //TODO

                Object.values(topics).map(i => {
                    if (i['quote_from']) {
                        i['tid'] = i['quote_from'];
                    }
                });

                resolve({ topics, subForums, name: fidToName[forum['fid']] });
            })
        });
    };

    /**
     * @param tid
     * @param page
     * @returns {Promise<*>}
     */
    async requestTopic(tid, page = 1) {
        if (!this.cookie) {
            return 'You\'d better login first!';
        }
        return await new Promise(resolve => {
            request.get({
                url: this.connectUrl('/read.php', 'tid=' + tid, 'page=' + page, 'lite=xml'),
                headers: { 'Cookie': this.cookie },
                encoding: null
            }, (err, res, data) => {
                data = iconv.decode(data, 'GBK');
                parseString(data, (err, res) => {
                    res = res['root'];
                    const users = res['__U'];
                    const replies = res['__R'];
                    const topic = res['__T'];
                    const forum = res['__F'];

                    if (!Array.isArray(users['item'])) {
                        users['item'] = [users['item']];
                    }

                    if (!Array.isArray(replies['item'])) {
                        replies['item'] = [replies['item']];
                    }

                    resolve({
                        users: users,
                        replies: replies,
                        topic: topic,
                        forum: forum
                    });
                })
            })
        });
    };

    /**
     * @param info
     * @returns {Promise<*>}
     */
    async requestUser(info) {
        return await new Promise(resolve => {
            request.get({
                url: this.connectUrl('/nuke.php', (typeof info === 'number' ? 'uid=' : 'username=') + info, 'lite=js', '__lib=ucp', '__act=get'),
                encoding: null
            }, (err, res, data) => {
                data = iconv.decode(data, 'GBK');
                data = JSON.parse(this.cutHead(data));
                this.initUser(data['data']['0']).then(res => resolve(res));
            })
        })
    };

    /**
     * @param obj
     */
    post(obj) {
        let form = {
            step: 2
        };
        let url = this.connectUrl('/post.php', 'lite=js', 'action=' + form['action']);
        form['action'] = obj.action;
        if (obj.subject) {
            form['post_subject'] = obj.subject;
        }
        form['post_content'] = obj.content;
        switch (form['action']) {
            case 'new':
                form['fid'] = obj.fid;
                url += '&fid=' + obj.fid;
                break;
            case 'reply':
                form['tid'] = obj.tid;
                url += '&tid=' + obj.tid;
                if (form['pid']) {
                    form['pid'] = obj.pid;
                    url += '&pid=' + obj.pid;
                }
                break;
            case 'quote':
            case 'modify':
                form['tid'] = obj.tid;
                form['pid'] = obj.pid;
                url += '&tid=' + obj.tid + '&pid=' + obj.pid;
                break;
        }
        if (obj.isComment) {
            form['comment'] = 1;
        }
        new Promise(resolve => {
            request.get({
                url: url,
                encoding: null,
                headers: { 'Cookie': this.cookie },
            }, (err, res, data) => {
                data = iconv.decode(data, 'GBK');
                data = JSON.parse(this.cutHead(data));
                resolve(data['data']['content']);
            });
        }).then(result => {
            if (obj.action === 'quote') {
                form['post_content'] = result + form['post_content'];
            }
            request.post({
                url: this.connectUrl('/post.php', 'lite=js'),
                encoding: null,
                headers: { 'Cookie': this.cookie },
                form: form
            }, (err, res, data) => {
                data = iconv.decode(data, 'GBK');
                data = JSON.parse(this.cutHead(data));
                return data;
            })
        });
    };

    /**
     * @param random: a random number generated by Math.random()
     */
    getCaptcha(random) {
        request.get({
            url: this.connectUrl('/login_check_code.php', 'id=_' + random),
            headers: {
                'Referer': this.connectUrl('/nuke.php', '__lib=login', '__act=login_ui'),
            }
        }).pipe(fs.createWriteStream('captcha.png'));
    };

    /**
     * @param username
     * @param password
     * @param captcha
     * @param random: the same random number as before
     */
    async login(username, password, captcha, random) {
        return await new Promise(resolve => {
            request.post({
                url: this.connectUrl('/nuke.php', '__lib=login', '__act=login', 'raw=1'),
                form: {
                    name: username,
                    type: 'name',
                    password: password,
                    rid: '_' + random,
                    captcha: captcha
                },
                encoding: null
            }, (err, res, body) => {
                body = iconv.decode(body, 'GBK');
                body = JSON.parse(this.cutHead(body));
                if (body['error']) {
                    console.log(body['error']['0']);
                } else {
                    this.setCookie(body);
                }
                resolve();
            });
        })
    };

    setCookie(data) {
        if (typeof data === 'object') {
            data = 'ngaPassportUid=' + data['data']['1'] + '; ngaPassportCid=' + data['data']['2'];
        }
        this.cookie = data;
    };
}

module.exports = FakeNGA;