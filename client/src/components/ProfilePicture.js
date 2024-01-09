import { useRef, useState } from "react";
import { PencilLine } from "lucide-react";

export const ProfilePicture = ({ profile }) => {
    const fileInputRef = useRef(null);
    const [filePreview, setFilePreview] = useState(null);

    const handleEditProfilePictureClick = () => {
        // Trigger the file input when the button is clicked
        fileInputRef.current.click();
    };

    const handleFileInputChange = (e) => {
        // Handle the selected file
        const selectedFile = e.target.files[0];
        console.log('Selected file:', selectedFile);

        // Read the file contents and set the preview
        if (selectedFile) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setFilePreview(reader.result);
            };

            reader.readAsDataURL(selectedFile);
        }
    };

    const src = filePreview || (profile.pfp ? profile.pfp : '/avatar.png');

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