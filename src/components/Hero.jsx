import React, { useEffect, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "simple-keyboard/build/css/index.css";
import "./Hero.css";
import "./CustomKeyboard.css";
import Swal from "sweetalert2";
import winnerImage from "../assets/winner2.jpg";
const API_URL = "https://random-word-api.herokuapp.com/word?number=1&length=5";

function Hero() {
  const initialBoard = Array.from({ length: 6 }, () => Array(5).fill(null));
  const initialColors = Array.from({ length: 6 }, () => Array(5).fill("cube"));
  const [board, setBoard] = useState(initialBoard);
  const [colors, setColors] = useState(initialColors);
  const [currentCol, setCurrentCol] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const [solution, setSolution] = useState("");
  const [guess, setGuess] = useState("");
  const [numberOfGuesses, setNumberOfGuesses] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchWord = async () => {
      const response = await fetch(API_URL);
      const word = await response.json();
      const upperCaseWord = word[0].toUpperCase();
      setSolution(upperCaseWord);
    };

    fetchWord();
  }, [refresh]);

  const refreshGame = () => {
    setBoard(initialBoard);
    setColors(initialColors);
    setCurrentCol(0);
    setCurrentRow(0);
    setGuess("");
    setNumberOfGuesses(0);
    setRefresh((prev) => !prev);
  };

  const checkWord = () => {
    const newColors = [...colors];
    const guessArray = guess.toUpperCase().split("");
    const solutionArray = solution.split("");

    for (let i = 0; i < 5; i++) {
      if (guessArray[i] === solutionArray[i]) {
        newColors[currentRow][i] = "cube correct";
        solutionArray[i] = null;
        guessArray[i] = null;
      }
      if (guessArray[i] !== null && solutionArray.includes(guessArray[i])) {
        newColors[currentRow][i] = "cube close";
        solutionArray[solutionArray.indexOf(guessArray[i])] = null;
        guessArray[i] = null;
      }
      if (guessArray[i] !== null) {
        newColors[currentRow][i] = "cube incorrect";
      }
    }
    setColors(newColors);
    setTimeout(() => {
      if (solution === guess.toUpperCase()) {
        Swal.fire({
          title: "Good job!",
          text: "You have found the secret word!",
          icon: "success",
          color: "white",
          background: `url(${winnerImage})`,
        });
        refreshGame();
      } else if (numberOfGuesses >= 5 && solution !== guess.toUpperCase()) {
        Swal.fire({
          icon: "error",
          title: "You lost",
          text: "Try again",
        });
        refreshGame();
      }
    }, 700);

    console.log(numberOfGuesses);
  };

  const onKeyPress = (button) => {
    if (button !== "Enter") {
      if (button === "{bksp}") {
        setGuess((prev) => prev.substring(0, prev.length - 1));
        if (currentCol > 0) {
          const newBoard = [...board];
          newBoard[currentRow][currentCol - 1] = null;
          setBoard(newBoard);
          setCurrentCol(currentCol - 1);
        }
      } else if (/[a-zA-Z]/.test(button) && currentCol < 5) {
        setGuess((prev) => prev + button);
        const newBoard = [...board];
        newBoard[currentRow][currentCol] = button;
        setBoard(newBoard);
        setCurrentCol(currentCol + 1);
      }
    }

    if (button === "Enter" && currentCol === 5) {
      setNumberOfGuesses((prev) => prev + 1);
      checkWord();
      setCurrentRow((prev) => prev + 1);
      setCurrentCol(0);
      setGuess("");
    }
  };

  const layout = {
    default: [
      "Q W E R T Y U I O P",
      "A S D F G H J K L",
      "Z X C V B N M",
      "{bksp} Enter",
    ],
  };

  const display = {
    "{bksp}": "Backspace",
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Wordle</h1>
      <table>
        <tbody>
          {board.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => (
                <td key={colIdx}>
                  <div className={colors[rowIdx][colIdx]} maxLength={1}>
                    {cell}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Keyboard layout={layout} display={display} onKeyPress={onKeyPress} />
    </>
  );
}

export default Hero;
