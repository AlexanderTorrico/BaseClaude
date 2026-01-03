import React, { useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Spinner } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useMyPages } from './hooks/useMyPages';
import { useMyPagesFetch } from './hooks/useMyPagesFetch';
// import { MyPagesMockService } from './services/MyPagesMockService';
import { MyPagesApiService } from './services/MyPagesApiService';
import { MyPagesModel } from './models/MyPagesModel';
import PageCard from './components/PageCard';

const myPagesService = new MyPagesApiService();

const MyPages: React.FC = () => {
  const { t } = useTranslation();
  const { mypagess } = useMyPages();
  const { loading, fetchAll, updatePageName } = useMyPagesFetch(myPagesService);

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col xs={12}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">{t("myPages.title")}</h4>
                <p className="text-muted mb-0">
                  {t("myPages.subtitle")}
                </p>
              </div>
              <div className="d-flex gap-2 align-items-center">
                {loading && <Spinner size="sm" color="primary" />}
                <span className="badge bg-primary font-size-14">
                  {mypagess.length} {mypagess.length === 1 ? t("myPages.page") : t("myPages.pages")}
                </span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Content */}
        <Row>
          <Col xs={12}>
            {loading && mypagess.length === 0 ? (
              <Card className="border">
                <CardBody className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="text-muted mt-3 mb-0">{t("myPages.loading")}</p>
                </CardBody>
              </Card>
            ) : mypagess.length === 0 ? (
              <Card className="border">
                <CardBody className="text-center py-5">
                  <i className="mdi mdi-web-off text-muted font-size-48 mb-3 d-block"></i>
                  <h5 className="text-muted">{t("myPages.empty")}</h5>
                  <p className="text-muted mb-0">
                    {t("myPages.emptyHint")}
                  </p>
                </CardBody>
              </Card>
            ) : (
              mypagess.map((page: MyPagesModel) => (
                <PageCard key={page.id} page={page} onUpdateName={updatePageName} />
              ))
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyPages;
