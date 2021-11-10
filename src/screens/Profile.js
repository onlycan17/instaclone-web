import {gql,useQuery} from "@apollo/client";
import { useParams } from "react-router-dom";
import {PHOTO_FRAGMENT} from "../fragments";

const SEE_PROFILE_QUERY = gql`
    query seeProfile($userId: String!){
        seeProfile(userId: $userId){
            userId
            userName
            bio
            avatar
            photos{
                ...PhotoFragment
            }
            totalFollowing
            totalFollowers
            isMe
            isFollowing
        }
    }
    ${PHOTO_FRAGMENT}
`;

function Profile(){
    const {userId} = useParams();
    const {data} = useQuery(SEE_PROFILE_QUERY, {
        variables: {
            userId,
        },
    });
    console.log(data);
    return "Profile";
};

export default Profile;