import React, { useState, useEffect } from "react";
import "./App.css";
import Letter from "./Letter.jsx";

export default () => {
  const [message, setMessage] = useState(null);
  const [game, setGame] = useState({
    questions: [
      {
        question: "Soru 11",
        answer: "ABCD",
        isAsked: false
      },
      {
        question: "Soru 22",
        answer: "ABCDE",
        isAsked: false
      },
      {
        question: "Soru 33",
        answer: "ABCDEF",
        isAsked: false
      },
      {
        question: "Soru 44",
        answer: "ABCDEFG",
        isAsked: false
      }
    ],
    totalScore: 0,
    scoreOfQuestion: 0,
    letters: [],
    currentQuestion: null,
    isStarted: false,
    usersAnswer: "",
    remainingTime: 0,
    isFinished: false,
    message: null,
    messageClass: ""
  });

  useEffect(() => {
    if (game.remainingTime > 0) {
      const time = setInterval(() => {
        setGame({ ...game, remainingTime: game.remainingTime - 1 });
      }, 1000);

      return () => {
        clearInterval(time);
      };
    }
  });

  const alertMessage = isTrue => {
    if (isTrue) {
      setMessage({
        message: "Correct Answer!",
        alertMessageClass: "alert-success"
      });
    } else {
      setMessage({
        message: "Please Check Your Answer",
        alertMessageClass: "alert-danger"
      });
    }
  };

  const startGame = () => {
    let gameTemp = { ...game };
    gameTemp.isStarted = true;
    gameTemp.remainingTime = 240;
    gameTemp.isFinished = false;
    gameTemp.totalScore = 0;
    gameTemp.questions = gameTemp.questions.map(q => {
      q.isAsked = false;
      return q;
    });
    gameTemp = askQuestion(gameTemp);
    setGame({ ...gameTemp });
  };

  const askQuestion = gameTemp => {
    let questions = gameTemp.questions;
    let question = questions.find(q => !q.isAsked);

    if (!question) {
      gameTemp.currentQuestion = null;
      return gameTemp;
    }

    question.isAsked = true;
    const letters = [];

    question.answer.split("").map(l => {
      const letter = {
        letter: "",
        isOpened: false
      };
      letter.letter = l;
      letters.push(letter);
      return l;
    });
    gameTemp.scoreOfQuestion = 100 * letters.length;
    gameTemp.currentQuestion = question;
    gameTemp.letters = letters;
    return gameTemp;
  };

  const answer = () => {
    let gameTemp = { ...game };
    if (
      game.usersAnswer.toLocaleUpperCase("tr") ===
      game.currentQuestion.answer.toLocaleUpperCase("tr")
    ) {
      gameTemp.totalScore += gameTemp.scoreOfQuestion;
      alertMessage(true);
    } else {
      gameTemp.totalScore -= gameTemp.scoreOfQuestion;
      alertMessage(false);
    }
    gameTemp.usersAnswer = "";
    gameTemp = askQuestion(gameTemp);

    if (!gameTemp.currentQuestion) {
      gameTemp = finishGame(gameTemp);
    }
    gameTemp = setGame({ ...gameTemp });
  };

  const finishGame = gameTemp => {
    gameTemp.isFinished = true;
    gameTemp.isStarted = false;
    setMessage(null);
    return gameTemp;
  };

  const changeAnswer = e => {
    setGame({ ...game, usersAnswer: e.target.value });
  };

  const showLetter = () => {
    let randomIndex = Math.floor(Math.random() * game.letters.length);
    console.log(randomIndex);
    const letters = game.letters;
    while (game.letters[randomIndex].isOpened) {
      if (!game.letters.find(l => !l.isOpened)) {
        console.log("doesnt exist");
        return;
      }
      randomIndex = Math.floor(Math.random() * game.letters.length);
    }
    letters[randomIndex].isOpened = true;
    setGame({ ...game, letters, scoreOfQuestion: game.scoreOfQuestion - 100 });
  };

  return (
    <div className="container mt-2">
      <div className="card">
        <div className="card-content">
          <div className="card-header">
            <div className="text-center font-weight-bold">GUESS THE WORD</div>
          </div>
          {!game.isStarted && (
            <div className="card-body">
              <div className="text-center">
                Welcome to our game. If you want to have fun, you can click the
                button below.
              </div>
              <div className="text-center">Have a good time!</div>

              {game.isFinished && (
                <div className="text-center">
                  Congratulations! Your score : {game.totalScore}
                </div>
              )}

              <div className="start mt-2 text-center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={startGame}
                >
                  Start the game
                </button>
              </div>
            </div>
          )}
          {game.isStarted && (
            <div className="card mt-2">
              <div className="card-header">
                <span>{game.currentQuestion.question}</span>
              </div>
              <div className="card-body">
                <div className="d-flex">
                  {game.letters.map((letter, index) => {
                    return <Letter letter={letter} key={index} />;
                  })}
                </div>
              </div>
              <div className="card-footer">
                <div className="d-flex">
                  <div className="mr-4">Total Score : {game.totalScore}</div>
                  <div className="mr-4">
                    Remaining Time : <kbd>{game.remainingTime}</kbd>
                  </div>
                  <div>Score Of Question : {game.scoreOfQuestion}</div>
                </div>
              </div>

              <div className="card-footer">
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Your Answer"
                    value={game.usersAnswer}
                    onChange={changeAnswer}
                  />
                  <div className="input-group-append">
                    <button
                      type="submit"
                      className="btn btn-primary ml-2"
                      onClick={showLetter}
                    >
                      Give me a letter
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary ml-2"
                      onClick={answer}
                    >
                      Send this answer
                    </button>
                  </div>
                </div>
              </div>
              {message && (
                <div className={"card-footer " + message.alertMessageClass}>
                  {message.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
