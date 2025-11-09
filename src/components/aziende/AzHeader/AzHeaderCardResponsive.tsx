import AzHeaderCardViewResponsive from './AzHeaderCardViewResponsive';


const AzHeaderCardResponsive = ({ children, ...headerProps }) => {
  return (
    <AzHeaderCardViewResponsive {...headerProps}>
      {children}
    </AzHeaderCardViewResponsive>
  );
};

export default AzHeaderCardResponsive;

