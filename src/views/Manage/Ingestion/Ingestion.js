import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { getCommonFormat } from '../../../utils/timeUtil';
import { getAllIngestions } from '../../../utils/urlUtil';

const { SearchBar } = Search;

const columns = [{
	dataField: 'id',
	text: 'ID',
	sort: true
}, {
	dataField: 'name',
	text: 'Ingestion Name',
	sort: true
}, {
	dataField: 'desc',
	text: 'Description'
}, {
	dataField: 'source',
	text: 'Source',
	sort: true
}, {
	dataField: 'dest',
	text: 'Destination',
	sort: true
}, {
	dataField: 'interval',
	text: 'Interval',
	sort: true
}, {
  dataField: 'lastUpdateTime',
  text: 'Last Update Time',
  sort: true
}, {
	dataField: 'status',
	text: 'Status',
	sort: true
}];

const defaultSorted = [{
	dataField: 'id'
}];

function emptyIndication() {
  return 'No data available.'
}

class Ingestion extends Component {
	constructor(props) {
		super(props);
		this.gotoDetailPage = this.gotoDetailPage.bind(this)
		this.state = {
			data: []
		}
	}

	gotoDetailPage(id) {
		let detail_path = `/manage/ingestion/detail/${id}`;
		this.props.history.push(detail_path);
	}

	loadData() {
		let url = getAllIngestions();
		fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.ingestion_list.forEach(function(ingestion) {
        data.push({
          id: ingestion.id,
					name: ingestion.name,
					desc: ingestion.description,
					source: ingestion.source,
					dest: ingestion.destination,
					interval: ingestion.interval,
          lastUpdateTime: ingestion.latestUpdateTime == null ? '' : getCommonFormat(new Date(ingestion.latestUpdateTime * 1000)),
					status: ingestion.enabled ? 'enabled' : 'disabled'
        })
      });
      this.setState({
      	data: data
      })
    });
	}

	componentDidMount() {
		this.loadData();
	}

	render() {
		return (
			<div className="animated fadeIn">
				<Row>
          <Col xs="12">
            <Card>
              <CardHeader>
		            <i className="fa fa-align-justify"></i> Ingestion List
              </CardHeader>
              <CardBody>
              	<ToolkitProvider 
              		bootstrap4 
              		keyField='id' 
              		data={ this.state.data } 
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
              					<hr />
              					<BootstrapTable 
              						{ ...props.baseProps } 
              						headerClasses="bg-info"
              						rowEvents={{
              							onClick: (e, row, rowIndex) => {
               								this.gotoDetailPage(row.id)
              							} 
              						}}
                          noDataIndication={ emptyIndication }
              						pagination={ paginationFactory() }
              						striped 
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

export default Ingestion;