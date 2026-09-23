import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import * as userService from "../services/userService";
import { ApiError } from "@/services/api/errors/ApiError";
import Input from "@/components/common/ui/Input";
import Button from "@/components/common/ui/Button";
import Alert from "@/components/common/ui/Alert";
import { z } from "zod";

const editProfileSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
    email: z.string().email('Ingresa un correo electrónico válido.'),
});

export default function ProfilePage() {
    const { user, setSession, token } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<'name' | 'email', string>>>({});

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleChange = (field: 'name' | 'email', value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setErrors({});

        if (!user || !token) return;

        const validation = editProfileSchema.safeParse(formData);

        if (!validation.success) {
            const fieldErrors: Partial<Record<'name' | 'email', string>> = {};
            for (const issue of validation.error.issues) {
                const field = issue.path[0] as 'name' | 'email';
                fieldErrors[field] = issue.message;
            }
            setErrors(fieldErrors);
            return;
        }

        setIsLoading(true);
        try {
            const updatedUser = await userService.updateUser(user.id, validation.data);
            setSession({ token, user: updatedUser });
            setSuccessMessage('Perfil actualizado exitosamente.');
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('No fue posible actualizar el perfil.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Mi Perfil</h1>
                <p className="text-[var(--text-secondary)] mt-2">
                    Actualiza tu información personal.
                </p>
            </div>

            <div className="bg-[var(--surface)] p-8 rounded-xl border border-[var(--border)] shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success" className="bg-green-50 text-green-700 border-green-200">{successMessage}</Alert>}

                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-3xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-medium">{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
                            <p className="text-sm text-[var(--text-secondary)]">ID: {user?.id}</p>
                        </div>
                    </div>

                    <Input
                        id="name"
                        label="Nombre completo"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        error={errors.name}
                        disabled={isLoading}
                    />

                    <Input
                        id="email"
                        type="email"
                        label="Correo electrónico"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        error={errors.email}
                        disabled={isLoading}
                    />

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" isLoading={isLoading}>
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
