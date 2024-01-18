import { Link } from 'react-router-dom'

const Footer = () => {
  return (
        <>

            <div className="flex flex-row justify-between items-center w-full h-20 px-12 bg-pipelines-gray-500">
                <h1 className="text-white font-light">@2024 pipelines.lol. All rights reserved.</h1>
                <Link
                    to = "/suggestions"
                    className = "text-white bg-pipelines-blue-500 hover:bg-pipelines-blue-600 px-4 py-2 rounded"
                     >
                        Have a suggestion?
                </Link>
            </div>
        </>
  )
}

export default Footer
