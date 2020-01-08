import React, {useState} from 'react'
import {Question} from "../App";
import {Button, Checkbox, FormControlLabel, Typography} from "@material-ui/core";

interface QuestionComponentProps {
    question: Question;
    handleAnswer: (questionNumber: number, value: boolean) => void;
    questionNumber: number;
    handleChangePanel: () => void
}

export const QuestionComponent = (props: QuestionComponentProps) => {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleSelectAnswer = (value: number) => {
        const answersArr = selectedAnswers;
        const index = answersArr.findIndex(item => item === value);
        if (index !== -1) {
            answersArr.splice(index, 1)
        } else {
            answersArr.push(value)
        }
        setSelectedAnswers(JSON.parse(JSON.stringify(answersArr)))
    };

    const handleAnswerButton = () => {
        let isAnswerTrue = true;
        const answerMap = new Map();
        props.question.result.forEach (ansNumber => {
           answerMap.set(ansNumber, 1)
        });
        if (props.question.result.length === selectedAnswers.length) {
            selectedAnswers.forEach(selectedAnswer => {
                if (!answerMap.has(selectedAnswer)) {
                    isAnswerTrue = false;
                }
            });
        } else {
            isAnswerTrue = false;
        }
        props.handleAnswer(props.questionNumber, isAnswerTrue);
        setIsAnswered(true);
    };

    return (
        <div style={{height: '700px', width: '850px'}}>
            <Typography variant="h5">
                {props.question.questionText}
            </Typography>

            <div className="answers-container">
                {props.question.answers.map(answer => {
                    let checked = false;
                    if (selectedAnswers.includes(Number(answer.number))) {
                        checked = true
                    }
                    return (
                        <FormControlLabel
                            key={answer.text}
                            control={<Checkbox checked={checked}
                                               onChange={(evt) => handleSelectAnswer(Number(evt.target.value))}
                                               value={Number(answer.number)}/>}
                            label={answer.text}
                        />
                    )
                })}
            </div>

            <div className="button-container">
                <Button size="large" variant="contained" color="primary" style={{borderRadius: `1px solid #1de9b6`}}
                        onClick={handleAnswerButton}
                        disabled={isAnswered}
                >
                    Ответить
                </Button>
                <Button size="large" variant="contained" color="primary"
                        style={{borderRadius: `1px solid #1de9b6`, marginLeft: 30}}
                        onClick={() => props.handleChangePanel()}
                        disabled={!isAnswered}
                >
                    Далее
                </Button>
            </div>
        </div>
    )
};

