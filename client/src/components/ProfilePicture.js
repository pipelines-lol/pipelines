import { useEffect, /* useRef, */ useState } from 'react'
import { HOST } from '../util/apiRoutes'
import { useParams } from 'react-router-dom'

// import { PencilLine } from "lucide-react";

export const ProfilePicture = ({ profile, setPfp }) => {
    const { id } = useParams()

    // const fileInputRef = useRef(null);
    const [fetchedPfp, setFetchedPfp] = useState(null)
    // const [filePreview, setFilePreview] = useState(null);

    // const [errorMessage, setErrorMessage] = useState('');

    const fetchPfp = async () => {
        try {
            const response = await fetch(`${HOST}/api/pfp/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                // Check if the response has JSON content
                if (
                    response.headers
                        .get('content-type')
                        ?.includes('application/json')
                ) {
                    const errorData = await response.json()
                    throw new Error(`${errorData.error}`)
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
            }

            const data = await response.json()
            setPfp(data.pfp)
            setFetchedPfp(data.pfp)
        } catch (error) {
            console.error(error.message)
            setPfp(null)
        }
    }

    // const handleEditProfilePictureClick = () => {
    //     // Trigger the file input when the button is clicked
    //     fileInputRef.current.click();
    // };

    // const handleFileInputChange = async (e) => {
    //     const selectedFile = e.target.files[0];

    //     // clear error message
    //     setErrorMessage('');

    //     if (selectedFile) {
    //         const reader = new FileReader();

    //         reader.onloadend = async () => {
    //             setFilePreview(reader.result);

    //             const formData = new FormData();
    //             formData.append("pfp", selectedFile);

    //             try {
    //             // Make a POST request to recognizeImage API
    //             const recognitionResponse = await fetch(`${HOST}/api/imageModeration`, {
    //                 method: 'POST',
    //                 body: formData
    //             });

    //             if (!recognitionResponse.ok) {
    //                 // Handle recognition error
    //                 throw new Error(`Recognition API error! Status: ${recognitionResponse.status}`);
    //             }

    //             const recognitionData = await recognitionResponse.json();
    //             const moderationResults = recognitionData.moderationResult;

    //             console.log("Recognition results: ", moderationResults, moderationResults.length);

    //             // inappropriate image found
    //             if (moderationResults.length > 0) {
    //                 setErrorMessage(`Image Flagged: ${moderationResults[0]}`);

    //                 await fetchPfp();

    //                 return;
    //             }

    //             // Make a PATCH request to update the profile picture
    //             const updateResponse = await fetch(`${HOST}/api/pfp/${profile._id}`, {
    //                 method: "PATCH",
    //                 body: formData
    //             });

    //             if (!updateResponse.ok) {
    //                 // Handle update error
    //                 throw new Error(`Update API error! Status: ${updateResponse.status}`);
    //             }

    //             const updateData = await updateResponse.json();
    //             console.log('Profile picture updated:', updateData);

    //             } catch (error) {
    //             console.error(error.message);
    //             }
    //         };

    //         reader.readAsDataURL(selectedFile);
    //     }
    // };

    useEffect(() => {
        const fetchInfo = async () => {
            await fetchPfp()
        }

        fetchInfo()
    }, [])

    const src = fetchedPfp || '/avatar.png'

    return (
        <>
            <div className="relative h-96 w-96 overflow-hidden rounded-full">
                <img
                    src={src}
                    className="h-full w-full transform rounded-full object-cover transition-transform hover:scale-105"
                    alt={`${profile._id}_avatar`}
                />
                {/* <button
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100"
                    onClick={handleEditProfilePictureClick}
                >
                    <PencilLine
                        className="w-12 h-12 text-gray-200 hover:text-gray-300 transition-transform transform hover:scale-110 cursor-pointer"
                    />
                </button> */}

                {/* Hidden file input */}
                {/* <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                /> */}
            </div>

            {/* { errorMessage &&
                <h1 className="text-red-400">{errorMessage}</h1>
            } */}
        </>
    )
}
