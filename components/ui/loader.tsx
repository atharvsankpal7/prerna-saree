import { Loader2 } from "lucide-react";

interface LoaderProps {
    size?: number;
    className?: string;
}

export const Loader = ({ size = 24, className = "" }: LoaderProps) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <Loader2 className="animate-spin text-primary" size={size} />
        </div>
    );
};

export const FullPageLoader = () => {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Loader size={48} />
        </div>
    )
}
