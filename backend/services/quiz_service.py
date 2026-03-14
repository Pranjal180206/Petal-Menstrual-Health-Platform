from typing import List, Optional
from bson import ObjectId
from models.quiz_model import Quiz, ScoreResponse
from database import get_db
import traceback

class QuizService:
    @staticmethod
    async def get_published_quizzes() -> List[dict]:
        db = get_db()
        cursor = db["quizzes"].find({"is_published": True})
        quizzes = await cursor.to_list(length=100)
        return quizzes

    @staticmethod
    async def get_quiz(quiz_id: str) -> Optional[dict]:
        db = get_db()
        try:
            return await db["quizzes"].find_one({"_id": ObjectId(quiz_id)})
        except:
            return None

    @staticmethod
    async def score_quiz(quiz_id: str, submitted_answers: List[dict], user_id: str = None) -> ScoreResponse:
        quiz = await QuizService.get_quiz(quiz_id)
        if not quiz:
            raise Exception("Quiz not found")
        
        correct_count = 0
        total_questions = len(quiz.get("questions", []))
        results = []

        question_map = {q["id"]: q for q in quiz.get("questions", [])}

        for ans in submitted_answers:
            q_id = ans.get("question_id")
            selected = ans.get("selected_option_id")
            
            question = question_map.get(q_id)
            if not question:
                continue
                
            is_correct = (selected == question["correct_option_id"])
            if is_correct:
                correct_count += 1
                
            results.append({
                "question_id": q_id,
                "is_correct": is_correct,
                "correct_option_id": question["correct_option_id"],
                "explanation": question["explanation"]
            })

        score_percentage = (correct_count / total_questions * 100) if total_questions > 0 else 0
        passed = score_percentage >= 70.0

        if user_id:
            try:
                db = get_db()
                await db["users"].update_one(
                    {"_id": ObjectId(user_id)},
                    {"$push": {
                        "quiz_history": {
                            "quiz_id": quiz_id,
                            "score": score_percentage,
                            "passed": passed
                        }
                    }}
                )
            except Exception as e:
                print("Failed saving quiz history:", traceback.format_exc())

        return ScoreResponse(
            score_percentage=score_percentage,
            passed=passed,
            results=results
        )

quiz_service = QuizService()
