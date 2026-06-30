import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <section className="container-page grid min-h-[calc(100vh-220px)] place-items-center py-12">
      <div className="w-full max-w-xl rounded-lg border border-ink/10 bg-white/75 p-6 shadow-soft">
        <p className="eyebrow mb-2">Comece sua biblioteca</p>
        <h1 className="mb-6 font-serif text-4xl">Criar conta</h1>
        <RegisterForm />
      </div>
    </section>
  );
}
