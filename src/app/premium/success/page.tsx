import Link from "next/link";

export default function PremiumSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Premium activated 🎉</h1>
      <p className="mb-4 text-lg">Your 7-day free trial has started.</p>
      <p className="mb-10 text-gray-600">
        You now have full access to explanations and Premium features.
      </p>

      <div className="flex flex-col gap-4">
        <Link href="/quiz" className="bg-black text-white px-6 py-3 rounded-lg">
          Go to quizzes
        </Link>
        <Link href="/" className="border px-6 py-3 rounded-lg">
          Back to home
        </Link>
      </div>
    </div>
  );
}