import React, { useEffect } from "react";
import withRouter from "./Common/withRouter";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { changeLayoutMode } from "../store/layoutSlice";

interface NonAuthLayoutProps {
  children?: React.ReactNode;
  location?: any;
}

const NonAuthLayout: React.FC<NonAuthLayoutProps> = (props) => {

  const dispatch = useDispatch();

  const selectProperty = createSelector(
    (state: any) => state.layout,
    (layout) => ({
      layoutModeType: layout.layoutModeType,
    })
  )
  const { layoutModeType } = useSelector(selectProperty);

  useEffect(() => {
    if (layoutModeType) {
      dispatch(changeLayoutMode(layoutModeType))
    }
  }, [layoutModeType, dispatch])

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default withRouter(NonAuthLayout);