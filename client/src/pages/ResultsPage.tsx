import { useEffect, useState } from "react";
import { WheelOfLifeRadar } from "@/components/WheelOfLifeRadar";
import { Button } from "@/components/ui/button";
import { CategoryValue } from "@/types/categories";
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

const mockCategories: CategoryValue[] = [
    { name: "Career", value: 10, color: "#8b5cf6" },
    { name: "Finances", value: 1, color: "#3b82f6" },
    { name: "Growth", value: 5, color: "#10b981" },
    { name: "Purpose", value: 8, color: "#ec4899" },
    { name: "Mental Health", value: 4, color: "#06b6d4" },
    { name: "Physical Health", value: 3, color: "#f59e0b" },
    { name: "Family", value: 4, color: "#ef4444" },
    { name: "Friends", value: 4, color: "#6366f1" },
    { name: "Romance", value: 2, color: "#e879f9" },
    { name: "Spirituality", value: 3, color: "#22d3ee" },
    { name: "Personal Development", value: 5, color: "#a855f7" },
    { name: "Entertainment", value: 5, color: "#10b981" },
];

const SERVER = import.meta.env.VITE_GENAI_SERVER_URL as string;

export default function ResultsPage() {
    const [categories] = useState<CategoryValue[]>(mockCategories);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("feedback");
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const sendMessage = async () => {
        if (!chatInput.trim()) return;

        const newMessages: ChatMessage[] = [...messages, { role: "user", content: chatInput }];
        setMessages(newMessages);
        setChatInput("");
        setLoading(true);

        try {
            const res = await fetch(`${SERVER}/chat`, {
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
        const fetchFeedback = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${SERVER}/generate-feedback`, {
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
                <h1 className="text-4xl font-bold text-gray-900">Assessment Report</h1>
                <p className="text-gray-500 text-sm">{new Date().toLocaleDateString()}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Radar Chart */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md max-w-2xl">
                    <WheelOfLifeRadar
                        categories={categories}
                        onChange={() => {
                            /* Read-only */
                        }}
                    />
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
                                    <CardTitle>Feedback</CardTitle>
                                    <CardDescription>AI-generated insights about your results</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <h2 className="text-xl font-semibold">AI Feedback</h2>
                                    {loading ? (
                                        <p className="text-gray-500 italic">Generating feedback...</p>
                                    ) : (
                                        <div className="whitespace-pre-line text-gray-800 text-sm leading-relaxed">
                                            {feedback}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={() => setActiveTab("chat")}>
                                        Want to talk about it?
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Chat Tab */}
                        <TabsContent value="chat">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Chat</CardTitle>
                                    <CardDescription>Talk to your AI coach</CardDescription>
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
                                        <Button onClick={sendMessage} disabled={loading}>
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
