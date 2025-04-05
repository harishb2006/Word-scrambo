import { useEffect, useState, useRef } from "react";
import wordList from "../words";
import Swal from "sweetalert2";
import "../timer.css";

function Game() {
  const [originalWord, setOriginalWord] = useState("");
  const originalWordRef = useRef("");
  const [letters, setLetters] = useState([]);
  const [inputLetters, setInputLetters] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const timerRef = useRef(null);

  const shuffleWord = (word) => {
    return word.split("").sort(() => Math.random() - 0.5);
  };

  const resetGame = () => {
    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
    setOriginalWord(newWord);
    originalWordRef.current = newWord;
    setLetters(shuffleWord(newWord));
    setInputLetters([]);
    setTimeLeft(15);
    setIsAlertVisible(false);
    restartTimer();
  };

  useEffect(() => {
    resetGame();
    return () => clearInterval(timerRef.current);
  }, []);

  const restartTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1 && !isAlertVisible) {
          clearInterval(timerRef.current);
          setIsAlertVisible(true);
          Swal.fire({
            title: "⏰ Time's up!",
            text: `The word was "${originalWordRef.current}".`,
            icon: "warning",
            background: "#fefce8",
            customClass: {
              popup: "rounded-xl shadow-lg",
              title: "text-yellow-800 text-2xl font-bold",
              htmlContainer: "text-yellow-600 text-md",
              confirmButton: "bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
            },
            confirmButtonText: "Next Word"
          }).then(() => {
            setStreak(0);
            resetGame();
          });
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDragStart = (e, letter, index, fromInput) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ letter, index, fromInput }));
  };

  const handleDrop = (e, toInput) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (data.fromInput === toInput) return;

    const fromList = data.fromInput ? [...inputLetters] : [...letters];
    const toList = toInput ? [...inputLetters] : [...letters];

    const [moved] = fromList.splice(data.index, 1);
    toList.push(moved);

    if (data.fromInput) {
      setInputLetters(fromList);
      setLetters(toList);
    } else {
      setLetters(fromList);
      setInputLetters(toList);
    }
  };

  const allowDrop = (e) => e.preventDefault();

  const checkAnswer = () => {
    if (isAlertVisible) return;

    const word = inputLetters.join("");
    if (word === originalWord) {
      clearInterval(timerRef.current);
      const timeBonus = Math.round(timeLeft * 0.5);
      const streakBonus = streak;
      const pointsEarned = 10 + timeBonus + streakBonus;

      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      setIsAlertVisible(true);

      Swal.fire({
        title: "✅ Correct!",
        html: `
          <div class="text-center">
            <p class="text-green-600 text-lg">Word: <strong>${originalWord}</strong></p>
            <div class="mt-3 p-2 bg-green-50 rounded-lg">
              <p>Base Points: +10</p>
              <p>Time Bonus: +${timeBonus}</p>
              <p>Streak Bonus: +${streakBonus}</p>
              <p class="font-bold mt-2">Total: +${pointsEarned} points</p>
            </div>
            <p class="mt-3">Current Streak: ${streak + 1}</p>
          </div>
        `,
        icon: "success",
        background: "#f0fdf4",
        customClass: {
          popup: "rounded-lg shadow-lg",
          title: "text-green-700 font-bold text-2xl",
          htmlContainer: "text-green-600",
          confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        },
        confirmButtonText: "Next Word"
      }).then(resetGame);
    } else {
      clearInterval(timerRef.current);
      setIsAlertVisible(true);
      setStreak(0);
      Swal.fire({
        title: "❌ Incorrect",
        html: `
          <div class="text-center">
            <p class="text-red-600 text-lg">The correct word was:</p>
            <p class="text-xl font-bold mt-2 text-red-700">"${originalWord}"</p>
          </div>
        `,
        icon: "error",
        background: "#fef2f2",
        customClass: {
          popup: "rounded-lg shadow-lg",
          title: "text-red-700 font-bold text-2xl",
          htmlContainer: "text-red-600 text-md",
          confirmButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        },
        confirmButtonText: "Next Word"
      }).then(resetGame);
    }
  };

  const nextWord = () => {
    if (isAlertVisible) return;
    clearInterval(timerRef.current);
    setIsAlertVisible(true);
    setScore(prev => Math.max(0, prev - 2));
    setStreak(0);
    Swal.fire({
      title: "⏭️ Skipped",
      text: `The word was "${originalWord}"`,
      icon: "info",
      background: "#eff6ff",
      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-blue-800 text-2xl font-semibold",
        htmlContainer: "text-blue-600 text-md",
        confirmButton: "bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      },
      confirmButtonText: "Continue"
    }).then(resetGame);
  };

  const resetFullGame = () => {
    setScore(0);
    setStreak(0);
    resetGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00B3C3] to-[#008b98]">
      <header className="relative w-full py-6 bg-[#007b87] shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white ">Word Scrambo</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-white font-semibold">
               <h1 className="text-black">    Streak: {streak} 🔥</h1>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-white font-semibold">
              <h1 className="text-black">Score: {score}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 flex flex-col items-center">
        <div className="relative w-20 h-20 mb-8">
          <svg className="absolute top-0 left-0 w-20 h-20 -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#f0f9ff"
              strokeWidth="8"
              fill="none"
              strokeDasharray={226}
              strokeDashoffset={(226 * (15 - timeLeft)) / 15}
              className="transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-3xl font-bold text-white">
            {timeLeft}
          </div>
        </div>

        <div className="w-full max-w-lg bg-white bg-opacity-20 rounded-2xl shadow-lg p-6 backdrop-filter backdrop-blur-sm">
          <div
            onDrop={(e) => handleDrop(e, true)}
            onDragOver={allowDrop}
            className="flex flex-wrap justify-center gap-3 border-4 border-dashed border-gray-400 border-opacity-40 p-6 rounded-xl mb-6 min-h-[100px]"
          >
            {inputLetters.length === 0 ? (
              <p className="text-white text-opacity-60 text-lg">Drag letters here to form a word</p>
            ) : (
              inputLetters.map((letter, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, letter, idx, true)}
                  className="w-14 h-14 bg-green-400 rounded-lg shadow-md flex items-center justify-center text-2xl font-bold cursor-grab hover:scale-105 transition transform"
                >
                  {letter}
                </div>
              ))
            )}
          </div>

          <div
            onDrop={(e) => handleDrop(e, false)}
            onDragOver={allowDrop}
            className="flex flex-wrap justify-center gap-3 bg-gray-100 bg-opacity-30 p-6 rounded-xl min-h-[100px] mb-6"
          >
            {letters.map((letter, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, letter, idx, false)}
                className="w-14 h-14 bg-yellow-300 rounded-lg shadow-md flex items-center justify-center text-2xl font-bold cursor-grab hover:scale-105 hover:rotate-2 transition transform"
              >
                {letter}
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center mt-4">
            <button
              onClick={checkAnswer}
              disabled={inputLetters.length === 0}
              className={`px-8 py-3 rounded-lg font-semibold text-lg shadow-md transition-all transform hover:scale-105 
                ${inputLetters.length === 0 
                  ? 'bg-blue-300 text-blue-100 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Submit
            </button>
            <button
              onClick={nextWord}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-700 transition-all transform hover:scale-105"
            >
              Skip (-2 pts)
            </button>
          </div>
        </div>

        <button
          onClick={resetFullGame}
          className="mt-8 px-6 py-2 bg-black bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition"
        >
          Reset Game
        </button>
      </main>
    </div>
  );
}

export default Game;
