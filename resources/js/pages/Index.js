import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { AppBar, Toolbar, Typography, Button, IconButton, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

// components
import CardComponent from '../components/CardComponent';

// fonts
import 'fontsource-roboto';

import Chart from 'chart.js';

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

    useEffect(() => {
        fetch('https://7f37ec3da7d1.ngrok.io/api/results')
            .then(res => res.json())
            .then(
                (result) => {
                    var stocks = [];
                    var mentions = [];
                    var top10 = [];

                    result.forEach(el => {
                        //stocks.push(el.stock);
                        //mentions.push(el.mentions);

                        top10.push({
                            label: el.stock,
                            data: [
                                el.bearish,
                                el.neutral,
                                el.bullish,
                                el.total
                            ],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                            ],
                            borderWidth: 1
                        });
                    });
                    console.log(stocks);
                    
                    new Chart('top10', {
                        type: 'bar',
                        data: [{
                            labels: stocks,
                            datasets: top10
                        }],
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    });
                },
                (error) => {
                    console.log(error);     
                }
            )
    }, [])

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
                        <CardComponent title={'Top 10 most mentioned picks:'} canvas_id={'top10'} />
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
