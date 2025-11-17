'use client';

// 1. Import all necessary hooks and components
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Post, Comment, Author } from '@prisma/client';
import { ExternalLink, Wand2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

// 2. Import your category color data
import { categoryDetails } from '@/data/mockData';

// 3. Create a color lookup map
const colorMap = new Map<string, string>();
for (const category of categoryDetails) {
  colorMap.set(category.name, category.color);
}
const defaultColor = '#9ca3af'; // gray-400 for 'Uncategorized'

// Define the type for a Post including its relations
type PostWithRelations = Post & {
  comments: (Comment & {
    author: Author | null;
  })[];
};

const DatabaseTable = () => {
  const [data, setData] = useState<PostWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostWithRelations | null>(
    null
  );

  const router = useRouter();

  // Fetch all posts from your API on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/posts');
        const allPosts = await response.json();
        setData(allPosts);
      } catch (error) {
        console.error('Failed to load database data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to toggle a row's expanded state
  const toggleRow = (id: string) => {
    setExpandedRows(
      (prev) =>
        prev.includes(id)
          ? prev.filter((rowId) => rowId !== id) // Collapse
          : [...prev, id] // Expand
    );
  };

  // Function to handle clicking the "Extract" button
  const handleExtractClick = (content: string) => {
    sessionStorage.setItem('textToExtract', content);
    router.push('/keyword-extractor');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold">Database</h3>
        <p className="mt-2 text-gray-600">Loading data from database...</p>
      </div>
    );
  }

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) setSelectedPost(null);
      }}
    >
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold">
            Database - All Posts ({data.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">
                  CATEGORY
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  CONTENT
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  COMMENTS
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  PERMALINK
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  EXTRACT
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((post) => {
                const isExpanded = expandedRows.includes(post.id);
                const categoryName = post.category || 'Uncategorized';
                const categoryColor =
                  colorMap.get(categoryName) || defaultColor;

                return (
                  <tr key={post.id}>
                    {/* Category Cell */}
                    <td className="p-4 align-top w-1/6">
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                          style={{ backgroundColor: categoryColor }}
                        ></span>
                        <span className="text-sm truncate">{categoryName}</span>
                      </div>
                    </td>

                    {/* Expandable Content Cell */}
                    <td className="p-4 align-top w-3/6">
                      <p
                        onClick={() => toggleRow(post.id)}
                        className={`cursor-pointer ${
                          isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-3'
                        }`}
                      >
                        {post.content}
                      </p>
                    </td>

                    {/* Comments Modal Trigger Cell */}
                    <td className="p-4 align-top w-1/6">
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setSelectedPost(post)}
                          disabled={post.commentsCount === 0}
                          className="font-medium text-blue-600 hover:underline disabled:text-gray-500 disabled:no-underline"
                        >
                          {post.commentsCount}
                        </button>
                      </DialogTrigger>
                    </td>

                    {/* Permalink Cell */}
                    <td className="p-4 align-top w-1/6">
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500 hover:text-blue-700 hover:underline"
                      >
                        View Post
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </td>

                    {/* Extract Keywords Cell */}
                    <td className="p-4 align-top w-1/12">
                      <button
                        onClick={() => handleExtractClick(post.content)}
                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-full"
                        title="Extract Keywords"
                      >
                        <Wand2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Comments Modal --- */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription className="line-clamp-2">
            Comments for: {selectedPost?.content || 'Post'}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto space-y-4 p-1">
          {selectedPost?.comments && selectedPost.comments.length > 0 ? (
            selectedPost.comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 bg-gray-50 rounded-lg border"
              >
                <p className="font-semibold text-sm text-gray-800">
                  {comment.author?.name || 'Anonymous'}
                </p>
                <p className="text-gray-700">{comment.message}</p>

                {/* --- 4. THIS IS THE NEW BUTTON --- */}
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleExtractClick(comment.message)}
                    className="flex items-center text-xs text-purple-600 hover:underline"
                  >
                    <Wand2 size={14} className="mr-1" /> Extract Keywords
                  </button>
                </div>
                {/* --- END NEW BUTTON --- */}
              </div>
            ))
          ) : (
            <p>There are no comments on this post.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DatabaseTable;
