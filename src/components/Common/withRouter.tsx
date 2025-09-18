import React from "react";
import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

interface RouterProps {
    router: {
        location: ReturnType<typeof useLocation>;
        navigate: ReturnType<typeof useNavigate>;
        params: ReturnType<typeof useParams>;
    };
}

function withRouter<P extends object>(Component: React.ComponentType<P & RouterProps>) {
    function ComponentWithRouterProp(props: P) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

export default withRouter;