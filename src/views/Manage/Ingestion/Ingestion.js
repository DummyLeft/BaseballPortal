import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { getCommonFormat } from '../../../utils/timeUtil';
import { getAllStudents } from '../../../utils/urlUtil';

const { SearchBar } = Search;

const columns = [{
	dataField: 'id',
	text: '序号',
	sort: true
}, {
  dataField: 'no',
  text: '学号',
  sort: true
}, {
	dataField: 'name',
	text: '名字',
	sort: true
}, {
	dataField: 'birthdate',
	text: '生日',
  sort: true
}, {
	dataField: 'grade',
	text: '年级',
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
		let url = getAllStudents();
		fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.forEach(function(student) {
        data.push({
          id: student.id,
          no: student.no,
					name: student.name,
					birthdate: student.birthdate,
					grade: student.grade
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