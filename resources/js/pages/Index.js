import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { AppBar, Toolbar, Typography, Button, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return [o(r()*s), o(r()*s), o(r()*s)];
}

function Index() {
    const classes = useStyles();

    useEffect(() => {
        fetch('https://81dc0c006bfb.ngrok.io/api/results')
            .then(res => res.json())
            .then(
                (result) => {
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

                    result.forEach(el => {
                        var [r, g, b] = random_rgba();
                        // 1st chart
                        top10.datasets.push({
                            label: el.stock,
                            data: [el.mentions],
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
                    
                    new Chart('top10', {
                        type: 'bar',
                        data: top10,
                        options: options
                    });
                    new Chart('analysis', {
                        type: 'bar',
                        data: analysis,
                        options: options
                    });
                },
                (error) => {
                    alert(error);     
                }
            )
    }, [])

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.page}>
                        WSB Trends
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <CardComponent title={'Top 10 most mentioned picks:'} canvas_id={'top10'} />
                    </Grid>
                    <Grid item xs={6}>
                        <CardComponent title={'Sentiment Analysis'} canvas_id={'analysis'} />
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
