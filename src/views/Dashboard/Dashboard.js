import React, { Component, lazy } from 'react';
import { Button, ButtonGroup, ButtonToolbar, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { getCommonFormat } from '../../utils/timeUtil';
import { getOverallCount, getAllGradeSchedules } from '../../utils/urlUtil';
import { parseSerial } from '../../utils/statusUtil';

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

const Widget02 = lazy(() => import('../../views/Widgets/Widget02'));

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grades: 7,
      totalTeachers: 0,
      activeTeachers: 0,
      voluteers: 0,
      students: 0,
      schedules: []
    };
  }

  loadData() {
    let url = getOverallCount();
    fetch(url).then(r => r.json()).then((res) => {
      this.setState({
        grades: res.grades,
        totalTeachers: res.teachers,
        activeTeachers: res.activeTeachers,
        voluteers: res.volunteers,
        students: res.students
      })
    });
    
    url = getAllGradeSchedules();
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
        schedules: data
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
            <Widget02 header={this.state.grades.toString()} mainText="年级数" icon="fa fa-clone" color="primary" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget02 header={this.state.activeTeachers.toString() + ' / ' + this.state.totalTeachers.toString()} mainText="在校/所有 老师" icon="fa fa-pencil" color="info" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget02 header={this.state.voluteers.toString()} mainText="志愿者" icon="fa fa-tag" color="warning" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget02 header={this.state.students.toString()} mainText="学生数" icon="fa fa-map-marker" color="danger" variant="1" />
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> 课堂情况统计
              </CardHeader>
              <CardBody>
                <Row>
                  <Col sm="5">
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
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs="12" sm="8">
            <Card className="card-accent-warning">
              <CardHeader>
                <i className="fa fa-align-justify"></i> 课程表
              </CardHeader>
              <CardBody>
               <ToolkitProvider 
                  bootstrap4 
                  keyField='grade' 
                  data={ this.state.schedules } 
                  columns={ columns } 
                  defaultSorted={ defaultSorted } 
                >
                  {
                    props => (
                      <div>
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
          </Col>
          <Col xs="12" sm="4">
            <Card className="card-accent-danger">
              <CardHeader>
                <i className="fa fa-align-justify"></i> 时间表
              </CardHeader>
              <CardBody>
                <div>
                   7:00 ~  7:30   起床 & 洗漱 <br/>
                   7:30 ~  8:00   早餐 <br/>
                   8:20 ~  9:00   早读课 <br/>
                   9:10 ~  9:50   第一节文化课 <br/>
                  10:00 ~ 10:40   第二节文化课 <br/>
                  10:50 ~ 11:30   第三节文化课 <br/>
                  12:00 ~ 12:30   午餐 <br/>
                  13:30 ~ 16:30   棒球训练 <br/>
                  18:00 ~ 19:00   晚餐 <br/>
                  19:00 ~ 19:30   观看新闻联播 <br/>
                  19:30 ~ 20:30   晚自习 <br/>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
