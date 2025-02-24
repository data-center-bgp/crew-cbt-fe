import CreateQuiz from "./pages/CreateQuiz";
import RegisterPage from "./pages/Register";
import SelectCategoryPage from "./pages/SelectCategory";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/select-category" element={<SelectCategoryPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz-result" element={<QuizResult />} />
      </Routes>
    </Router>
  );
}

export default App;
