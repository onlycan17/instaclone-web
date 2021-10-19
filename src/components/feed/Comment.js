import { checkPropTypes } from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";
import PropTypes from "prop-types";

const CommentContainer = styled.div``;

const CommentCaption = styled.span`
  margin-left: 10px;
`;

function Comment({author, payload}) {
    return(
        <CommentContainer>
            <FatText>{author}</FatText>
            <CommentCaption>{payload}</CommentCaption>
        </CommentContainer>
    )
}

Comment.prototypes = {
    author: PropTypes.string.isRequire,
    payload: PropTypes.string.isRequired,
}

export default Comment;