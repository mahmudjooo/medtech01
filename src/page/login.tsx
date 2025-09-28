import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rolePath } from "@/routes/role-path";
import { api } from "@/service/api";
import { useAuth } from "@/store/auth.store";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const { data } = await api.post("/auth/login", { email, password });
    login(data.access_token, data.user);
    if (data.user.mustChangePassword) {
      nav("/change-password", { replace: true });
      return;
    }

    nav(rolePath[data.user.role as keyof typeof rolePath], { replace: true });

    nav(rolePath[data.user.role as keyof typeof rolePath], { replace: true });
  }
  return (
    <div className="w-full h-1/2 flex  justify-center mt-[200px]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2"></CardFooter>
      </Card>
    </div>
  );
};

export default Login;
