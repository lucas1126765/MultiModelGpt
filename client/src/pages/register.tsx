import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Bot, Check } from "lucide-react";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "用戶名至少需要3個字符")
    .max(20, "用戶名不能超過20個字符")
    .regex(/^[a-zA-Z0-9_]+$/, "用戶名只能包含字母、數字和下劃線"),
  password: z
    .string()
    .min(6, "密碼至少需要6個字符")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "密碼必須包含至少一個字母和一個數字"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密碼確認不匹配",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

interface RegisterResponse {
  user: {
    id: number;
    username: string;
  };
  message: string;
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm): Promise<RegisterResponse> => {
      const { confirmPassword, ...registerData } = data;
      const response = await apiRequest("POST", "/api/auth/register", registerData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "註冊成功",
        description: `歡迎加入，${data.user.username}！請登入開始使用。`,
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "註冊失敗",
        description: error.message || "註冊過程中發生錯誤，請稍後再試",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  const passwordRequirements = [
    { met: password?.length >= 6, text: "至少6個字符" },
    { met: /[a-zA-Z]/.test(password || ""), text: "包含字母" },
    { met: /\d/.test(password || ""), text: "包含數字" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">創建新帳戶</CardTitle>
          <CardDescription>
            註冊以開始使用AI助手進行智能對話
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用戶名</Label>
              <Input
                id="username"
                placeholder="輸入用戶名（3-20個字符）"
                {...register("username")}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密碼</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="輸入密碼"
                  {...register("password")}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Password Requirements */}
              <div className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 text-xs ${
                      req.met ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    <Check
                      className={`h-3 w-3 ${
                        req.met ? "text-green-600" : "text-gray-300"
                      }`}
                    />
                    <span>{req.text}</span>
                  </div>
                ))}
              </div>
              
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">確認密碼</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="再次輸入密碼"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "註冊中..." : "創建帳戶"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              已有帳戶？{" "}
              <Link href="/login" className="text-primary hover:underline">
                立即登入
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}