import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { getAllTeachers, addTeacher } from '../../../utils/urlUtil';

const { SearchBar } = Search;

const columns = [{
	dataField: 'id',
	text: 'ID',
	sort: true
}, {
	dataField: 'name',
	text: '名字',
	sort: true
}, {
	dataField: 'type',
	text: '类型',
  sort: true
}, {
	dataField: 'active',
	text: '状态',
	sort: true
}];

const defaultSorted = [{
	dataField: 'id'
}];

function emptyIndication() {
  return '没有数据.'
}

class Teacher extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
      name: '',
      type: '志愿者',
      modal: false
		};
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveTeacher = this.saveTeacher.bind(this);
    this.gotoDetailPage = this.gotoDetailPage.bind(this);
	}

	gotoDetailPage(id) {
		let detail_path = `/manage/teacher/detail/${id}`;
		this.props.history.push(detail_path);
	}

	loadData() {
		let url = getAllTeachers();
		fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.forEach(function(teacher) {
        data.push({
          id: teacher.id,
					name: teacher.name,
					type: teacher.type,
					active: teacher.active ? '正常' : '暂离'
        })
      });
      this.setState({
      	data: data
      })
    });

	}

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleChange(event) {
    let state = {};
    switch(event.target.id) {
      case "hf-name":
        state = {name: event.target.value};
        break;
      case "hf-type":
        state = {type: event.target.value};
        break;
      default:
        break;
    }
    this.setState(state);
  }

  saveTeacher() {
    let url = addTeacher(this.state.name, this.state.type);
    fetch(url).then(r => {
      this.loadData();
      this.toggle();
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
		            <i className="fa fa-align-justify"></i> 教师列表
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
                            <Button color='primary' size='md' onClick={this.toggle}>添加老师</Button>
                            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                              <ModalHeader toggle={this.toggle}>增加老师</ModalHeader>
                              <ModalBody>
                                <FormGroup row>
                                  <Col sm="3" md="2">
                                    <Label htmlFor="hf-name">名字</Label>
                                  </Col>
                                  <Col sm="3" md="4">
                                    <Input type="text" id="hf-name" name="hf-name" value={this.state.name} onChange={this.handleChange} />
                                  </Col>

                                  <Col sm="3" md="2">
                                    <Label htmlFor="hf-type">类型</Label>
                                  </Col>
                                  <Col sm="3" md="4">
                                    <Input type="select" id="hf-type" name="hf-type" value={this.state.type} onChange={this.handleChange} >
                                      <option value="志愿者">志愿者</option>
                                      <option value="基地员工">基地员工</option>
                                    </Input>
                                  </Col>

                                </FormGroup>
                              </ModalBody>
                              <ModalFooter>
                                <Button color='primary' onClick={this.saveTeacher}>保存</Button>{' '}
                                <Button color='secondary' onClick={this.toggle}>返回</Button>
                              </ModalFooter>
                            </Modal>
                          </Col>
              						<Col  
              							xs={{ size: 6, offset: 6 }} 
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
              						pagination={ paginationFactory({sizePerPageList: [{text: '10', value: 10}, {text: '25', value: 25}, {text: 'All', value: this.state.data.length}], sizePerPage: 25}) }
                          noDataIndication={ emptyIndication }
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

export default Teacher;