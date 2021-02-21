import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { getGroupById, getIngestionListByGroupId } from '../../../utils/urlUtil';

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
	dataField: 'source',
	text: 'Source'
}, {
	dataField: 'dest',
	text: 'Destination',
	sort: true
}, {
	dataField: 'interval',
	text: 'Interval',
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

class GroupDetail extends Component {
	constructor(props) {
		super(props);
		this.gotoIngestionDetailPage = this.gotoIngestionDetailPage.bind(this)
		this.state = {
			id: 1,
			name: '',
			desc: '',
			ingestions: []
		}
	}

	gotoIngestionDetailPage(id) {
		let ingestion_detail_path = `/manage/ingestion/detail/${id}`;
		this.props.history.push(ingestion_detail_path);
	}

	loadData() {
		let url = getGroupById(this.props.match.params.id);
    fetch(url).then(r => r.json()).then((res) => {
      this.setState({
      	id: res.id,
        name: res.name,
        desc: res.description
      })
    });

    url = getIngestionListByGroupId(this.props.match.params.id);
    fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.ingestion_list.forEach(function(ingestion) {
        data.push({
          id: ingestion.id,
					name: ingestion.name,
					source: ingestion.source,
					dest: ingestion.destination,
					interval: ingestion.interval,
					status: ingestion.enabled ? "enabled" : "disabled"
        })
      });
      this.setState({
        ingestions: data
      })
    });
	}

	componentDidMount() {
    this.loadData();
  }

	render() {
		return (
			<div className="animated fadeIn">
				<Card>
					<CardHeader>
            <i className="fa fa-sticky-note-o"></i> Ingestion Group Detail
            <div className="card-header-actions">
              <Link to="/manage/group/" > 
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
          		<dt className='col-sm-3 col-md-2 col-xl-2 text-truncate'>Description: </dt>
          		<dd className='col-sm-9 col-md-10 col-xl-10'>{this.state.desc}</dd>
          	</dl>
          	<hr />
          	<h6><strong>Releated Ingestions</strong></h6>
            	<ToolkitProvider 
            		bootstrap4 
            		keyField='id' 
            		data={ this.state.ingestions } 
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
            						rowEvents={{
            							onClick: (e, row, rowIndex) => {
            								console.log(`clicked on row: ${row.id}`);
            								this.gotoIngestionDetailPage(row.id)
            							} 
            						}} 
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
			</div>
		);
	}
}

export default GroupDetail;