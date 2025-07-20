import React, { useEffect, useState } from "react";
import { WheelOfLifeRadar } from "@/components/WheelOfLifeRadar";
import { Button } from "@/components/ui/button";
import { CategoryValue } from "@/types/categories";
import { useReports } from "@/hooks/useReports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Type-safe message definition
type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};
type Report = {
    scores: Record<string, number>;
    notes?: string;
    chat?: { message: string; sender: "USER" | "AI" }[];
};

const GENAI_SERVER = import.meta.env.VITE_GENAI_URL as string; //genai server
//const SERVER = import.meta.env.VITE_SERVER_URL as string; // WheelOfLife server

export default function ResultsPage() {
    const [categories, setCategories] = useState<CategoryValue[]>([]);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("feedback");
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [report,setReport] = useState<Report |string | null>(null);
    const { reports, loading: reportsLoading } = useReports();
   // const [latestReport, setLatestReport] = useState<Report | null>(null);


    const sendMessage = async () => {
        if (!chatInput.trim()) return;

        const newMessages: ChatMessage[] = [...messages, { role: "user", content: chatInput }];
        setMessages(newMessages);
        setChatInput("");
        setLoading(true);

        try {
            const res = await fetch(`${GENAI_SERVER}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ message: chatInput }),
            });

            const data = await res.json();

            setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        } catch (err) {
            console.error("Chat error:", err);
            setMessages([...newMessages, { role: "assistant", content: "❌ Failed to get response." }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (reports.length === 0) return;

        const latest = reports[0];
        setReport(latest);

        if (latest?.scores && typeof latest.scores === "object") {
            const parsed = Object.entries(latest.scores).map(([name, value]) => ({
                name,
                value: typeof value === "number" ? value : parseFloat(value as string),
                color: "#9410b9",
            }));
            setCategories(parsed);
        } else {
            console.warn("No valid scores found in report.");
            setCategories([]);
        }
    }, [reports]);


    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${GENAI_SERVER}/generate-feedback`, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();
                setFeedback(data.feedback || "No feedback received.");
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setFeedback("❌ Failed to load feedback.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="min-h-screen bg-[#FAF9FB] px-6 py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Progress Report</h1>
                    <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/")}
                        className="mt-4"
                    >
                        ← Back
                    </Button>
                </div>
                <p className="text-gray-500 text-sm">{new Date().toLocaleDateString()}</p>
            </div>



            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Radar Chart */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md max-w-2xl">
                    <WheelOfLifeRadar categories={categories} readOnly />
                </div>

                {/* Right: Feedback/Chat Tabs */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md max-w-2xl">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="feedback">Feedback</TabsTrigger>
                            <TabsTrigger value="chat">Chat</TabsTrigger>
                        </TabsList>

                        {/* Feedback Tab */}
                        <TabsContent value="feedback">
                            <Card>
                                <CardHeader>
                                    <CardTitle>AI Feedback ✨</CardTitle>
                                    <CardDescription>AI-generated insights about your results</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">

                                    {loading ? (
                                        <p className="text-gray-500 italic">Generating feedback...</p>
                                    ) : (
                                        <div className="whitespace-pre-line text-gray-800 text-sm leading-relaxed">
                                            {feedback}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={() => setActiveTab("chat")}
                                            className="h-9 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white shadow hover:scale-105 transition">
                                        Want to talk about it?
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Chat Tab */}
                        <TabsContent value="chat">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Talk to your AI coach 🤗</CardTitle>
                                    <CardDescription>What's on your mind?</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <ScrollArea className="h-96 pr-4 border rounded-md p-3">
                                        <div className="flex flex-col space-y-3">
                                            {messages.map((msg, i) => (
                                                <div
                                                    key={i}
                                                    className={`p-3 rounded-xl max-w-[75%] whitespace-pre-wrap text-sm ${
                                                        msg.role === "user"
                                                            ? "bg-blue-100 self-end text-right"
                                                            : "bg-gray-100 self-start text-left"
                                                    }`}
                                                >
                                                    {msg.content}
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="Ask your AI coach..."
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !loading) sendMessage();
                                            }}
                                            disabled={loading}
                                        />
                                        <Button onClick={sendMessage} disabled={loading}
                                                className="h-9 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white shadow hover:scale-105 transition">
                                            {loading ? "..." : "Send"}

                                        </Button>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="secondary" onClick={() => setActiveTab("feedback")}>
                                        Back to Feedback
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}