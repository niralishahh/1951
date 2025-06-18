import React from 'react';
import { Trash2, Eye, Pencil } from 'lucide-react';

function truncate(str, n) {
    return str.length > n ? str.slice(0, n - 1) + "..." : str;
}

export default function RecipeCard({ title, description, onView, onDelete, onEdit}) {
    return (
        <div className="flex flex-col justify-between max-w-lg p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className=" font-xs text-gray-700 line-clamp-3 mb-4">{description}</p>
            </div>
            <div className="flex items-center">
                <button
                    onClick={onView}
                    className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                    title="View"
                >
                    <Eye size={16} className="mr-1"/>
                    View
                </button>
                <div className="ml-auto flex items-center space-x-2">
                    <button
                        onClick={onEdit}
                        className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                        title="Edit"
                    >
                        <Pencil size={16} className="mr-1"/>
                        Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}