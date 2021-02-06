import React from 'react';
import ReactDOM from 'react-dom';

import { AppBar, Toolbar, Typography, Button, IconButton, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

// components
import CardComponent from '../components/CardComponent';

// fonts
import 'fontsource-roboto';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    page: {
      flexGrow: 1,
    },
    card: {
        minWidth: 275,
    },
}));

function Index() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.page}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md">
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <CardComponent title={'test1'} canvas_id={'id1'} />
                    </Grid>
                    <Grid item xs={6}>
                        <CardComponent title={'test2'} canvas_id={'id2'} />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default Index;

if (document.getElementById('index')) {
    ReactDOM.render(<Index />, document.getElementById('index'));
}
