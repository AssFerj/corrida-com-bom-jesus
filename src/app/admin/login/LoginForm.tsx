"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { loginAction } from "../actions";
import { btnPrimary, fieldCls, labelCls } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className={labelCls}>Senha da organização</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className={fieldCls}
        />
      </div>
      {state && !state.ok && (
        <p role="alert" className="text-sm font-semibold text-primary-container">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${btnPrimary} py-3 text-base`}>
        {pending ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
        Entrar
      </button>
    </form>
  );
}
