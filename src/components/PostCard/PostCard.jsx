// components/PostCard.jsx
import React, { useContext, useMemo } from "react";
import { DataContext } from "../../context/DataContext";

const ApprovedBadge = () => (
    <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 ring-1 ring-green-200 px-2.5 py-1 text-xs font-medium">
        Approved
    </span>
);

const PostCard = ({ item }) => {
    const { approveDocument, declineDocument, adminMode } = useContext(DataContext);

    // parse postedBy for display (it’s a stringified JSON in your sample)
    const postedBy = useMemo(() => {
        try { return item.postedBy ? JSON.parse(item.postedBy) : null; }
        catch { return null; }
    }, [item.postedBy]);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col gap-3">
            {/* Example header */}
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                <div className="text-[11px] text-gray-500">{new Date(item.$createdAt).toLocaleDateString()}</div>
            </div>

            {/* Optional: show name */}
            {postedBy?.name && (
                <div className="text-xs text-gray-600">Posted by {postedBy.name}</div>
            )}

            {/* … image, description, etc. … */}

            <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500 capitalize">{item.type}</span>

                {item.approvedByAdmin ? (
                    <ApprovedBadge />
                ) : adminMode ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => approveDocument(item.$collectionId, item.$id)}
                            className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => declineDocument(item.$collectionId, item.$id)}
                            className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                            title="Keep hidden from public list"
                        >
                            Decline
                        </button>
                    </div>
                ) : (
                    <span className="text-xs text-amber-600">Pending review</span>
                )}
            </div>
        </div>
    );
};

export default PostCard;
