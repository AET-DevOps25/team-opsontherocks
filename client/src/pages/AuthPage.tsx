// src/pages/AuthPage.tsx
import {type FormEvent, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const authServer = import.meta.env.VITE_AUTH_URL;
const SERVER = import.meta.env.VITE_SERVER_URL as string | undefined;


type AuthTab = "login" | "register";

interface Props {
    /**
     * Callback fired after a successful response from the auth server.
     * Should return `true` if the session is valid so we can navigate forward.
     */
    onLoginSuccess: () => Promise<boolean>;
}

async function setupDefaultCategories() {
    try {
        const res = await fetch(`${SERVER}/users/me/categories/defaults`, {
            method: "POST",
            mode: "cors",
            credentials: "include",
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to create default categories:", errorText);
        } else {
            console.log("Default categories created successfully.");
        }
    } catch (err) {
        console.error("Network error while creating default categories:", err);
    }
}

export default function AuthPage({ onLoginSuccess }: Props) {
    const navigate = useNavigate();

    const [tab, setTab] = useState<AuthTab>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authServer) setError("Auth server URL missing.");
    }, []);

    /**
     * Send the credential payload to the auth server.
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const endpoint = tab === "login" ? "/login" : "/register";
        const body: Record<string, string> = { email, password };
        if (tab === "register") body.name = name;

        try {
            const res = await fetch(`${authServer}${endpoint}`.trim(), {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const text = await res.text();
            if (!res.ok) {
                setError(text || `Error ${res.status}`);
            } else {
                if (tab === "register") {
                    await setupDefaultCategories();
                }
                const ok = await onLoginSuccess();
                if (ok) navigate("/wheel");
                else setError("Session check failed after login.");
            }
        } catch (err) {
            setError((err as Error).message || "Network error.");
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setEmail("");
        setPassword("");
        setName("");
        setError(null);
    };

    // Animation config
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className="min-h-screen bg-muted flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <Card className="w-full max-w-md shadow-2xl rounded-2xl">
                <Tabs
                    defaultValue="login"
                    value={tab}
                    onValueChange={(value: string) => {
                        setTab(value as AuthTab);
                        resetState();
                    }}
                >
                    <CardHeader className="pb-0">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {tab === "login" ? "Welcome back 👋" : "Create an account"}
                        </CardTitle>
                        <CardDescription>
                            {tab === "login"
                                ? "Enter your credentials below to sign in."
                                : "It only takes a moment."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <TabsList className="mb-6 w-full grid grid-cols-2 gap-2 bg-muted/50 p-1 rounded-xl">
                            <TabsTrigger
                                value="login"
                                className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                                Login
                            </TabsTrigger>
                            <TabsTrigger
                                value="register"
                                className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                                Register
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value={tab} className="space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {tab === "register" && (
                                    <Input
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                )}
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />

                                {error && (
                                    <p className="text-sm font-medium text-destructive">{error}</p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl font-semibold"
                                >
                                    {loading
                                        ? tab === "login"
                                            ? "Logging in…"
                                            : "Registering…"
                                        : tab === "login"
                                            ? "Login"
                                            : "Register"}
                                </Button>
                            </form>
                        </TabsContent>
                    </CardContent>

                    <Separator />

                    <CardFooter className="text-center text-xs text-muted-foreground">
                        <p>
                            {tab === "login"
                                ? "New here? Register for free."
                                : "Already have an account? Log in."}
                        </p>
                    </CardFooter>
                </Tabs>
            </Card>
        </motion.div>
    );
}
