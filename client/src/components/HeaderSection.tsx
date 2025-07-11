import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    onOpenSettings: () => void;
}

const HeaderSection: React.FC<Props> = ({ onOpenSettings }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                Welcome back! ✨
            </h1>
            <p className="mt-2 text-gray-600 text-base sm:text-lg">
                Track your life balance and get AI-powered insights for growth
            </p>
        </div>

        <Button
            onClick={onOpenSettings}
            variant="outline"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-110 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
            <Settings className="w-4 h-4" />
            Settings
        </Button>
    </div>
);

export default HeaderSection;
