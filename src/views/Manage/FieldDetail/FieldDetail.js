import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { getCommonFormat } from '../../../utils/timeUtil';
import { getFieldById, getFieldUpdateList } from '../../../utils/urlUtil';
import { parseSerial } from '../../../utils/statusUtil';

const { SearchBar } = Search;

const columns = [{
	dataField: 'id',
	text: 'ID',
	sort: true
}, {
	dataField: 'ingestionRun',
	text: 'Ingestion Run Id',
	sort: true
}, {
	dataField: 'begin',
	text: 'Begin'
}, {
	dataField: 'end',
	text: 'End',
	sort: true
}, {
	dataField: 'count',
	text: 'Count',
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

class FieldDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: 1,
			name: '',
      locationName: '',
      locationType: '',
      desc: '',			
      updates: [],
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
        ],
      }
		}
	}

  loadData() {
    let url = getFieldById(this.props.match.params.id);
    fetch(url).then(r => r.json()).then((res) => {
      this.setState({
        id: res.id,
        name: res.name,
        locationName: res.locationName,
        locationType: res.locationType,
        desc: res.description,
      })
    });

    url = getFieldUpdateList(this.props.match.params.id, 20, 'desc');
    fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.ingestion_field_updates_lists.forEach(function(ingestion) {
        ingestion.ingestion_field_updates_list.forEach(function(update) {
          data.push({
            id: update.id,
            ingestionRun: update.ingestion_run_id,
            begin: parseSerial(update.beginSerial),
            end: parseSerial(update.endSerial),
            count: update.updateCount,
            updateTime: getCommonFormat(new Date(update.updateTime * 1000))
          })
        })
      });

      this.setState({
        updates: data
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
        missing.push(1);
      }

      success.push(1);
      missing.push(0);

      latest = d.end;
    })

    this.setState(state => {
      const barData = state.barData;
      barData.labels = labels;
      barData.datasets[0].data = success;
      barData.datasets[1].data = missing;

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
            <i className="fa fa-sticky-note-o"></i> Field Detail
            <div className="card-header-actions">
              <Link to="/manage/field/" > 
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
          		<dt className='col-sm-3 col-md-2 col-xl-2'>Location Name: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.locationName}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2'>Location Type: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.locationType}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2 text-truncate'>Description: </dt>
          		<dd className='col-sm-9 col-md-10 col-xl-10'>{this.state.desc}</dd>
          	</dl>
          	<hr />
          	<h6><strong>Field Updates</strong></h6>
            { this.state.updates.length > 0 ? 
            	<div className="chart-wrapper" style={{ height: '100px'}} >
                <Bar data={this.state.barData} options={options} height={1000} />
              </div> :
              null
            }
            <br />
          	<ToolkitProvider 
          		bootstrap4 
          		keyField='id' 
          		data={ this.state.updates } 
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

export default FieldDetail;