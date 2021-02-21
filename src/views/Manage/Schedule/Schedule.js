import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { getAllGradeSchedules } from '../../../utils/urlUtil';

const columns = [{
  dataField: 'grade',
  text: '年级',
  sort: true
}, {
  dataField: 'monday',
  text: '周一'
},{
  dataField: 'tuesday',
  text: '周二'
}, {
  dataField: 'wednesday',
  text: '周三'
}, {
  dataField: 'thursday',
  text: '周四'
}, {
  dataField: 'friday',
  text: '周五'
}];

const defaultSorted = [{
	dataField: 'grade'
}];

function emptyIndication() {
  return 'No data available.'
}

class Schedule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [{
        grade: 1,
        monday: 'a',
        tuesday: 'b',
        wednesday: 'c',
        thursday: 'd',
        friday: 'e'
      }]
		}
	}

	loadData() {
		let url = getAllGradeSchedules();
		fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.forEach(function(gradeSchedule) {
        data.push({
          grade: gradeSchedule.grade,
          monday: gradeSchedule.schedule["1"].name,
          tuesday: gradeSchedule.schedule["2"].name,
          wednesday: gradeSchedule.schedule["3"].name,
          thursday: gradeSchedule.schedule["4"].name,
          friday: gradeSchedule.schedule["5"].name
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
		            <i className="fa fa-align-justify"></i> 课程表
              </CardHeader>
              <CardBody>
              	<ToolkitProvider 
              		bootstrap4 
              		keyField='grade' 
              		data={ this.state.data } 
              		columns={ columns } 
              		defaultSorted={ defaultSorted } 
              	>
              		{
              			props => (
              				<div>
              					<BootstrapTable 
              						{ ...props.baseProps } 
              						headerClasses="bg-info"
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

export default Schedule;