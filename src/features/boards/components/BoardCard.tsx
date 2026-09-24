import { Link } from "react-router-dom";
import type { Board } from "../types/board.schema";

interface BoardCardProps {
    board: Board;
}

function BoardCard({ board }: BoardCardProps) {
    return (
        <Link 
            to={`/boards/${board.id}`}
            className="group block bg-white dark:bg-[#1d2125] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {board.title}
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
            </div>
            
            {board.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {board.description}
                </p>
            )}
            
            <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <span>Ver tablero &rarr;</span>
            </div>
        </Link>
    );
}

export default BoardCard;

