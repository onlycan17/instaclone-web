import { useParams } from "react-router-dom";

function Profile(){
    const {userId} = useParams();
    console.log(userId);
    return "Profile";
};

export default Profile;