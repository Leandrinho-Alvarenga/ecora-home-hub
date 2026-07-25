import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, PrimaryButton } from "@/components/ecora";
import { Input } from "@/components/ui/input";
import { registerUser, saveAuthUser } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (typeof window === "undefined") {
      return;
    }

    const sessionUser = window.localStorage.getItem("ecora-auth-user");
    if (sessionUser) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "Entrar · ECORA" },
      { name: "description", content: "Acesse a área do cliente com seu email e senha." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const errors = useMemo(() => {
    const nextErrors: { email?: string; password?: string; name?: string; confirmPassword?: string } = {};

    if (!email.trim()) {
      nextErrors.email = "Informe seu e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Formato de e-mail inválido.";
    }

    if (!password.trim()) {
      nextErrors.password = "Informe sua senha.";
    } else if (password.length < 8) {
      nextErrors.password = "A senha precisa ter pelo menos 8 caracteres.";
    }

    if (mode === "register") {
      if (!name.trim()) {
        nextErrors.name = "Informe seu nome.";
      }

      if (confirmPassword !== password) {
        nextErrors.confirmPassword = "As senhas não conferem.";
      }
    }

    return nextErrors;
  }, [confirmPassword, email, mode, name, password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (mode === "register") {
        await registerUser(name, email, password, phone);
        await saveAuthUser(email, password);
        toast.success("Conta criada");
      } else {
        await saveAuthUser(email, password);
        toast.success("Login realizado");
      }

      navigate({ to: "/dashboard" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível concluir a ação.";
      setSubmitError(message);
      toast.error(mode === "register" ? "Cadastro inválido" : "Credenciais inválidas");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(31,61,43,0.12),_transparent_60%)] bg-background px-4 py-10 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">ECORA</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {mode === "login" ? "Acesse sua conta" : "Crie sua conta"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Entre com seu e-mail e senha para acompanhar sua obra."
              : "Cadastre-se e libere o acesso à área do cliente."}
          </p>
        </div>

        <Card className="w-full max-w-md">
          <div className="mb-4 flex rounded-full border border-hairline p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setSubmitError("");
              }}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${mode === "login" ? "bg-brand text-brand-foreground" : "text-muted-foreground"}`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setSubmitError("");
              }}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${mode === "register" ? "bg-brand text-brand-foreground" : "text-muted-foreground"}`}
            >
              Cadastrar
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {mode === "register" ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="name">
                    Nome completo
                  </label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="h-11 pl-10"
                      aria-invalid={Boolean(errors.name)}
                    />
                  </div>
                  {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="phone">
                    Telefone
                  </label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
              </>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 pl-10"
                  aria-invalid={Boolean(errors.email)}
                />
              </div>
              {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  placeholder={mode === "register" ? "Crie uma senha" : "Digite sua senha"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 pl-10 pr-10"
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password ? <p className="text-sm text-destructive">{errors.password}</p> : null}
            </div>

            {mode === "register" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="confirmPassword">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="h-11 pl-10"
                    aria-invalid={Boolean(errors.confirmPassword)}
                  />
                </div>
                {errors.confirmPassword ? <p className="text-sm text-destructive">{errors.confirmPassword}</p> : null}
              </div>
            ) : null}

            {submitError ? (
              <p className="rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {submitError}
              </p>
            ) : null}

            <PrimaryButton type="submit" fullWidth loading={isSubmitting}>
              {mode === "register" ? "Criar conta" : "Entrar"}
            </PrimaryButton>
          </form>

          <div className="mt-4 border-t border-hairline pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Acesso restrito a usuários cadastrados. Use o cadastro para criar um novo perfil."
                : "Se preferir, volte para o login e acesse uma conta já criada."}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
