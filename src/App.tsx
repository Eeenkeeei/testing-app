import React, {useRef, useState} from 'react';
import './App.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {a11yProps, TabPanel, useStyles} from "./Components/CommonComponents";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import {Typography} from "@material-ui/core";
import {QuestionComponent} from "./Components/Question";
import {ResultComponent} from "./Components/ResultComponent";

export interface Question {
    questionText: string // текст вопроса
    answers: Answer[] // варианты ответа
    result: number[] // правильные варианты ответа
}

interface Answer {
    number: number; // порядковый номер
    text: string; // текст ответа
}

const App: React.FC = () => {
    const classes = useStyles();
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
    const [isTestEnd, setIsTestEnd] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const isRenderRef = useRef(false);
    const [update, forceUpdate] = useState(false);
    const answerMap = useRef(new Map());

    if (!isRenderRef.current) {
        fetch("./Files/questions.json")
            .then(res => res.json())
            .then(res => {
                setQuestions(res);
                res.forEach((question: Question) => {
                    answerMap.current.set(res.indexOf(question), null)
                });
                isRenderRef.current = true
            });
    }

    const handleAnswer = (questionNumber: number, value: boolean) => {
        answerMap.current.set(questionNumber, value);
        forceUpdate(!update);
    };

    const handleChangePanel = () => {
        const maxPanelNumber = questions.length - 1;
        if (maxPanelNumber >= currentQuestionNumber + 1) {
            setCurrentQuestionNumber(currentQuestionNumber + 1)
        }
    };

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setCurrentQuestionNumber(newValue);
    };

    const handleTestEnd = () => {
        setIsTestEnd(true)
    };

    const handleRestart = () => {
        setIsTestEnd(false);
        setCurrentQuestionNumber(0);
        questions.forEach((question: Question) => {
            answerMap.current.set(questions.indexOf(question), null)
        });
    };

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <div className="container">
                <div className={classes.root}>
                    {!isTestEnd ?
                        <>
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={currentQuestionNumber}
                                aria-label="Vertical tabs example"
                                indicatorColor="primary"
                                className={classes.tabs}
                                onChange={handleChange}
                            >
                                {questions.map(question => {
                                    const questionNumber = questions.indexOf(question);
                                    return (
                                        <Tab style={{borderBottom: '1px solid #e0e0e0'}}
                                             key={questionNumber}
                                             label={
                                                 <div style={{
                                                     display: "flex",
                                                     justifyContent: 'center',
                                                     alignItems: 'center'
                                                 }}>
                                                     <Typography>Вопрос: {questionNumber + 1} </Typography>
                                                     <div style={{width: 60}}>
                                                         {answerMap.current.get(questionNumber) === true ? True : null}
                                                         {answerMap.current.get(questionNumber) === false ? False : null}
                                                     </div>

                                                 </div>
                                             }
                                             {...a11yProps(questionNumber)}
                                        />
                                    )
                                })}
                            </Tabs>
                            {questions.map(question => {
                                const questionNumber = questions.indexOf(question);
                                return (
                                    <TabPanel key={questionNumber} value={currentQuestionNumber} index={questionNumber}>
                                        <QuestionComponent question={question} handleAnswer={handleAnswer}
                                                           handleChangePanel={handleChangePanel}
                                                           questionNumber={questionNumber}
                                                           questionsLength={questions.length}
                                                           handleTestEnd={handleTestEnd}
                                        />
                                    </TabPanel>
                                )
                            })}
                        </> :
                        <ResultComponent
                            answerMap={answerMap.current}
                            handleRestart={handleRestart}
                            questionsLength={questions.length}
                        />}
                </div>
            </div>
        </div>
    );
};

export const True = (
    <CheckIcon style={{color: 'green', marginLeft: 12, fontSize: 28}}/>
);

export const False = (
    <ClearIcon style={{color: 'red', marginLeft: 12, fontSize: 28}}/>
);

export default App;
