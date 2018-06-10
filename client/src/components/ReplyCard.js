import React from 'react';
import {
    Avatar,
    Card,
    CardHeader,
    CardContent,
    Divider,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Paper,
    Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Anchor from './Anchor';
import Img from './EnlargeableImg';

import styles from '../styles/index';

class ReplyCard extends React.Component {
    /**
     * generate JSX from fakeNodeList
     * @param i
     * @returns {JSX}
     */
    generateJSX(i) {
        const classes = this.props.classes;
        switch (i['tag']) {
            case 'img':
                return <Img classes={classes}
                            src={/^http/.test(i[0]) ? i[0] : ('http://img.ngacn.cc/attachments' + i[0].slice(1))}/>;
            case 'del':
                return <del>{i[0]}</del>;
            case 'url':
                return <Anchor href={i[0]}>{i[0]}</Anchor>;
            case 'br':
                return <br/>;
            case 'size':
                return <span
                    style={{ fontSize: i['opt'].slice(1), lineHeight: i['opt'].slice(1).replace('%', '') / 1800 + 1 }}>{
                    i.length === 1 ? i[0] : i.filter(i => i).map(i => this.generateJSX(i))
                }</span>;
            case 'align':
                return <p
                    style={{ textAlign: i['opt'].slice(1) }}>{i.length === 1 ? i[0] : i.filter(i => i).map(i => this.generateJSX(i))}</p>;
            case 'list':
                const chunker = (array) => {
                    let a = [], b = -1;
                    for (let i of array) {
                        if (i === '[*]' || (typeof i === 'string' && i.indexOf('[*]') >= 0)) {
                            b += 1;
                            a[b] = [];
                            if (i !== '[*]') i = i.replace('[*]', '');
                        }
                        if (b >= 0) {
                            if (i !== '[*]') a[b].push(i);
                        } else {
                            a.push([i]);
                            a.isSingle = true;
                        }
                    }
                    return a;
                };
                return <ul>{
                    i.indexOf('[*]') === 0 ? chunker(i).map(i => <li>
                        <span>{this.generateJSX(i[0])}</span>
                        {i.slice(1).map(i => this.generateJSX(i))}
                    </li>) : chunker(i).isSingle ?
                        <li>{chunker(i).map(i => i.map(i => this.generateJSX(i)))}</li> : chunker(i).map(i =>
                            <li>{i.map(i => this.generateJSX(i))}</li>)
                }</ul>;
            case 'h':
                return <Divider/>;
            case 'B':
            case 'b':
                return <span className={classes.boldText}>{
                    i.length === 1 ? i[0] : i.filter(i => i).map(i => this.generateJSX(i))
                }</span>;
            case 'color':
                return <span style={{ color: i['opt'].slice(1) }}>{
                    i.length === 1 ? i[0] : i.filter(i => i).map(i => this.generateJSX(i))
                }</span>;
            case 'U':
            case 'u':
                return <u>{i.length === 1 ? i[0] : i.filter(i => i).map(i => this.generateJSX(i))}</u>;
            case 'quote':
                return <Paper className={classes.paper}>
                    {i.length === 1 ? i[0] : i.filter(i => i).map(i => this.generateJSX(i))}
                </Paper>;
            case 'collapse':
                return <ExpansionPanel classes={{ root: classes.expansionPanel }}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}>{i['opt'] ? i['opt'].slice(1) : '...'}</ExpansionPanelSummary>
                    <ExpansionPanelDetails classes={{
                        root: classes.expansionDetails
                    }}>{i.filter(i => i).map(i => this.generateJSX(i))}</ExpansionPanelDetails>
                </ExpansionPanel>;
            default:
                i['tag'] ? console.log(i) : null;
                return i['tag'] ? i[0] : i;
        }
    };

    /**
     * convert bbs code to JSX elements
     * @param data
     * @returns {Array}
     */
    bbsCodeConvert(data) {
        /**
         * A part of MAGIC, to convert origin json data to fakeNodeList
         * @param {string} arg
         * @returns {Array}
         */
        const parseData = arg => {
            arg = arg.replace(/<br *\/?>/ig, "[br][/br]").replace(/&emsp;/g, ' ').replace(/&nbsp;/g, ' ')
                .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
                .replace(/&#92;/g, "\\").replace(/&#36;/g, "$").replace(/&amp;/g, "&").replace(/&#12539;/g, '・');
            let a = [], p = a, i = 0, j = 0, l = 0, m, q,
                g = /\[(\/)?(br|code|collapse|urlreplace|quote|crypt|table|tr|td|del|u|b|i|sup|sub|span|dice|list|color|upup|size|font|align|album|img|flash|iframe|attach|url|tid|stid|pid|uid|h|l|r|randomblock)([^a-z\]][^\]]{0,100})?]/gi;
            while (m = g.exec(arg)) {
                if (m[1] === '/') {
                    q = p;
                    while (q && m[2] !== q.tag) {
                        q = q.p;
                    }
                    if (q) {
                        p = q;
                    } else {
                        continue;
                    }
                    p.push(arg.substring(i, m.index));
                    j--;
                    p = p.p;
                } else {
                    p.push(arg.substring(i, m.index));
                    const x = [];
                    x.tag = m[2];
                    x.opt = m[3];
                    x.p = p;
                    p.push(x);
                    p = x;
                    j++;
                }
                i = g.lastIndex;
                if (l++ > 10000) break;
            }
            p.push(arg.substring(i));
            return a;
        };
        const fakeNodeList = parseData(data);
        let content = [];
        const supportList = ['img', 'del', 'url', 'br', 'size', 'B', 'b', 'color', 'U', 'u', 'collapse', 'quote', 'list', 'h', 'align'];

        /**
         * Another part of MAGIC, to parse fakeNodeList recursively
         * @param t
         */
        const parseFakeNodeList = t => {
            for (const i of t) {
                if (Array.isArray(i)) {
                    if (supportList.indexOf(i['tag']) >= 0) {
                        /*case 'code':case 'pid':
                            TODO
                        */
                        content.push(this.generateJSX(i));
                    } else {
                        console.log(i['tag']);
                        parseFakeNodeList(i);
                    }
                } else {
                    content.push(i);
                }
            }
        };
        parseFakeNodeList(fakeNodeList);
        return content;
    }

    render() {
        const { classes, content, postdate, floor, username, avatar } = this.props;

        /**
         * parse avatar
         * @param avatar
         * @returns {String} - url of the avatar
         */
        const resolveAvatar = avatar => {
            if (avatar) {
                if ((avatar.indexOf("http") < 0 || (avatar.indexOf("bbs") >= 0 && avatar.indexOf('ngabbs') < 0))) {
                    let file = avatar.match(/[0-9].*/)[0];
                    let hex = parseInt(avatar.match(/[0-9]+/)[0]).toString(16);
                    avatar = "http://img.ngacn.cc/avatars/2002/";
                    while (hex.length < 9) {
                        hex = '0' + hex;
                    }
                    hex = hex.match(/.{1,3}/g);
                    for (let i = hex.length - 1; i >= 0; i--) {
                        avatar = avatar + hex[i] + '/';
                    }
                    avatar += file;
                }
            } else {
                avatar = 'https://via.placeholder.com/70x70'
            }
            return avatar;
        };

        return (
            <Card className={classes.card}>
                <CardHeader avatar={<Avatar src={resolveAvatar(avatar)} className={classes.avatarSmall}/>}
                            subheader={(floor === '0' ? '楼主' : floor + '楼') + '  ·  ' + postdate}
                            title={username}/>
                <CardContent>
                    <Typography variant="body2">
                        {content ? this.bbsCodeConvert(content) : null}
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles, { withTheme: true })(ReplyCard);