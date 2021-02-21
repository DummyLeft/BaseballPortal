import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Button, ButtonGroup, ButtonToolbar, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { getCommonFormat } from '../../../utils/timeUtil';
import { getIngestionById, getIngestionRunList } from '../../../utils/urlUtil';
import { getIngestionRunStatus, parseSerial } from '../../../utils/statusUtil';

const { SearchBar } = Search;

const columns = [{
	dataField: 'id',
	text: 'ID',
	sort: true
}, {
	dataField: 'begin',
	text: 'Begin',
	sort: true
}, {
	dataField: 'end',
	text: 'End'
}, {
	dataField: 'count',
	text: 'Count',
	sort: true
}, {
	dataField: 'status',
	text: 'Status',
	sort: true
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
  scales: {
      xAxes: [{
        stacked: true,
        categoryPercentage: 1.0,
        barPercentage: 1.0,
        display: true,
        gridLines: {
          display: false
        },
      }],
      yAxes: [{
        display: false,
        gridLines: {
          display: false
        },
      }]
  },
}

class IngestionDetail extends Component {
	constructor(props) {
		super(props);

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this)

		this.state = {
			id: 1,
      name: '',
      source: '',
      dest: '',
      interval: '',
      group: '',
      createdBy: '',
      createdAt: '',
      modifiedBy: '',
      modifiedAt: '',
      desc: '',
      dataHourRange: 24,
      ingestionRuns: [],
      barData: {
        labels: [],
        datasets: [
          {
            label: 'Success',
            backgroundColor: 'rgba(32,168,216,0.8)',
            borderColor: 'rgba(32,168,216,1)',
            borderWidth: 0,
            hoverBackgroundColor: 'rgba(32,168,216,0.9)',
            hoverBorderColor: 'rgba(32,168,216,1)',
            data: [],
          },

          {
            label: 'Missing',
            backgroundColor: 'rgba(200,206,211,0.8)',
            borderColor: 'rgba(200,206,211,1)',
            borderWidth: 0,
            hoverBackgroundColor: 'rgba(200,206,211,0.9)',
            hoverBorderColor: 'rgba(200,206,211,1)',
            data: [],
          },

          {
            label: 'Running',
            backgroundColor: 'rgba(77,189,116,0.8)',
            borderColor: 'rgba(77,189,116,1)',
            borderWidth: 0,
            hoverBackgroundColor: 'rgba(77,189,116,0.9)',
            hoverBorderColor: 'rgba(77,189,116,1)',
            data: [],
          },
        ],
      }
 		}
	}

  onRadioBtnClick(count) {
    this.setState({
      dataHourRange: count
    }, () => this.loadRunData() )
  }

  loadData() {
    let url = getIngestionById(this.props.match.params.id);
    fetch(url).then(r => r.json()).then((res) => {
      this.setState({
        id: res.id,
        name: res.name,
        source: res.source,
        dest: res.destination,
        interval: res.interval,
        group: res.ingestionGroup,
        createdBy: res.createdBy,
        createdAt: res.created == null ? '' : getCommonFormat(new Date(res.created * 1000)),
        modifiedBy: res.modifiedBy,
        modifiedAt: res.modified == null ? '' : getCommonFormat(new Date(res.modified * 1000)),
        desc: res.description,
      })
    });

    this.loadRunData();
  }

  loadRunData() {
    //calculate beging timestamp of ingest runs by the state
    let beginTimestamp = parseInt(new Date().getTime()/1000) - this.state.dataHourRange * 3600;

    let url = getIngestionRunList(this.props.match.params.id, null, 'desc', 'all', beginTimestamp);
    fetch(url).then(r => r.json()).then((res) => {
      let data = [];

      res.ingestion_run_list.forEach(function(run) {
        let status = getIngestionRunStatus(run.status);
        if (status === 'success' || status === 'running') {
          data.push({
            id: run.id,
            ingestion: run.ingestionName,
            begin: parseSerial(run.beginSerial),
            end: parseSerial(run.endSerial),
            count: run.inputCount,
            status: status,
            updateTime: getCommonFormat(new Date(run.updateTime * 1000))
          })
        }
      });

      this.setState({
        ingestionRuns: data
      });

      this.generateBarData(data);
    });

  }

  generateBarData(data) {
    if (data.length === 0) {
      return
    }

    let labels = [];
    let success = [];
    let running = [];
    let missing = [];

    data.sort(function(d1, d2) {
      if (d1.begin < d2.begin) {
        return -1;
      } else if (d1.begin === d2.begin) {
        return 0;
      } else {
        return 1;
      }
    })
    let latest = data[0].begin
    data.forEach(function(d) {
      if (d.end <= latest) {
        return;
      }

      labels.push(latest);
      if (d.begin > latest) {
        labels.push(d.begin);
        success.push(0);
        running.push(0);
        missing.push(1);
      }

      if (d.status === 'success') {
        success.push(1);
        running.push(0);        
        missing.push(0);
      } else if (d.status === 'running') {
        success.push(0);
        running.push(1);
        missing.push(0);
      } else {
        success.push(0);
        running.push(0);
        missing.push(1);
      }

      latest = d.end;
    })

    this.setState(state => {
      const barData = state.barData;
      barData.labels = labels;
      barData.datasets[0].data = success;
      barData.datasets[1].data = missing;
      barData.datasets[2].data = running;
      return {
        barData: barData
      }
    })
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
				<Card>
					<CardHeader>
            <i className="fa fa-sticky-note-o"></i> Ingestion Detail
            <div className="card-header-actions">
              <Link to="/manage/ingestion/" > 
              	<i className="fa fa-arrow-left float-right"></i>
            	</Link>
            </div>
          </CardHeader>
          <CardBody>
          	<dl className="row">
          		<dt className='col-sm-3 col-md-2 col-xl-2'>ID: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.id}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2'>Name: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.name}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2'>Source: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.source}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2 text-truncate'>Destination: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.dest}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2'>Interval: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.interval}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2'>Group: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.group}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2 text-truncate'>Created By: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.createdBy}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2 text-truncate'>Created At: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.createdAt}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2 text-truncate'>Modified By: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.modifiedBy}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2 text-truncate'>Modified At: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.modifiedAt}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2 text-truncate'>Description: </dt>
          		<dd className='col-sm-9 col-md-10 col-xl-10'>{this.state.desc}</dd>
          	</dl>
          	<hr />
            <Row>
              <Col sm="5">
                <h6><strong>Ingestion Runs</strong></h6>
              </Col>
              <Col sm="7" className="d-none d-sm-inline-block">
                <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                  <ButtonGroup className="mr-1" aria-label="First group" size="sm">
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(24)} active={this.state.dataHourRange === 24}>Day</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(144)} active={this.state.dataHourRange === 144}>Week</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(720)} active={this.state.dataHourRange === 720}>Month</Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col>
            </Row>
            <br />
            { this.state.ingestionRuns.length > 0 ? 
              <div className="chart-wrapper" style={{ height: '100px' }}>
                <Bar data={this.state.barData} options={options} height={100} />
              </div> :
              null
            }
            <br />
          	<ToolkitProvider 
          		bootstrap4 
          		keyField='id' 
          		data={ this.state.ingestionRuns } 
          		columns={ columns } 
          		defaultSorted={ defaultSorted } 
          		search
          	>
          		{
          			props => (
          				<div>
          					<Row>
          						<Col 
          							xs={{ size: 12, offset: 0 }} 
          							sm={{ size: 6, offset: 6 }} 
          							md={{ size: 4, offset: 8 }} 
        							>
          							<SearchBar {...props.searchProps} />
          						</Col>
          				  </Row>
          				  <br />
          					<BootstrapTable 
          						{ ...props.baseProps } 
          						headerClasses="bg-gray-200"
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
			</div>
		);
	}
}

export default IngestionDetail;