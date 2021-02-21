import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { getCommonDateFormat } from '../../../utils/timeUtil';
import { getAllStudents, addStudent } from '../../../utils/urlUtil';

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

class Student extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
      modal: false,
      no: '',
      name: '',
      birthdate: '',
      grade: 1
		};
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveStudent = this.saveStudent.bind(this);
    this.gotoDetailPage = this.gotoDetailPage.bind(this);
	}

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleChange(event) {
    let state = {};
    switch(event.target.id) {
      case "hf-no":
        state = {no: event.target.value};
        break;
      case "hf-name":
        state = {name: event.target.value};
        break;
      case "hf-birthdate":
        state = {birthdate: event.target.value};
        break;
      case "hf-grade":
        state = {grade: event.target.value};
        break;
      default:
        break;
    }
    this.setState(state);
  }

  saveStudent() {
    let url = addStudent(this.state.no, this.state.name, new Date(this.state.birthdate).getTime(), this.state.grade);
    fetch(url).then(r => {
      this.loadData();
      this.toggle();
    });
  }

	gotoDetailPage(id) {
		let detail_path = `/manage/student/detail/${id}`;
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
					birthdate: getCommonDateFormat(new Date(student.birthdate)),
					grade: Number(student.grade)
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
		            <i className="fa fa-align-justify"></i> 学生列表
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
                            xs={{ size: 4 }} 
                            md={{ size: 2 }} 
                          >
                            <Button color='primary' size='md' onClick={this.toggle}>添加学生</Button>
                            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                              <ModalHeader toggle={this.toggle}>增加学生</ModalHeader>
                              <ModalBody>
                                <FormGroup>
                                  <Label htmlFor="hf-no">学号</Label>
                                  <Input type="text" id="hf-no" name="hf-no" value={this.state.no} onChange={this.handleChange} />
                                </FormGroup>

                                <FormGroup>
                                  <Label htmlFor="hf-name">名字</Label>
                                  <Input type="text" id="hf-name" name="hf-name" value={this.state.name} onChange={this.handleChange} />
                                </FormGroup>

                                <FormGroup>
                                  <Label htmlFor="hf-birthdate">生日</Label>
                                  <Input type="date" id="hf-birthdate" name="hf-birthdate" value={this.state.birthdate} onChange={this.handleChange} />
                                </FormGroup>

                                <FormGroup>
                                  <Label htmlFor="hf-type">年级</Label>
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
                              </ModalBody>
                              <ModalFooter>
                                <Button color='primary' onClick={this.saveStudent}>保存</Button>{' '}
                                <Button color='secondary' onClick={this.toggle}>返回</Button>
                              </ModalFooter>
                            </Modal>
                          </Col>
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

export default Student;