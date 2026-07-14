import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <section className="container-page grid min-h-[calc(100vh-220px)] place-items-center py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface/85 p-6 shadow-soft">
        <p className="eyebrow mb-2">Bem-vindo de volta</p>
        <h1 className="mb-6 font-serif text-4xl text-ink">Entrar</h1>
        <LoginForm />
      </div>
    </section>
  );
}
