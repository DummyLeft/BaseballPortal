import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { getLocationById, getFieldsByLocation } from '../../../utils/urlUtil';

const { SearchBar } = Search;

const columns = [{
	dataField: 'id',
	text: 'ID',
	sort: true
}, {
	dataField: 'name',
	text: 'Name',
	sort: true
}, {
	dataField: 'desc',
	text: 'Description'
}];

const defaultSorted = [{
	dataField: 'id'
}];

function emptyIndication() {
  return 'No data available.'
}

class LocationDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: 1,
			name: '',
      locationTypeName: '',
      desc: '',
      address: '',
      isInner: '',	
      fields: []
		}
	}

  loadData() {
    let url = getLocationById(this.props.match.params.id);
    fetch(url).then(r => r.json()).then((res) => {
      this.setState({
        id: res.id,
        name: res.name,
        locationTypeName: res.locationTypeName,
        desc: res.description,
        address: res.address,
        isInner: false
      })
    });

    url = getFieldsByLocation(this.props.match.params.id);
    fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.field_list.forEach(function(field) {
        data.push({
          id: field.id,
          name: field.name,
          desc: field.description
        })
      });

      this.setState({
        fields: data
      });
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
				<Card>
					<CardHeader>
            <i className="fa fa-sticky-note-o"></i> Location Detail
            <div className="card-header-actions">
              <Link to="/manage/location/" > 
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
          		<dt className='col-sm-3 col-md-2 col-xl-2'>Type: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.locationTypeName}</dd>
              <dt className='col-sm-3 col-md-2 col-xl-2'>Inner: </dt>
              <dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.isInner.toString()}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2'>Address: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.address}</dd>
              <dt className='col-sm-3 col-md-2 col-xl-2'></dt>
              <dd className='col-sm-3 col-md-4 col-xl-4'></dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2 text-truncate'>Description: </dt>
          		<dd className='col-sm-9 col-md-10 col-xl-10'>{this.state.desc}</dd>
          	</dl>
          	<hr />
          	<h6><strong>Releated Fields</strong></h6>
          	<ToolkitProvider 
          		bootstrap4 
          		keyField='id' 
          		data={ this.state.fields } 
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

export default LocationDetail;