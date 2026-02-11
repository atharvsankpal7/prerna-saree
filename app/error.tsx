'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Something went wrong!</h2>
            <p className="mb-8 text-gray-600">
                We apologize for the inconvenience. Please try again.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="rounded-full bg-[#93316a] px-6 py-2 text-white hover:bg-[#7a2858] transition-colors"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="rounded-full border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
