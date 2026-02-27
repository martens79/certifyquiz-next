import Link from "next/link";

export default function PremiumCancelPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Payment cancelled</h1>
      <p className="mb-10 text-gray-600">Your subscription was not activated.</p>

      <div className="flex flex-col gap-4">
        <Link href="/premium" className="bg-black text-white px-6 py-3 rounded-lg">
          Try again
        </Link>
        <Link href="/" className="border px-6 py-3 rounded-lg">
          Back to home
        </Link>
      </div>
    </div>
  );
}