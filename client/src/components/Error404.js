import { useNavigate } from 'react-router-dom'

export const error404 = (error_text) => {
    const navigate = useNavigate()
    return (
        <div className="flex h-lvh flex-row items-start justify-center gap-16 px-4 py-48 md:gap-28 md:px-44 md:py-20 lg:px-48 lg:py-64">
            <div>
                <img src="https://i.ibb.co/ck1SGFJ/Group.png" />
            </div>
            <div className="relative w-full pb-12 lg:pb-0 xl:w-1/2 xl:pt-12">
                <div className="relative">
                    <div className="absolute">
                        <h1 className="my-2 text-5xl font-bold text-pipelines-gray-100">
                            404 Error
                        </h1>
                        <h1 className="my-2 text-2xl font-bold text-pipelines-gray-100">
                            {error_text}
                        </h1>
                        <p className="my-2 mb-5 text-pipelines-gray-100">
                            Sorry about that! Please visit our homepage to get
                            where you need to go.
                        </p>
                        <button
                            className="btn btn-success sm:btn-sm md:btn-md lg:btn-lg"
                            onClick={() => {
                                navigate('/')
                            }}
                        >
                            Take me home!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
