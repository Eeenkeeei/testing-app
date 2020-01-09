import React from 'react';
import {Button, Typography} from "@material-ui/core";
import {False, True} from "../App";

interface ResultComponentProps {
    answerMap: Map <number, boolean>
    handleRestart: () => void
    questionsLength: number
}

export const ResultComponent = (props: ResultComponentProps) => {
    let trueAnswers = 0;
    let falseAnswers = 0;

    props.answerMap.forEach((value, key) => {
        if (value) {
            trueAnswers++
        } else {
            falseAnswers++
        }
    });

    return (
        <div className="results-container">
            <Typography variant="h6">Всего вопросов: {props.questionsLength}</Typography>
            <Typography variant="h6">Правильных ответов {trueAnswers} {True}</Typography>
            <Typography variant="h6">Неправильных ответов {falseAnswers} {False}</Typography>
            <Button size="large" variant="contained" color="primary"
                    style={{borderRadius: `1px solid #1de9b6`}}
                    onClick={props.handleRestart}
            >
                Начать заново
            </Button>
        </div>
    )
};
