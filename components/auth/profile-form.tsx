"use client";

import { useActionState, useEffect } from "react";
import { Bell, Save, Upload } from "lucide-react";
import { updateProfileAction } from "@/lib/actions";
import { useToast } from "@/components/toast";

export function ProfileForm({
  name,
  email,
  avatarUrl,
  emailNotifications
}: {
  name: string;
  email: string;
  avatarUrl?: string | null;
  emailNotifications: boolean;
}) {
  const [state, action, pending] = useActionState(updateProfileAction, {});
  const { showToast } = useToast();

  useEffect(() => {
    if (state.ok && state.message) showToast(state.message);
  }, [showToast, state.ok, state.message]);

  return (
    <form action={action} className="rounded-lg border border-border bg-surface/85 p-6 shadow-sm" encType="multipart/form-data">
      <input type="hidden" name="currentAvatarUrl" value={avatarUrl ?? ""} />
      <h2 className="font-serif text-3xl text-ink">Perfil</h2>
      <div className="mt-6 grid gap-5 lg:grid-cols-[180px_1fr]">
        <div>
          <div className="grid aspect-square place-items-center overflow-hidden rounded-lg border border-border bg-elevated text-4xl font-semibold text-olive">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              name.slice(0, 1).toUpperCase()
            )}
          </div>
          <label className="button-secondary mt-3 w-full cursor-pointer px-3 py-2">
            <Upload className="h-4 w-4" />
            Foto
            <input className="sr-only" name="avatarFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="name">
              Nome
            </label>
            <input className="field" id="name" name="name" defaultValue={name} />
            {state.errors?.name ? <p className="mt-2 text-xs text-tomato">{state.errors.name[0]}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="email">
              Email
            </label>
            <input className="field" id="email" name="email" type="email" defaultValue={email} />
            {state.errors?.email ? <p className="mt-2 text-xs text-tomato">{state.errors.email[0]}</p> : null}
          </div>
          <label className="flex items-center gap-3 rounded-md border border-border bg-elevated px-4 py-3 text-sm font-semibold text-ink sm:col-span-2">
            <input className="accent-olive" type="checkbox" name="emailNotifications" defaultChecked={emailNotifications} />
            <Bell className="h-4 w-4 text-olive" />
            Receber email quando uma receita nova for publicada
          </label>
        </div>
      </div>
      {state.message && !state.ok ? <p className="mt-4 text-sm text-tomato">{state.message}</p> : null}
      <button className="button-primary mt-5" disabled={pending} type="submit">
        <Save className="h-4 w-4" />
        Salvar perfil
      </button>
    </form>
  );
}
