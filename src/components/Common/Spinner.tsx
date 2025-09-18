import React, { useEffect } from "react"
import { Spinner } from "reactstrap";

interface SpinnersProps {
  setLoading: (loading: boolean) => void;
}

const Spinners: React.FC<SpinnersProps> = ({ setLoading }) => {

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [setLoading]);
    return (
        <React.Fragment>
            <Spinner color="primary" className='position-absolute top-50 start-50' />
        </React.Fragment>
    )
}

export default Spinners;