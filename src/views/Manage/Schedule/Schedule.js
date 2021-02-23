import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { getAllGradeSchedules, addSchedule, getAllTeachers } from '../../../utils/urlUtil';

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

class Schedule extends Component {
	constructor(props) {
		super(props);
		this.state = {
      modal: false,
      teacher_id: 1,
      grade: 1,
      day_of_week: 1,
			data: [],
      teachers: {}
		};

    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveSchedule = this.saveSchedule.bind(this);
	}

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleChange(event) {
    let state = {};
    switch(event.target.id) {
      case "hf-teacher":
        state = {teacher_id: event.target.value};
        break;
      case "hf-grade":
        state = {grade: event.target.value};
        break;
      case "hf-day-of-week":
        state = {day_of_week: event.target.value};
        break;
      default:
        break;
    }
    this.setState(state);
  }

  saveSchedule() {
    let url = addSchedule(this.state.teacher_id, this.state.grade, this.state.day_of_week);
    fetch(url).then(r => {
      this.loadData();
      this.toggle();
    });
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

    this.loadTeachers();
	}

  loadTeachers() {
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
                        <Row>
                          <Col
                            xs={{ size: 4 }} 
                            md={{ size: 2 }} 
                          >
                            <Button color='primary' size='md' onClick={this.toggle}>修改课程安排</Button>
                            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                              <ModalHeader toggle={this.toggle}>修改课程安排</ModalHeader>
                              <ModalBody>
                                <FormGroup>
                                  <Label htmlFor="hf-teacher">老师</Label>
                                  <Input type="select" id="hf-teacher" name="hf-teacher" value={this.state.teacher_id} onChange={this.handleChange}>
                                    {
                                      Object.keys(this.state.teachers).map( key => <option value={key} key={key}>{this.state.teachers[key]}</option>)
                                    }
                                  </Input>
                                </FormGroup>

                                <FormGroup>
                                  <Label htmlFor="hf-grade">年级</Label>
                                  <Input type="select" id="hf-grade" name="hf-grade" value={this.state.grade} onChange={this.handleChange} >
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
                                </FormGroup>

                                <FormGroup>
                                  <Label htmlFor="hf-day-of-week">星期</Label>
                                  <Input type="select" id="hf-day-of-week" name="hf-day-of-week" value={this.state.day_of_week} onChange={this.handleChange} >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                  </Input>
                                </FormGroup>
                              </ModalBody>
                              <ModalFooter>
                                <Button color='primary' onClick={this.saveSchedule}>保存</Button>{' '}
                                <Button color='secondary' onClick={this.toggle}>返回</Button>
                              </ModalFooter>
                            </Modal>
                          </Col>
                        </Row>
                        <hr />
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