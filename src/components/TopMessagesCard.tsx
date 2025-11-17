'use client';

// 1. Import useState and useMemo for sorting
import React, { useState, useMemo } from 'react';
import {
  MoreHorizontal,
  Wand2,
  ExternalLink,
  TrendingUp, // Icon for Reactions
  MessageCircle, // Icon for Comments
  Share, // Icon for Shares
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react';
// 2. Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
// 3. Import Prisma types
import type { Post as PostType, Comment, Author } from '@prisma/client';
// 4. Import mock data *only* for the calendar days
import type { CalendarDay } from '@/data/mockData';
import { calendarDaysData } from '@/data/mockData'; // Import the actual data for the calendar
import { useRouter } from 'next/navigation';

// 5. Define the type for a Post including its relations
type PostWithRelations = PostType & {
  comments: (Comment & { author: Author | null })[];
};

type FilterKey = 'reactionsCount' | 'commentsCount' | 'sharesCount';

// 6. Update the props to accept the full list of posts
type CardProps = {
  messages: PostWithRelations[]; // This component now needs the full post object with comments
  onExtract: (post: PostType) => void;
};

// Map platform names from your database to icons
const platformIconMap: { [key: string]: React.ElementType } = {
  Facebook: Facebook,
  Twitter: Twitter,
  Instagram: Instagram,
  default: MoreHorizontal,
};

// --- Reusable Button Component ---
const FilterButton = ({
  text,
  icon: Icon,
  isActive,
  onClick,
}: {
  text: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
      isActive ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon size={16} />
    {text}
  </button>
);

const TopMessagesCard = ({ messages, onExtract }: CardProps) => {
  const [filter, setFilter] = useState<FilterKey>('reactionsCount');
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostWithRelations | null>(
    null
  );
  const router = useRouter();

  const top5Messages = useMemo(() => {
    return [...messages].sort((a, b) => b[filter] - a[filter]).slice(0, 5);
  }, [messages, filter]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // This function sends text from a COMMENT to the Keyword Extractor page
  const handleCommentExtractClick = (content: string) => {
    sessionStorage.setItem('textToExtract', content);
    router.push('/keyword-extractor');
  };

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) setSelectedPost(null);
      }}
    >
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-lg">Top Messages by engagement</h3>

        {/* Filter buttons */}
        <div className="flex space-x-2 my-4">
          <FilterButton
            text="Top Reactions"
            icon={TrendingUp}
            isActive={filter === 'reactionsCount'}
            onClick={() => setFilter('reactionsCount')}
          />
          <FilterButton
            text="Top Comments"
            icon={MessageCircle}
            isActive={filter === 'commentsCount'}
            onClick={() => setFilter('commentsCount')}
          />
          <FilterButton
            text="Top Shares"
            icon={Share}
            isActive={filter === 'sharesCount'}
            onClick={() => setFilter('sharesCount')}
          />
        </div>

        {/* Message list */}
        <div className="space-y-4">
          {top5Messages.map((item) => {
            const isExpanded = expandedRows.includes(item.id);
            const PlatformIcon =
              platformIconMap[item.platform] || platformIconMap.default;

            return (
              <div key={item.id} className="flex items-start gap-4">
                {/* Timestamp */}
                <div className="w-20 text-xs text-gray-500 pt-1 text-right">
                  <p>
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p>
                    {new Date(item.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {/* Post Content */}
                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-sm flex items-center">
                        <PlatformIcon className="w-4 h-4 mr-2" />
                        {item.platform}
                      </span>
                      <span
                        className="flex items-center gap-1 text-xs text-gray-500"
                        title="Reactions"
                      >
                        <TrendingUp size={14} /> {item.reactionsCount}
                      </span>
                      <span
                        className="flex items-center gap-1 text-xs text-gray-500"
                        title="Comments"
                      >
                        <MessageCircle size={14} /> {item.commentsCount}
                      </span>
                      <span
                        className="flex items-center gap-1 text-xs text-gray-500"
                        title="Shares"
                      >
                        <Share size={14} /> {item.sharesCount}
                      </span>
                    </div>

                    <DialogTrigger asChild>
                      <button
                        onClick={() => setSelectedPost(item)}
                        disabled={item.commentsCount === 0}
                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full disabled:text-gray-300 disabled:hover:bg-transparent"
                        title="View Comments"
                      >
                        <MessageCircle size={16} />
                      </button>
                    </DialogTrigger>
                  </div>

                  <p
                    onClick={() => toggleRow(item.id)}
                    className={`text-sm text-gray-700 mb-3 cursor-pointer ${
                      isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-2'
                    }`}
                  >
                    {item.content}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 mt-2">
                    <a
                      href={item.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-blue-500 hover:underline"
                    >
                      <ExternalLink size={14} className="mr-1" /> View Post
                    </a>
                    <button
                      onClick={() => onExtract(item)} // This correctly calls the function for the POST
                      className="flex items-center text-xs text-purple-600 hover:underline"
                      title="Suggest Keywords"
                    >
                      <Wand2 size={14} className="mr-1" /> Extract Keywords
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- The Comments Modal --- */}
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
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleCommentExtractClick(comment.message)}
                    className="flex items-center text-xs text-purple-600 hover:underline"
                  >
                    <Wand2 size={14} className="mr-1" /> Extract Keywords
                  </button>
                </div>
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

export default TopMessagesCard;
