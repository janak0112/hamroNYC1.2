// pages/PostSubmitted.jsx
import React from "react";
import { CheckCircle2, ArrowLeft, Home } from "lucide-react";
import { BRAND, cardBase, btnBase, btnOutline } from "../../pages/Admin/ui"; // ← adjust path if needed

/**
 * PostSubmitted
 * Props:
 *  - postHref: string (where the user can view their post)
 *  - homeHref: string (home route)
 *  - onViewPost?: () => void (optional handler instead of link)
 *  - onGoHome?: () => void (optional handler instead of link)
 */
export default function PostSubmitted({
  postHref = "/my-posts",
  homeHref = "/",
  onViewPost,
  onGoHome,
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className={`${cardBase} p-8 sm:p-10`}>
        {/* Success header */}
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-emerald-50 p-2.5">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">
              Posted successfully!
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Your post has been submitted and is now awaiting admin approval.
              We’ll notify you when it goes live.
            </p>
          </div>
        </div>

        {/* What happens next */}
        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-800">
            What happens next?
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            <li>• An admin will review your post for accuracy and safety.</li>
            <li>• Once approved, it will appear publicly in the feed.</li>
            <li>• You can edit or remove it anytime from your dashboard.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {/* Primary: See my posting */}
          {onViewPost ? (
            <button
              onClick={onViewPost}
              className={`${btnBase} text-white transition hover:opacity-95 focus:ring-2 focus:ring-offset-2`}
              style={{ backgroundColor: BRAND }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              See my posting
            </button>
          ) : (
            <a
              href={postHref}
              className={`${btnBase} text-white transition hover:opacity-95 focus:ring-2 focus:ring-offset-2`}
              style={{ backgroundColor: BRAND }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              See my posting
            </a>
          )}

          {/* Secondary: Home */}
          {onGoHome ? (
            <button
              onClick={onGoHome}
              className={`${btnBase} ${btnOutline} transition hover:shadow-sm focus:ring-2 focus:ring-offset-2`}
              style={{ outlineColor: BRAND }}
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </button>
          ) : (
            <a
              href={homeHref}
              className={`${btnBase} ${btnOutline} transition hover:shadow-sm focus:ring-2 focus:ring-offset-2`}
              style={{ outlineColor: BRAND }}
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </a>
          )}
        </div>

        {/* Small tip */}
        <p className="mt-4 text-xs text-gray-500">
          Tip: You can find and manage all your posts in{" "}
          <a
            href="/account/my-posts"
            className="font-medium text-gray-700 underline decoration-[#CD4A3D]/30 underline-offset-4 hover:text-gray-900"
          >
            My Posts
          </a>
          .
        </p>
      </div>
    </div>
  );
}
