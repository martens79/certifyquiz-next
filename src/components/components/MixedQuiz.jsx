import React from "react";
import QuizPage from "./QuizPage";

const MixedQuiz = ({ certificationId, categoryId, title, description }) => {
  return (
    <QuizPage
      quizId={-certificationId}  // quizId negativo = quiz misto della certificazione
      certificationId={certificationId}
      categoryId={categoryId}
      topicId={null}
      title={title}
      description={description}
    />
  );
};

export default MixedQuiz;
