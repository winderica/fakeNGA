import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';
const primary = {
    light: '#63a4ff',
    main: blue[700],
    dark: '#004ba0',
};
const secondary = {
    light: '#718792',
    main: blueGrey[700],
    dark: '#1c313a',
};
const backGround = {
    main: '#e1e2e1',
    light: '#f5f5f6'
};
const drawerWidth = 240;

const styles = theme => ({
    root: {
        minHeight: '100%',
        backgroundColor: backGround.main,
    },
    appBar: {
        position: 'absolute',
        backgroundColor: primary.main,
    },
    spaceTaker: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        height: '100%',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 2,
    },
    card: {
        minWidth: 275,
        margin: theme.spacing.unit * 2,
    },
    number: {
        fontSize: 12,
        padding: 4,
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
    avatarSmall: {
        width: 70,
        height: 70,
        margin: theme.spacing.unit,
    },
    avatarBig: {
        width: 150,
        height: 150,
        margin: theme.spacing.unit * 2,
    },
    imageLayer: {
        maxHeight: '100%',
    },
    image: {
        '&:hover': {
            cursor: 'pointer',
        },
        maxWidth: '100%',
    },
    expansionDetails: {
        display: 'block',
    },
    boldText: {
        fontWeight: 'bold',
    },
    imageBox: {
        display: 'inline-block',
    },
    expansionPanel: {
        margin: theme.spacing.unit,
    },
    paper: theme.mixins.gutters({
        padding: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * 3,
    }),
    anchor: {
        textDecoration: 'none',
        color: theme.palette.common.black,
        '&:hover': {
            textDecoration: 'underline',
            color: theme.palette.grey['600'],
        },
    },
    progress: {
        position: 'fixed',
        width: '100%',
        margin: 'auto',
        right: 0,
        top: 0,
        zIndex: theme.zIndex.appBar + 1,
    },
    title: {
        cursor: 'pointer',
    },
    miniButton: {
        minWidth: 10,
    },
    masonry: {
        columnCount: '2',
        [theme.breakpoints.down('xs')]: {
            columnCount: '1',
        },
        columnGap: theme.spacing.unit,
    },
    category: {
        display: 'inline-block',
        width: '100%',
        padding: theme.spacing.unit * 2,
        boxSizing: 'border-box'
    },
    smallCard: {
        width: 'calc(100% / 3)',
        [theme.breakpoints.down('md')]: {
            width: `calc(100% / 2)`,
        },
        display: 'inline-block',
        '&:hover': {
            cursor: 'pointer',
        },
        backGround: secondary.main,
    },
    forumCardTitle: {
        fontSize: '0.9em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    forumCardInfo: {
        fontSize: '0.7em',
        whiteSpace: 'nowrap',
    },
    forumCard: {
        padding: theme.spacing.unit,
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing.unit * 2,
        },
    }
});

export default styles;