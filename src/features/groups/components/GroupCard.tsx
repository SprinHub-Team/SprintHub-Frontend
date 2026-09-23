import { Link } from "react-router-dom";
import type { Group } from "../types/group.schema";

interface GroupCardProps {
    group: Group;
}

function GroupCard({ group }: GroupCardProps) {
    return (
        <Link 
            to={`/groups/${group.id}`}
            className="group block bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg uppercase shadow-sm">
                        {group.name.substring(0, 2)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {group.name}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {group.visibility === 'public' ? 'Público' : 'Privado'}
                        </span>
                    </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
            </div>

            {group.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {group.description}
                </p>
            )}

            <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <span>Ver grupo &rarr;</span>
            </div>
        </Link>
    );
}

export default GroupCard;
