import { useState } from "react"
import useShowToast from "./useShowToast"

const usePreviewImg = () => {
    const [imgURL, setImgURL] = useState(null)
    const showToast = useShowToast()
    const handleImgChange = (e) => {
        const file = e.target.files[0]

        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();

            reader.onloadend = () =>{
                setImgURL(reader.result);
            }
            reader.readAsDataURL(file)
        }
        else{
            showToast("Invaild File Type", "Please select an image file", "error")
            setImgURL(null)
        }
        console.log(file);
    }
    return {handleImgChange, imgURL, setImgURL}
}

export default usePreviewImg