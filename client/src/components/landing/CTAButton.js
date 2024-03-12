import { useNavigate } from 'react-router-dom'
export default function CTAButton({ text, to, href }) {
    const navigate = useNavigate()
    if (href) {
        return (
            <>
                <a
                    href={href}
                    className="group relative z-0 mt-6 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-pipelines-gray-100 px-10 py-2 font-medium tracking-tighter text-black/80 hover:text-white"
                >
                    <span className="absolute h-0 w-0 rounded-full bg-pipeline-blue-200 transition-all duration-500 ease-out group-hover:h-56 group-hover:w-56"></span>
                    <span className="absolute inset-0 -mt-1 h-full w-full rounded-lg bg-gradient-to-b from-transparent via-transparent to-gray-200 opacity-30"></span>
                    <span className="relative">{text}</span>
                </a>
            </>
        )
    }

    return (
        <>
            <a
                onClick={() => navigate(to)}
                className="group relative z-0 mt-6 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-pipelines-gray-100 px-10 py-2 font-medium tracking-tighter text-black/80 hover:text-white"
            >
                <span className="absolute h-0 w-0 rounded-full bg-pipeline-blue-200 transition-all duration-500 ease-out group-hover:h-56 group-hover:w-56"></span>
                <span className="absolute inset-0 -mt-1 h-full w-full rounded-lg bg-gradient-to-b from-transparent via-transparent to-gray-200 opacity-30"></span>
                <span className="relative">{text}</span>
            </a>
        </>
    )
}
