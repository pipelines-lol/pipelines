import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <>
            <div className="flex h-20 w-full flex-row items-center justify-between bg-transparent bg-opacity-50 px-12 backdrop-blur-lg backdrop-filter">
                <h1 className="font-light text-white">
                    @2024 pipelines.lol. All rights reserved.
                </h1>
                <Link
                    to="/suggestions"
                    className="bg-pipelines-blue-500 hover:bg-pipelines-blue-600 rounded px-4 py-2 text-white"
                >
                    Have a suggestion?
                </Link>
            </div>
        </>
    )
}

export default Footer
