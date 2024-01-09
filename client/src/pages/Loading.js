import { Loader2 } from "lucide-react";

function Loading () {
    return (
        <>
            <div className="flex justify-center items-center w-full h-[90vh]">
    
                <Loader2 className="w-48 h-48 text-blue-950 animate-spin"/>

            </div>
        </>
    )
}

export default Loading;