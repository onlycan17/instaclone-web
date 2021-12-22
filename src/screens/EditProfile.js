import styled from "styled-components";
import { FatLink } from "../components/shared";
import FormBox from "../components/auth/FormBox";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/auth/Input";
import Button from "../components/auth/Button";
import BottomBox from "../components/auth/BottomBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import routes from "../routes";
import PageTitle from "../components/PageTitle";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";

import { PHOTO_FRAGMENT } from "../fragments";
import useUser from "../hooks/useUser";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($userId: String!) {
    seeProfile(userId: $userId) {
      userId
      userName
      bio
      isMe
      isFollowing
    }
  }
`;

const EDIT_PROFILE = gql`
  mutation editProfile($userName: String, $bio: String) {
    editProfile(userName: $userName, bio: $bio) {
      ok
      error
    }
  }
`;

function EditProfile() {
  console.log("EditProfile~~!!");
  const { userId } = useParams();
  const { data: userData } = useUser();
  const client = useApolloClient();
  const { register, handleSubmit, getValues, setError } = useForm();
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      userId,
    },
  });

  const onResult = (data) => {
    console.log(data);
    const { ok, error } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
    }
  };

  const [editProfile, { loadingEdit }] = useMutation(EDIT_PROFILE, {
    onResult,
  });
  
  const onSubmitValid = (data) => {
    if (loadingEdit) {
      return;
    }
    const { userName, bio } = getValues();
    console.log(userName,bio);
    editProfile({
      variables: { userName, bio },
    });
  };

  console.log(userId);
  console.log(data);
  return (
    <div>
      <PageTitle
        title={loading ? "Loading.." : `${data?.seeProfile?.userId}'s Profile`}
      />
      <AuthLayout>
        <FormBox>
          <form onSubmit={handleSubmit(onSubmitValid)}>
            <Input ref={register()}
              type="text"
              placeholder="name"
              name="userName"
              value={data.seeProfile.userName}
            />
            <Input
              ref={register()}
              type="text"
              placeholder="bio"
              name="bio"
              value={data.seeProfile.bio}
            />
            <Button type="submit" value={"Save"} />
          </form>
        </FormBox>
      </AuthLayout>
    </div>
  );
}

export default EditProfile;
