import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  cardTitle: {
    paddingBottom: theme.spacing(1),
  }
}));

export default function CardComponent(props) {
    const classes = useStyles();

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2" align="center" className={classes.cardTitle}>
                    {props.title}
                </Typography>

                <canvas id={props.canvas_id}></canvas>
            </CardContent>
        </Card>
    );
}
