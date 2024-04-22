import { useParams } from "react-router-dom";

const CommentList = () => {
  let { id } = useParams();
  return <div>{id}</div>;
};

export default CommentList;
