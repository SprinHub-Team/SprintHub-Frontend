import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";
import { type RegisterFormData, registerSchema } from "../types/auth.schema"
import { useState } from "react";
import { ApiError } from "@/services/api/errors/ApiError";


function RegisterPage(){
  const navigate = useNavigate();
  const { executeRegister, isLoading } = useRegister();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    documentId: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  function handleChange(field: keyof RegisterFormData, value: string) {
    setFormData((previous) => ({ ...previous, [field]: value }));

    setErrors((previous) => ({ ...previous, [field]: undefined }));

    setGeneralError(null);
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrors({});
    setGeneralError(null);

    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};

      for (const issue of validation.error.issues) {
        const field = issue.path[0];

        if (typeof field === "string" && field in formData) {
          fieldErrors[field as keyof RegisterFormData] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    try {
      await executeRegister(validation.data);

      navigate("/login", {
        replace: true,
        state: {
          message: "Cuenta creada correctamente, Ahora puedes iniciar sesión",
        },
      });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        setGeneralError(error.message);
        return;
      }

      setGeneralError("No fue posible crear la cuenta");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      {" "}
      <section
        className="w-full max-w-md overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow)",
        }}
      >
        {" "}
        <div
          className="h-1.5"
          style={{ background: "var(--gradient-main)" }}
        />{" "}
        <div className="p-8">
          {" "}
          <div className="mb-8">
            {" "}
            <div
              className="mb-6 inline-flex h-11 w-11 items-center justify-center"
              style={{
                background: "var(--gradient-main)",
                borderRadius: "var(--radius-sm)",
                color: "var(--on-gradient)",
                boxShadow: "var(--glow)",
                fontWeight: 800,
              }}
            >
              {" "}
              S{" "}
            </div>{" "}
            <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              {" "}
              Crear cuenta{" "}
            </h1>{" "}
            <p className="mt-2 text-sm" style={{ color: "var(--text-light)" }}>
              {" "}
              Crea tu cuenta para comenzar a trabajar en SprintHub.{" "}
            </p>{" "}
          </div>{" "}
          {generalError && (
            <div
              role="alert"
              className="mb-5 rounded-md p-3 text-sm"
              style={{
                color: "var(--danger)",
                background: "var(--danger-bg)",
                border: "1px solid var(--danger-border)",
              }}
            >
              {" "}
              {generalError}{" "}
            </div>
          )}{" "}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {" "}
            <div>
              {" "}
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                {" "}
                Nombre{" "}
              </label>{" "}
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(event) => handleChange("name", event.target.value)}
                disabled={isLoading}
                autoComplete="name"
                className="w-full px-3 py-2.5 outline-none transition"
                style={{
                  color: "var(--text)",
                  background: "var(--surface-2)",
                  border: `1px solid ${errors.name ? "var(--danger)" : "var(--border)"}`,
                  borderRadius: "var(--radius-sm)",
                }}
              />{" "}
              {errors.name && (
                <p
                  className="mt-1.5 text-sm"
                  style={{ color: "var(--danger)" }}
                >
                  {" "}
                  {errors.name}{" "}
                </p>
              )}{" "}
            </div>{" "}
            <div>
              {" "}
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                {" "}
                Correo electrónico{" "}
              </label>{" "}
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                disabled={isLoading}
                autoComplete="email"
                className="w-full px-3 py-2.5 outline-none transition"
                style={{
                  color: "var(--text)",
                  background: "var(--surface-2)",
                  border: `1px solid ${errors.email ? "var(--danger)" : "var(--border)"}`,
                  borderRadius: "var(--radius-sm)",
                }}
              />{" "}
              {errors.email && (
                <p
                  className="mt-1.5 text-sm"
                  style={{ color: "var(--danger)" }}
                >
                  {" "}
                  {errors.email}{" "}
                </p>
              )}{" "}
            </div>{" "}
            <div>
              {" "}
              <label
                htmlFor="documentId"
                className="mb-2 block text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                {" "}
                Documento{" "}
              </label>{" "}
              <input
                id="documentId"
                type="text"
                value={formData.documentId}
                onChange={(event) =>
                  handleChange("documentId", event.target.value)
                }
                disabled={isLoading}
                className="w-full px-3 py-2.5 outline-none transition"
                style={{
                  color: "var(--text)",
                  background: "var(--surface-2)",
                  border: `1px solid ${errors.documentId ? "var(--danger)" : "var(--border)"}`,
                  borderRadius: "var(--radius-sm)",
                }}
              />{" "}
              {errors.documentId && (
                <p
                  className="mt-1.5 text-sm"
                  style={{ color: "var(--danger)" }}
                >
                  {" "}
                  {errors.documentId}{" "}
                </p>
              )}{" "}
            </div>{" "}
            <div>
              {" "}
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                {" "}
                Contraseña{" "}
              </label>{" "}
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(event) =>
                  handleChange("password", event.target.value)
                }
                disabled={isLoading}
                autoComplete="new-password"
                className="w-full px-3 py-2.5 outline-none transition"
                style={{
                  color: "var(--text)",
                  background: "var(--surface-2)",
                  border: `1px solid ${errors.password ? "var(--danger)" : "var(--border)"}`,
                  borderRadius: "var(--radius-sm)",
                }}
              />{" "}
              {errors.password && (
                <p
                  className="mt-1.5 text-sm"
                  style={{ color: "var(--danger)" }}
                >
                  {" "}
                  {errors.password}{" "}
                </p>
              )}{" "}
            </div>{" "}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2.5 font-semibold transition"
              style={{
                color: "var(--on-gradient)",
                background: "var(--gradient-main)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                opacity: isLoading ? 0.65 : 1,
              }}
            >
              {" "}
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}{" "}
            </button>{" "}
          </form>{" "}
          <div className="my-6 h-px" style={{ background: "var(--border)" }} />{" "}
          <p
            className="text-center text-sm"
            style={{ color: "var(--text-light)" }}
          >
            {" "}
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-semibold transition"
              style={{ color: "var(--secondary)" }}
            >
              {" "}
              Iniciar sesión{" "}
            </Link>{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
    </main>
  );
}

export default RegisterPage;