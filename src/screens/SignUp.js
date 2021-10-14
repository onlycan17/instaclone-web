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
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
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

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $userId: String!
    $userName: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      userId: $userId
      userName: $userName
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const history = useHistory();

  const onCompleted = (data) => {
    const {
      createAccount: { ok, error },
    } = data;
    console.log(ok);
    if (!ok) {
      return;
    }
    history.push(routes.home);
  };
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const { register, handleSubmit, errors, formState } = useForm({
    mode: "onChange",
  });

  const onSumbitValid = (data) => {
    if (loading) {
      return;
    }
    createAccount({
      variables: {
        ...data,
      },
    });
  };

  return (
    <AuthLayout>
      <PageTitle title="Sign up" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>
            Sign up to see photos and videos from your friends.
          </Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSumbitValid)}>
          <Input
            ref={register({
              required: "User Name is required.",
            })}
            name="userName"
            type="text"
            placeholder="Name"
          />
          <Input
            ref={register({
              required: "Email is required.",
            })}
            name="email"
            type="text"
            placeholder="Email"
          />
          <Input
            ref={register({ required: "userId is required." })}
            name="userId"
            type="text"
            placeholder="userId"
          />
          <Input
            ref={register({ required: "password is required." })}
            name="password"
            type="password"
            placeholder="Password"
          />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign up"}
            disabled={!formState.isValid || loading}
          />
        </form>
      </FormBox>
      <BottomBox cta="Have an Account?" linkText="Log in" link={routes.home} />
    </AuthLayout>
  );
}

export default SignUp;
