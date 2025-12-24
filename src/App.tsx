import React, { useState } from "react";
import {
  Check,
  X,
  Award,
  RotateCcw,
  ChevronRight,
  BookOpen,
  ChevronLeft,
} from "lucide-react";
import { questionsDB } from "./data/questions";

const App: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // Храним ответы: { [questionIndex]: selectedAnswer }
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = Array.from(new Set(questionsDB.map((q) => q.category)));

  const filteredQuestions =
    categoryFilter === "all"
      ? questionsDB
      : questionsDB.filter((q) => q.category === categoryFilter);

  // Текущий выбранный ответ и правильность
  const selectedAnswer = answers[currentQuestion] || null;
  const question = filteredQuestions[currentQuestion];
  // const isCorrect = selectedAnswer === question.correctAnswer;

  // Подсчёт правильных ответов
  const score = Object.values(answers).filter(
    (ans, idx) => ans === filteredQuestions[idx]?.correctAnswer
  ).length;

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer) return; // нельзя менять после выбора

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const goBackToStart = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setQuizStarted(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full transform hover:transition-transform duration-300">
          <div className="text-center">
            <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Медицинская Физика
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Тест по медицинской физике
            </p>

            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Выберите категорию:
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-4 border-2 border-indigo-300 rounded-xl text-lg focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="all">Все вопросы ({questionsDB.length})</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} (
                    {questionsDB.filter((q) => q.category === cat).length})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-indigo-50 rounded-xl p-6 mb-8">
              <p className="text-gray-700 text-lg">
                Вопросов:{" "}
                <span className="font-bold text-indigo-600">
                  {filteredQuestions.length}
                </span>
              </p>
            </div>

            <button
              onClick={startQuiz}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Начать тест
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / filteredQuestions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
          <div className="text-center">
            <div className="inline-block p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
              <Award className="w-20 h-20 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Тест завершен!
            </h2>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8">
              <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                {percentage}%
              </p>
              <p className="text-2xl text-gray-700">
                {score} из {filteredQuestions.length} правильных ответов
              </p>
            </div>

            <div className="mb-8">
              {percentage >= 80 && (
                <p className="text-xl text-green-600 font-semibold">
                  🎉 Отлично! Вы отлично знаете материал!
                </p>
              )}
              {percentage >= 60 && percentage < 80 && (
                <p className="text-xl text-blue-600 font-semibold">
                  👍 Хорошо! Но есть куда стремиться!
                </p>
              )}
              {percentage < 60 && (
                <p className="text-xl text-orange-600 font-semibold">
                  📖 Рекомендуем повторить материал
                </p>
              )}
            </div>

            <button
              onClick={restartQuiz}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-4 rounded-full text-xl font-bold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
            >
              <RotateCcw className="w-6 h-6" />
              Пройти еще раз
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header только с категорией и номером */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center"> 
            <button
              onClick={goBackToStart}
              className="  bg-white rounded-full p-3 cursor-pointer transform hover:scale-110 transition-all duration-300 z-10 flex items-center gap-2 text-gray-700 font-medium"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="hidden sm:inline">Назад</span>
            </button>
            <div className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
              {question.category}
            </div>
            <div className="text-sm font-semibold text-gray-600">
              Вопрос {currentQuestion + 1} / {filteredQuestions.length}
            </div>
          </div>
        </div>

        {/* Карточка вопроса */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-relaxed">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === question.correctAnswer;

              let buttonClass =
                "w-full text-left p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ";

              if (!selectedAnswer) {
                buttonClass +=
                  "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 bg-white cursor-pointer";
              } else if (isCorrectAnswer) {
                buttonClass += "border-green-500 bg-green-50";
              } else if (isSelected && !isCorrectAnswer) {
                buttonClass += "border-red-500 bg-red-50";
              } else {
                buttonClass += "border-gray-200 bg-gray-50 opacity-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(option)}
                  disabled={!!selectedAnswer}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-800 pr-4">
                      {option}
                    </span>
                    {selectedAnswer && isCorrectAnswer && (
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {selectedAnswer && isSelected && !isCorrectAnswer && (
                      <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Кнопка "Далее" или "Результаты" */}
        {selectedAnswer && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
            >
              {currentQuestion < filteredQuestions.length - 1 ? (
                <>
                  Следующий вопрос
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Показать результаты
                  <Award className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Кружочки навигации */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {filteredQuestions.map((_, index) => {
              const answer = answers[index];
              const correct =
                answer === filteredQuestions[index]?.correctAnswer;
              const isCurrent = index === currentQuestion;

              let circleClass =
                "w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[10px] transition-all duration-300 cursor-pointer transform hover:scale-110 shadow-md ";

              if (answer === undefined) {
                circleClass += "bg-gray-400 hover:bg-gray-500";
              } else if (correct) {
                circleClass += "bg-green-500 hover:bg-green-600";
              } else {
                circleClass += "bg-red-500 hover:bg-red-600";
              }

              if (isCurrent) {
                circleClass +=
                  " ring-4 ring-indigo-400 shadow-xl scale-110 border-2 border-white";
              }

              return (
                <div
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={circleClass}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Текущий счёт */}
        <div className="text-center">
          <div className="inline-block bg-white rounded-full px-8 py-4 shadow-lg">
            <p className="text-xl font-semibold text-gray-700">
              Правильных ответов:{" "}
              <span className="text-indigo-600 text-2xl">{score}</span> /{" "}
              {Object.keys(answers).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
