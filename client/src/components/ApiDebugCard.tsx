import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTestEndpoints } from "@/api/testEndpoints";

const ApiDebugCard: React.FC = () => {
    const { userData, healthCheckData, genAiHelloData } = useTestEndpoints();
    const Block = ({ title, data }: { title: string; data: unknown }) => (
        <div>
            <h4 className="font-semibold text-gray-700 mb-1">{title}</h4>
            {data ? (
                <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded-md overflow-auto max-h-40">
          {JSON.stringify(data, null, 2)}
        </pre>
            ) : (
                <p className="text-gray-500">Loading…</p>
            )}
        </div>
    );

    return (
        <Card className="rounded-3xl bg-white shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl text-gray-900">API Debug Info</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                    Raw responses from integrated API calls.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-3">
                <Block title="User (/users/me)" data={userData} />
                <Block title="Health (/healthCheck)" data={healthCheckData} />
                <Block title="GenAI (/hello)" data={genAiHelloData} />
            </CardContent>
        </Card>
    );
};

export default ApiDebugCard;
