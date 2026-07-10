import { notFound } from "next/navigation";
import { algorithms } from "@/data/seed/algorithms";
import { getQuestionsForAlgorithm } from "@/data/seed/questions";
import { QuizClient } from "./QuizClient";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ algorithmId: string }>;
}) {
  const { algorithmId } = await params;
  const algorithm = algorithms.find((a) => a.id === algorithmId);

  if (!algorithm) {
    notFound();
  }

  const questions = getQuestionsForAlgorithm(algorithm.id, 5, algorithm.name, algorithm.slug);

  return <QuizClient algorithm={algorithm} questions={questions} />;
}
