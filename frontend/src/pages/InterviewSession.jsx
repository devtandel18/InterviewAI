import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SkipForward, Square } from "lucide-react";
import Timer from "../components/interview/Timer";
import InterviewSidebar from "../components/interview/InterviewSidebar";
import Button from "../components/ui/Button";
import {
  getInterviewProgressRequest,
  submitAnswerRequest,
  completeInterviewRequest,
} from "../api/interviewApi";

export default function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [ending, setEnding] = useState(false);

  const loadProgress = useCallback(async () => {
    const data = await getInterviewProgressRequest(id);
    setProgress(data);
    setLoadingProgress(false);
    return data;
  }, [id]);

  useEffect(() => {
    loadProgress().catch(() => {
      setError("Couldn't load this interview.");
      setLoadingProgress(false);
    });
  }, [loadProgress]);

  const finishInterview = async () => {
    setEnding(true);
    try {
      await completeInterviewRequest(id);
      navigate(`/interviews/${id}/results`, { replace: true });
    } catch {
      setError("Couldn't end the interview. Please try again.");
      setEnding(false);
    }
  };

  const handleAnswer = async (skipped) => {
    if (!progress?.currentQuestion) return;
    setError("");
    setAnalyzing(true);
    try {
      const updated = await submitAnswerRequest(id, {
        questionId: progress.currentQuestion._id,
        content: skipped ? "" : answer,
        skipped,
      });
      setAnswer("");
      setProgress(updated);

      if (updated.isComplete) {
        await finishInterview();
      }
    } catch {
      setError("Couldn't submit your answer. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loadingProgress) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-[#0b0e14]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (error && !progress) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-white dark:bg-[#0b0e14]">
        <p className="text-sm text-red-500">{error}</p>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  const { interview, currentQuestion, answeredCount, totalQuestions } = progress;

  return (
    <div className="flex h-screen bg-white dark:bg-[#0b0e14]">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-[#1f242e] px-8 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-600">
              Question {answeredCount + 1} of {totalQuestions}
            </p>
            <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100 dark:bg-[#1f242e]">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          <Timer durationMinutes={interview.durationMinutes} onExpire={finishInterview} />
        </header>

        <main className="flex flex-1 flex-col px-8 py-10">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
            {currentQuestion && (
              <>
                <h1 className="text-xl font-medium leading-relaxed text-slate-900 dark:text-white">
                  {currentQuestion.prompt}
                </h1>

                {analyzing ? (
                  <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-3 text-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      AI is analyzing your response...
                    </p>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      rows={10}
                      className="mt-6 flex-1 resize-none rounded-lg border border-slate-300 dark:border-[#1f242e] bg-white dark:bg-[#080a0f] p-4 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />

                    {error && (
                      <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
                        {error}
                      </p>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                      <Button
                        variant="ghost"
                        onClick={() => handleAnswer(true)}
                        className="gap-1.5"
                      >
                        <SkipForward className="h-4 w-4" />
                        Skip question
                      </Button>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="danger"
                          onClick={finishInterview}
                          loading={ending}
                          className="gap-1.5"
                        >
                          <Square className="h-3.5 w-3.5" />
                          End interview
                        </Button>
                        <Button
                          onClick={() => handleAnswer(false)}
                          disabled={!answer.trim()}
                        >
                          Submit answer
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <InterviewSidebar
        interview={interview}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
      />
    </div>
  );
}