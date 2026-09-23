import { useEffect, useState } from "react";
import { useGroups } from "../hooks/useGroups";
import GroupCard from "../components/GroupCard";
import { CreateGroupModal } from "../components/CreateGroupModal";
import Alert from "@/components/common/ui/Alert";
import Button from "@/components/common/ui/Button";

function GroupsPage() {
    const { groups, isLoading, error, fetchGroups } = useGroups();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Mis Grupos</h1>
                    <p className="text-[var(--text-secondary)] mt-2">
                        Gestiona tus grupos de trabajo y colabora con tu equipo.
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>Nuevo Grupo</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-[var(--surface)] animate-pulse rounded-xl border border-[var(--border)]"></div>
                    ))}
                </div>
            ) : (
                <>
                    {groups.length === 0 ? (
                        <div className="text-center py-12 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                            <p className="text-[var(--text-secondary)] mb-4">Aún no perteneces a ningún grupo.</p>
                            <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>Crear mi primer grupo</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groups.map(group => (
                                <GroupCard key={group.id} group={group} />
                            ))}
                        </div>
                    )}
                </>
            )}

            <CreateGroupModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
        </div>
    );
}

export default GroupsPage;
