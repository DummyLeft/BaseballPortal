import React, { Component, lazy } from 'react';
import { Button, ButtonGroup, ButtonToolbar, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { getCommonFormat } from '../../utils/timeUtil';
import { getOverallCount, getRecentIngestionUpdateCount, getIngestionRunList } from '../../utils/urlUtil';
import { parseSerial } from '../../utils/statusUtil';

const columns = [{
  dataField: 'id',
  text: 'ID',
  sort: true,
  align: 'center'
}, {
  dataField: 'ingestion',
  text: 'Ingestion Name',
  sort: true
}, {
  dataField: 'begin',
  text: 'Begin',
  sort: true
}, {
  dataField: 'end',
  text: 'End'
}, {
  dataField: 'updateTime',
  text: 'Update Time',
  sort: true
}];

const defaultSorted = [{
  dataField: 'id'
}];

function emptyIndication() {
  return 'No data available.'
}

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
}

const Widget02 = lazy(() => import('../../views/Widgets/Widget02'));

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this)

    this.state = {
      groups: 0,
      showUpdateCount: 24,
      ingestions: 0,
      fields: 0,
      locations: 0,
      ingestionRuns: 0,
      trafficData: {
        labels: [],
        datasets: [{
          label: 'Count of Recent Ingestions',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(77,189,116,0.4)',
          borderColor: 'rgba(77,189,116,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(77,189,116,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(77,189,116,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: []
        }]
      },
      runningIngestions: [],
      failedIngestions: [],
    };
  }

  onRadioBtnClick(count) {
    this.setState({
      showUpdateCount: count,
    }, () => this.loadTrafficData());

  }

  loadData() {
    let url = getOverallCount();
    fetch(url).then(r => r.json()).then((res) => {
      this.setState({
        groups: res.ingestionGroupCount,
        ingestions: res.ingestionCount,
        fields: res.fieldCount,
        locations: res.locationCount
      })
    });

    this.loadTrafficData();
    
    url = getIngestionRunList(null, null, 'desc', 'running', null);
    fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.ingestion_run_list.forEach(function(run) {
        data.push({
          id: run.id,
          ingestion: run.ingestionName,
          begin: parseSerial(run.beginSerial),
          end: parseSerial(run.endSerial),
          updateTime: getCommonFormat(new Date(run.updateTime * 1000))
        })
      });
      this.setState({
        ingestionRuns: data.length,
        runningIngestions: data
      })
    });

    url = getIngestionRunList(null, null, 'desc', 'failed', null);
    fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.ingestion_run_list.forEach(function(run) {
        data.push({
          id: run.id,
          ingestion: run.ingestionName,
          begin: parseSerial(run.beginSerial),
          end: parseSerial(run.endSerial),
          updateTime: getCommonFormat(new Date(run.updateTime * 1000))
        })
      });
      this.setState({
        failedIngestions: data
      })
    });

  }

  loadTrafficData() {
    let url = getRecentIngestionUpdateCount(this.state.showUpdateCount);
    fetch(url).then(r => r.json()).then((res) => {
      let labels = [];
      let data = [];
      res.update_count_list.sort(function(d1, d2) {
        if (d1.updateTime < d2.updateTime) {
          return -1;
        } else if (d1.updateTime === d2.updateTime) {
          return 0;
        } else {
          return 1;
        }
      }).forEach(function(update) {
        labels.push(getCommonFormat(new Date(update.updateTime * 1000)));
        data.push(update.updateCount);
      })

      this.setState(state => {
        const trafficData = state.trafficData;
        trafficData.labels = labels;
        trafficData.datasets[0].data = data;
        return {
          trafficData: trafficData
        }
      })
    });
  }

  componentDidMount() {
    this.loadData();
    this.interval = setInterval(() => this.loadData(), 30000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="3">
            <Widget02 header={this.state.groups.toString()} mainText="Groups" icon="fa fa-clone" color="primary" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget02 header={this.state.ingestionRuns.toString() + ' / ' + this.state.ingestions.toString()} mainText="Running/Total Ingestions" icon="fa fa-pencil" color="info" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget02 header={this.state.fields.toString()} mainText="Fields" icon="fa fa-tag" color="warning" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget02 header={this.state.locations.toString()} mainText="Locations" icon="fa fa-map-marker" color="danger" variant="1" />
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <h4 className='card-title'>Ingestions Traffic</h4>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <ButtonGroup className="mr-3" aria-label="First group">
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(24)} active={this.state.showUpdateCount === 24}>Day</Button>
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(720)} active={this.state.showUpdateCount === 720}>Month</Button>
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(8640)} active={this.state.showUpdateCount === 8640}>Year</Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <div className="chart-wrapper" style={{ height: '240px' }} >
                  <Line data={this.state.trafficData} options={options} height={240} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs="12" sm="6">
            <Card className="card-accent-warning">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Running Ingestions
              </CardHeader>
              <CardBody>
               <ToolkitProvider 
                  bootstrap4 
                  keyField='id' 
                  data={ this.state.runningIngestions } 
                  columns={ columns } 
                  defaultSorted={ defaultSorted } 
                >
                  {
                    props => (
                      <div>
                        <BootstrapTable 
                          { ...props.baseProps } 
                          headerClasses="bg-gray-200"
                          pagination={ paginationFactory() }
                          noDataIndication = { emptyIndication }
                          condensed
                          hover 
                        />
                      </div>
                    )
                  }
                </ToolkitProvider>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6">
            <Card className="card-accent-danger">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Recent Failed Ingestions
              </CardHeader>
              <CardBody>
                <ToolkitProvider 
                  bootstrap4 
                  keyField='id' 
                  data={ this.state.failedIngestions } 
                  columns={ columns } 
                  defaultSorted={ defaultSorted } 
                >
                  {
                    props => (
                      <div>
                        <BootstrapTable 
                          { ...props.baseProps } 
                          headerClasses="bg-gray-200"
                          pagination={ paginationFactory() }
                          noDataIndication = { emptyIndication }
                          condensed
                          hover 
                        />
                      </div>
                    )
                  }
                </ToolkitProvider>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
