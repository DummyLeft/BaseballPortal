import React, { Component, lazy } from 'react';
import { Button, ButtonGroup, ButtonToolbar, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { getCommonDateFormat, getZeroClockWithCommonFormat } from '../../utils/timeUtil';
import { getOverallCount, getAllTeachers, getAllStudents, getProgressByDate, getPerformanceByDate, addProgress, addPerformance, getAllGradeSchedules} from '../../utils/urlUtil';

const performanceColumns = [{
  dataField: 'grade',
  text: '年级',
  sort: true
}, {
  dataField: 'name',
  text: '学生名字',
  sort: true
}, {
  dataField: 'teacher',
  text: '老师'
}, {
  dataField: 'score',
  text: '分数',
  sort: true
}, {
  dataField: 'comment',
  text: '备注'
}];

const defaultPerformanceSorted = [{
  dataField: 'name'
}];

const progressColumns = [{
  dataField: 'grade',
  text: '年级',
  sort: true
}, {
  dataField: 'subject',
  text: '学科'
}, {
  dataField: 'teacher',
  text: '老师'
}, {
  dataField: 'progress',
  text: '教学内容'
}];

const defaultProgressSorted = [{
  dataField: 'grade'
}];

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
  return '没有数据.'
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
      totalStudents: 0,
      progressModal: false,
      performanceModal: false,
      teachers: {},
      students: {},
      curTeacher: 1,
      curDate: getCommonDateFormat(new Date()),
      curSubject: '语文',
      curGrade: 1,
      curProgress: '',
      showDate: getCommonDateFormat(new Date()),
      mode: 'performance',
      performance: [],
      progress: [],
      schedules: []
    };

    this.progressToggle = this.progressToggle.bind(this);
    this.performanceToggle = this.performanceToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleScoreChange = this.handleScoreChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.saveProgress = this.saveProgress.bind(this);
    this.savePerformance = this.savePerformance.bind(this);
    this.changeMode = this.changeMode.bind(this);
  }

  progressToggle() {
    this.setState({
      progressModal: !this.state.progressModal
    });
  }

  performanceToggle() {
    this.setState({
      performanceModal: !this.state.performanceModal
    });
  }

  handleChange(event) {
    let state = {};
    switch(event.target.id) {
      case "hf-teacher":
        state = {curTeacher: event.target.value};
        break;
      case "hf-date":
        state = {curDate: event.target.value};
        break;
      case "hf-subject":
        state = {curSubject: event.target.value};
        break;
      case "hf-grade":
        state = {curGrade: event.target.value};
        break;
      case "hf-progress":
        state = {curProgress: event.target.value};
        break;
      case "hf-showdate":
        state = {showDate: event.target.value};
        break;
      default:
        break;
    }
    this.setState(state, () => this.loadData());
  }

  handleScoreChange(event) {
    let state = {students: this.state.students};
    state.students[Number(event.target.id.replace('hf-score-', ''))].score = event.target.value;
    this.setState(state);
  }

  handleCommentChange(event) {
    let state = {students: this.state.students};
    state.students[Number(event.target.id.replace('hf-comment-', ''))].comment = event.target.value;
    this.setState(state);
  }

  saveProgress() {
    let url = addProgress(this.state.curGrade, this.state.curSubject, this.state.teachers[this.state.curTeacher], new Date(this.state.curDate).getTime(), this.state.curProgress);
    fetch(url).then(r => {
      this.loadProgressData();
      this.progressToggle();
    })
  }

  savePerformance() {
    let asyncFetch = []
    Object.keys(this.state.students).filter(key => this.state.students[key].grade === Number(this.state.curGrade)).forEach(key => {
      let url = addPerformance(key, new Date(this.state.curDate).getTime(), this.state.teachers[this.state.curTeacher], this.state.students[key].score, this.state.students[key].comment);
      asyncFetch.push(fetch(url));
    });
    Promise.all(asyncFetch).then(() => {
      this.loadPerformanceData();
      this.performanceToggle();
    });
  }

  changeMode(mode) {
    this.setState({mode: mode});
  }

  loadData() {
    this.loadOverallData();
    
    this.loadScheduleData();

    this.loadTeachersAndStudents();

    this.loadProgressData();

    this.loadPerformanceData();
  }

  loadOverallData() {
    let url = getOverallCount();
    fetch(url).then(r => r.json()).then((res) => {
      this.setState({
        grades: res.grades,
        totalTeachers: res.teachers,
        activeTeachers: res.activeTeachers,
        voluteers: res.volunteers,
        totalStudents: res.students
      })
    });
  }

  loadScheduleData() {
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
        schedules: data
      })
    });
  }

  loadTeachersAndStudents() {
    let url = getAllTeachers();
    fetch(url).then(r => r.json()).then((res) => {
      let data = {};
      res.forEach(function(teacher) {
        if (teacher.active) {
          data[teacher.id] = teacher.name
        }
      });
      this.setState({
        teachers: data
      })
    });

    url = getAllStudents();
    fetch(url).then(r => r.json()).then((res) => {
      let data = {};
      res.forEach(function(student) {
        data[student.id] = {
          id: student.id,
          no: student.no,
          name: student.name,
          grade: Number(student.grade),
          score: 4,
          comment: ''
        }
      });
      this.setState({
        students: data
      })
    });
  }

  loadProgressData() {
    let url = getProgressByDate(new Date(getZeroClockWithCommonFormat(new Date(this.state.showDate))).getTime());
    fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.forEach(function(progress) {
        data.push({
          id: progress.id,
          grade: progress.grade,
          subject: progress.subject,
          teacher: progress.teacher,
          progress: progress.progress
        });
      });
      this.setState({
        progress: data
      })
    })
  }

  loadPerformanceData() {
    let url = getPerformanceByDate(new Date(getZeroClockWithCommonFormat(new Date(this.state.showDate))).getTime());
    fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.forEach(function(performance) {
        data.push({
          id: performance.id,
          grade: performance.grade,
          name: performance.student_name,
          teacher: performance.teacher,
          score: performance.score,
          comment: performance.comment
        });
      });
      this.setState({
        performance: data
      })
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
        <Row>
          <Col xs="12" sm="6" lg="3">
            <Widget02 header={this.state.grades.toString()} mainText="年级数" icon="fa fa-institution" color="primary" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget02 header={this.state.activeTeachers.toString() + ' / ' + this.state.totalTeachers.toString()} mainText="在校/所有 老师" icon="fa fa-graduation-cap" color="info" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget02 header={this.state.voluteers.toString()} mainText="志愿者" icon="fa fa-plane" color="warning" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget02 header={this.state.totalStudents.toString()} mainText="学生数" icon="fa fa-group" color="danger" variant="1" />
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
                    <Button color="success" onClick={this.performanceToggle}> 录入课堂表现 </Button> {' '}
                    <Button color="warning" onClick={this.progressToggle}> 录入教学内容 </Button>

                    <Modal isOpen={this.state.progressModal} toggle={this.progressToggle} className={this.props.className}>
                      <ModalHeader toggle={this.progressToggle}>录入今日教学情况</ModalHeader>
                      <ModalBody>
                        <FormGroup row>
                          <Label htmlFor="hf-teacher" sm={2}>老师</Label>
                          <Col sm={4}>
                            <Input type="select" id="hf-teacher" name="hf-teacher" value={this.state.curTeacher} onChange={this.handleChange}>
                              {
                                Object.keys(this.state.teachers).map( key => <option value={key} key={key}>{this.state.teachers[key]}</option>)
                              }
                            </Input>
                          </Col>

                          <Label htmlFor="hf-grade" sm={2}>年级</Label>
                          <Col sm={4}>
                            <Input type="select" id="hf-grade" name="hf-grade" value={this.state.curGrade} onChange={this.handleChange} >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                            </Input>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label htmlFor="hf-date" sm={2}>日期</Label>
                          <Col sm={10}>
                            <Input type="date" id="hf-date" name="hf-date" value={this.state.curDate} onChange={this.handleChange}/>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label htmlFor="hf-subject" sm={2}>学科</Label>
                          <Col sm={10}>
                            <Input type="select" id="hf-subject" name="hf-subject" value={this.state.curSubject} onChange={this.handleChange} >
                              <option value="语文">语文</option>
                              <option value="数学">数学</option>
                              <option value="英语">英语</option>
                            </Input>
                          </Col>
                        </FormGroup>

                        <FormGroup>
                          <Label htmlFor="hf-progress">教学内容</Label>
                          <Input type="textarea" rows="5" id="hf-progress" name="hf-progress" value={this.state.curProgress} onChange={this.handleChange} />
                        </FormGroup>

                      </ModalBody>
                      <ModalFooter>
                        <Button color='primary' onClick={this.saveProgress}>保存</Button>{' '}
                        <Button color='secondary' onClick={this.progressToggle}>返回</Button>
                      </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.performanceModal} toggle={this.performanceToggle} className={this.props.className}>
                      <ModalHeader toggle={this.performanceToggle}>录入今日课堂表现</ModalHeader>
                      <ModalBody>
                        <FormGroup row>
                          <Label htmlFor="hf-teacher" sm={2}>老师</Label>
                          <Col sm={4}>
                            <Input type="select" id="hf-teacher" name="hf-teacher" value={this.state.curTeacher} onChange={this.handleChange}>
                              {
                                Object.keys(this.state.teachers).map( key => <option value={key} key={key}>{this.state.teachers[key]}</option>)
                              }
                            </Input>
                          </Col>

                          <Label htmlFor="hf-grade" sm={2}>年级</Label>
                          <Col sm={4}>
                            <Input type="select" id="hf-grade" name="hf-grade" value={this.state.curGrade} onChange={this.handleChange} >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                            </Input>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label htmlFor="hf-date" sm={2}>日期</Label>
                          <Col sm={10}>
                            <Input type="date" id="hf-date" name="hf-date" value={this.state.curDate} onChange={this.handleChange}/>
                          </Col>
                        </FormGroup>

                        {
                          Object.keys(this.state.students).filter(key => this.state.students[key].grade === Number(this.state.curGrade)).map(key => 
                            <FormGroup key={key}>
                              <FormGroup row>
                                <Label htmlFor="hf-score" sm={3}>{this.state.students[key].name}</Label>
                                <Col sm={2}>
                                  <Input type="number" min="0" max="5" id={"hf-score-" + key} name="hf-score" value={this.state.students[key].score} onChange={this.handleScoreChange}/>
                                </Col>

                                <Label htmlFor="hf-comment" sm={2}>备注</Label>
                                <Col sm={5}>
                                  <Input type="text" id={"hf-comment-" + key} name="hf-comment" value={this.state.students[key].comment} onChange={this.handleCommentChange}/>
                                </Col>
                              </FormGroup>
                            </FormGroup>
                          )
                        }

                      </ModalBody>
                      <ModalFooter>
                        <Button color='primary' onClick={this.savePerformance}>保存</Button>{' '}
                        <Button color='secondary' onClick={this.performanceToggle}>返回</Button>
                      </ModalFooter>
                    </Modal>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <ButtonGroup className="mr-3" aria-label="First group">
                        <Button color="outline-secondary" onClick={() => this.changeMode("performance")} active={this.state.mode === "performance"}>课堂表现</Button>
                        <Button color="outline-secondary" onClick={() => this.changeMode("progress")} active={this.state.mode === "progress"}>教学进度</Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs="12" sm={{ size: 6, offset: 6 }} md={{ size: 3, offset: 9 }}>
                    <Input type="date" id="hf-showdate" name="hf-showdate" value={this.state.showDate} onChange={this.handleChange} />
                  </Col>
                </Row>
                {this.state.mode === "performance" ? 
                  <ToolkitProvider 
                    bootstrap4 
                    keyField='id' 
                    data={ this.state.performance } 
                    columns={ performanceColumns } 
                    defaultSorted={ defaultPerformanceSorted } 
                  >
                    {
                      props => (
                        <div>
                          <BootstrapTable 
                            { ...props.baseProps } 
                            headerClasses="bg-gray-200"
                            noDataIndication = { emptyIndication }
                            pagination={ paginationFactory() }
                            condensed
                            hover 
                          />
                        </div>
                      )
                    }
                  </ToolkitProvider> :
                  <ToolkitProvider 
                    bootstrap4 
                    keyField='id' 
                    data={ this.state.progress } 
                    columns={ progressColumns } 
                    defaultSorted={ defaultProgressSorted } 
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
                  </ToolkitProvider>}
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
