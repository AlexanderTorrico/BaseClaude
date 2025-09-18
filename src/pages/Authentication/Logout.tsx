import React, { useEffect } from "react";
import withRouter from "../../components/Common/withRouter";
import { logoutUser } from "/src/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const history = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logoutUser({ history }));
  }, [dispatch, history]);

  return <></>;
};

export default withRouter(Logout);
