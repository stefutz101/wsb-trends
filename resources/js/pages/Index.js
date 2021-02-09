import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { AppBar, Toolbar, Typography, Button, Container, Grid } from '@material-ui/core';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { blue, lime, grey } from '@material-ui/core/colors';

// components
import CardComponent from '../components/CardComponent';

// fonts
import 'fontsource-roboto';

import Chart from 'chart.js';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: blue[500],
        },
        secondary: {
            main: lime[500],
        },
    },
});

const useStyles = makeStyles((theme) => ({
    menu: {
        flexGrow: 1
    },
    loginButton: {
        marginRight: theme.spacing(1)
    },
    pageTitle: {
        paddingBottom: theme.spacing(2)
    },
    container: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
        backgroundColor: grey[50],
    }
}));

function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return [o(r()*s), o(r()*s), o(r()*s)];
}

function Index() {
    const classes = useStyles();

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(
                (result) => {
                    //Count all subReddits
                    var subs = [];
                    for(var sub in result) subs.push(sub);

                    subs.forEach(sub => {  
                        var top10, analysis, options, sentiments;
                        top10 = {
                            labels: ['Stocks'],
                            datasets: [],
                        }
                        analysis = {
                            labels: [],
                            datasets: [],
                        };

                        sentiments = {
                            bearish: {
                                key: 'Bearish',
                                values: [],
                                color: [255, 99, 132]
                            },
                            neutral: {
                                key: 'Neutral',
                                values: [],
                                color: [255, 206, 86]
                            },
                            bullish: {
                                key: 'Bullish',
                                values: [],
                                color: [75, 192, 192]
                            },
                            total: {
                                key: 'Total',
                                values: [],
                                color: [153, 102, 255]
                            }
                        };

                        options = {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        };

                        result[sub].forEach(el => {  
                            var [r, g, b] = random_rgba();
                            // 1st chart
                            top10.datasets.push({
                                label: el.stock,
                                data: [
                                    el.mentions
                                ],
                                backgroundColor: [
                                    `rgba(${r}, ${g}, ${b}, 0.2)`
                                ],
                                borderColor: [
                                    `rgba(${r}, ${g}, ${b}, 1)`
                                ],
                                borderWidth: 1
                            });

                            // 2nd chart
                            analysis.labels.push(el.stock);
                            sentiments.bearish.values.push(el.bearish);
                            sentiments.neutral.values.push(el.neutral);
                            sentiments.bullish.values.push(el.bullish);
                            sentiments.total.values.push(el.total);
                        });

                        for (const [key, value] of Object.entries(sentiments)) {
                            var [r, g, b] = value.color;

                            analysis.datasets.push({
                                label: value.key,
                                data: value.values,
                                backgroundColor: [
                                    `rgba(${r}, ${g}, ${b}, 0.2)`,
                                    `rgba(${r}, ${g}, ${b}, 0.2)`,
                                    `rgba(${r}, ${g}, ${b}, 0.2)`,
                                    `rgba(${r}, ${g}, ${b}, 0.2)`,
                                    `rgba(${r}, ${g}, ${b}, 0.2)`,
                                    `rgba(${r}, ${g}, ${b}, 0.2)`,
                                    `rgba(${r}, ${g}, ${b}, 0.2)`,
                                    `rgba(${r}, ${g}, ${b}, 0.2)`,
                                    `rgba(${r}, ${g}, ${b}, 0.2)`,
                                    `rgba(${r}, ${g}, ${b}, 0.2)`
                                ],
                                borderColor: [
                                    `rgba(${r}, ${g}, ${b}, 1)`,
                                    `rgba(${r}, ${g}, ${b}, 1)`,
                                    `rgba(${r}, ${g}, ${b}, 1)`,
                                    `rgba(${r}, ${g}, ${b}, 1)`,
                                    `rgba(${r}, ${g}, ${b}, 1)`,
                                    `rgba(${r}, ${g}, ${b}, 1)`,
                                    `rgba(${r}, ${g}, ${b}, 1)`,
                                    `rgba(${r}, ${g}, ${b}, 1)`,
                                    `rgba(${r}, ${g}, ${b}, 1)`,
                                    `rgba(${r}, ${g}, ${b}, 1)`
                                ],
                                borderWidth: 1
                            });
                        }
                        
                        new Chart(`${sub}_1`, {
                            type: 'bar',
                            data: top10,
                            options: options
                        });
                        new Chart(`${sub}_2`, {
                            type: 'bar',
                            data: analysis,
                            options: options
                        });
                    });
                },
                (error) => {
                    alert(error);     
                }
            )
    }, [])

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.menu}>
                        WSB Trends
                    </Typography>
                    <Button color="primary" variant="contained" href="/login" className={classes.loginButton}>
                        Login
                    </Button>
                    <Button color="secondary" variant="contained" href="/register">
                        Register
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl" className={classes.container} spacing={5}>
                <Typography variant="h4" className={classes.pageTitle}>
                    Top Mentioned Stocks on Reddit
                </Typography>
                <Grid container spacing={5}>
                    <Grid item xs={12} lg={2}>

                    </Grid>
                    <Grid item xs={12} lg={8}>
                        
                        <Typography variant="h6" className={classes.pageTitle}>
                            r/WallStreetsBets
                        </Typography>
                        <Grid container spacing={5}>
                            <Grid item xs={12} md={6}>
                                <CardComponent title={'Top 10 Most Mentioned Stocks'} canvas_id={'wallstreetbets_1'} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CardComponent title={'Sentiment Analysis'} canvas_id={'wallstreetbets_2'} />
                            </Grid>
                        </Grid>

                        <Typography variant="h6" className={classes.pageTitle}>
                            r/Stocks
                        </Typography>
                        <Grid container spacing={5}>
                            <Grid item xs={12} md={6}>
                                <CardComponent title={'Top 10 Most Mentioned Stocks'} canvas_id={'stocks_1'} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CardComponent title={'Sentiment Analysis'} canvas_id={'stocks_2'} />
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid item xs={12} lg={2}>

                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" align="center">
                            wsbtrends.com © 2021. v1.0.0. This site is not affiliated with Amazon.com Inc., Twitch Interactive, Twitch.tv or any of their partners. Stock trading, Forex trading, or any other form of securities trading is extremely high risk.
                            The information provided anywhere on this website and accompanying material is for informational purposes only. It should not be considered legal or financial advice.
                        </Typography>
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
