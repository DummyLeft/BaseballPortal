import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { getAllGroups } from '../../../utils/urlUtil';

const { SearchBar } = Search;

const columns = [{
	dataField: 'id',
	text: 'ID',
	sort: true
}, {
	dataField: 'name',
	text: 'Group Name',
	sort: true
}, {
	dataField: 'desc',
	text: 'Description'
}, {
	dataField: 'num',
	text: 'Num of Related Ingestions',
	sort: true
}];

const defaultSorted = [{
	dataField: 'id'
}];

function emptyIndication() {
  return 'No data available.'
}

class Group extends Component {
	constructor(props) {
		super(props);
		this.gotoDetailPage = this.gotoDetailPage.bind(this)
		this.state = {
			data: []
		}
	}

	gotoDetailPage(id) {
		let detail_path = `/manage/group/detail/${id}`;
		this.props.history.push(detail_path);
	}

	loadData() {
		let url = getAllGroups();
		fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.ingestion_group_list.forEach(function(group) {
        data.push({
          id: group.id,
          name: group.name,
          desc: group.description,
          num: group.ingestionCount
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
		            <i className="fa fa-align-justify"></i> Ingestion Group List
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
                          pagination={ paginationFactory() }
                          noDataIndication = { emptyIndication }
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

export default Group;