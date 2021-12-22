import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";
import Button from "../components/auth/Button";
import PageTitle from "../components/PageTitle";
import { FatText } from "../components/shared";
import { PHOTO_FRAGMENT } from "../fragments";
import useUser, { ME_QUERY } from "../hooks/useUser";
import routes from "../routes";
import { logUserOut } from "../apollo";

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($userId: String!) {
    followUser(userId: $userId) {
      ok
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($userId: String!) {
    unfollowUser(userId: $userId) {
      ok
    }
  }
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($userId: String!) {
    seeProfile(userId: $userId) {
      userId
      userName
      bio
      avatar
      photos {
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

const Header = styled.div`
  display: flex;
`;

const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`;

const Column = styled.div``;

const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;

const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
`;

const List = styled.ul`
  display: flex;
`;

const Item = styled.li`
  margin-right: 20px;
`;

const Value = styled(FatText)`
  font-size: 18px;
`;

const Name = styled(FatText)`
  font-size: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 290px;
  grid-auto-columns: 300px;
  gap: 30px;
  margin-top: 50px;
`;

const Photo = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;

const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

const ProfileBtn = styled(Button).attrs({
  as: "span",
})`
  margin-left: 10px;
  margin-top: 0px;
  padding: 5px;
  cursor: pointer;
`;

const LogoutBtn = styled.button`
  border: none;
  border-radius: 3px;
  margin-left: 10px;
  background-color: #0095f6;
  color: white;
  text-align: center;
  padding: 7.5px;
  font-weight: 600;
  width: 90px;
  opacity: 1;
`;

function Profile() {
  const { userId } = useParams();
  const { data: userData } = useUser();
  const client = useApolloClient();
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      userId,
    },
  });

  const unfollowUserUpdate = (cache, result) => {
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;
    if (!ok) {
      return;
    }
    cache.modify({
      id: `User:${userId}`,
      fields: {
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });

    const { me } = userData;
    cache.modify({
      id: `User:${me.userId}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
      userId,
    },
    update: unfollowUserUpdate,
  });

  const followUserCompleted = (data) => {
    const {
      followUser: { ok },
    } = data;
    if (!ok) {
      return;
    }
    const { cache } = client;
    cache.modify({
      id: `User:${userId}`,
      fields: {
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });
    const { me } = userData;
    cache.modify({
      id: `User:${me.userId}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
  };

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      userId,
    },
    onCompleted: followUserCompleted,
  });

  const getButton = (seeProfile) => {
    const { isMe, isFollowing } = seeProfile;
    if (isMe) {
      return (
        <Row >
          <Link to={`/edit-profile/${data.seeProfile.userId}`}>
            <ProfileBtn>Edit Profile</ProfileBtn>
          </Link>
          <LogoutBtn onClick={logUserOut}>로그아웃</LogoutBtn>
        </Row>
      );
    }
    if (isFollowing) {
      return <ProfileBtn onClick={unfollowUser}>Unfollow</ProfileBtn>;
    } else {
      return <ProfileBtn onClick={followUser}>Follow</ProfileBtn>;
    }
  };
  console.log(data);
  return (
    <div>
      <PageTitle
        title={loading ? "Loading.." : `${data?.seeProfile?.userId}'s Profile`}
      />
      <Header>
        <Avatar src={data?.seeProfile?.avatar} />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.userId}</Username>
            {data?.seeProfile ? getButton(data.seeProfile) : null}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>{data?.seeProfile?.userName}</Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeProfile?.photos.map((photo) => (
          <Photo key={photo.id} bg={photo.file}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo.commentNumber}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </div>
  );
}

export default Profile;
