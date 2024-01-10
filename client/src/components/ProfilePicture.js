import { useEffect, useRef, useState } from "react";
import { PencilLine } from "lucide-react";
import { host } from "../util/apiRoutes";
import { useParams } from "react-router-dom";

export const ProfilePicture = ({ profile, setPfp }) => {
    const { id } = useParams();

    const fileInputRef = useRef(null);
    const [fetchedPfp, setFetchedPfp] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const fetchPfp = async () => {
        try {
            const response = await fetch(`${host}/api/pfp/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Check if the response has JSON content
                if (response.headers.get('content-type')?.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(`${errorData.error}`);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }

            const data = await response.json();
            setPfp(data.pfp);
            setFetchedPfp(data.pfp);
        } catch (error) {
            console.error(error.message);
            setPfp(null);
        }
    }

    const handleEditProfilePictureClick = () => {
        // Trigger the file input when the button is clicked
        fileInputRef.current.click();
    };

    const handleFileInputChange = async (e) => {
        // Handle the selected file
        const selectedFile = e.target.files[0];

        // Read the file contents and set the preview
        if (selectedFile) {   
            const reader = new FileReader();

            reader.onloadend = () => {
                setFilePreview(reader.result);
            };

            reader.readAsDataURL(selectedFile);
        }

        const formData = new FormData();
        formData.append("pfp", selectedFile);

        try {
            const response = await fetch(`${host}/api/pfp/${profile._id}`, {
                method: "PATCH",
                body: formData
            });
    
            if (!response.ok) {
                // Check if the response has JSON content
                if (response.headers.get('content-type')?.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(`${errorData.error}`);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }

            const data = await response.json();
            console.log(data);

        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        const fetchInfo = async () => {
            await fetchPfp();
        }

        fetchInfo();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const src = filePreview || (fetchedPfp ? fetchedPfp : '/avatar.png');

    return (
        <div className="relative w-96 h-96 rounded-full overflow-hidden">
            <img 
                src={src}
                className="w-full h-full object-cover rounded-full transition-transform transform hover:scale-105"
                alt={`${profile._id}_avatar`}
            />
            <button 
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100"
                onClick={handleEditProfilePictureClick}
            >
                <PencilLine 
                    className="w-12 h-12 text-gray-200 hover:text-gray-300 transition-transform transform hover:scale-110 cursor-pointer"
                />
            </button>

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
            />
        </div>
    )
}