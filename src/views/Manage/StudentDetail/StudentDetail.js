import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';

import { getCommonDateFormat } from '../../../utils/timeUtil';
import { getStudentById, deleteStudent, changeGrade } from '../../../utils/urlUtil';

class StudentDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: 1,
      no: '',
			name: '',
			birthdate: '',
      grade: 1
		};
    this.handleUpgrade = this.handleUpgrade.bind(this);
    this.handleDowngrade = this.handleDowngrade.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
	}

	loadData() {
		let url = getStudentById(this.props.match.params.id);
    fetch(url).then(r => r.json()).then((res) => {
      this.setState({
      	id: res.id,
        no: res.no,
        name: res.name,
        birthdate: getCommonDateFormat(new Date(res.birthdate)),
        grade: Number(res.grade)
      })
    });
	}

  handleUpgrade() {
    let url = changeGrade(this.props.match.params.id, this.state.grade + 1);
    fetch(url).then(r => {
      this.loadData();
    })
  }

  handleDowngrade() {
    let url = changeGrade(this.props.match.params.id, this.state.grade - 1);
    fetch(url).then(r => {
      this.loadData();
    })
  }

  handleDelete() {
    let url = deleteStudent(this.props.match.params.id);
    fetch(url).then(r => {
      this.props.history.push('/manage/student');
    })
  }


	componentDidMount() {
    this.loadData();
  }

	render() {
		return (
			<div className="animated fadeIn">
				<Card>
					<CardHeader>
            <i className="fa fa-sticky-note-o"></i> 学生个人信息
            <div className="card-header-actions">
              <Link to="/manage/student/" > 
              	<i className="fa fa-arrow-left float-right"></i>
            	</Link>
            </div>
          </CardHeader>
          <CardBody>
          	<dl className="row">
          		<dt className='col-sm-3 col-md-2 col-xl-2'>学号: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.no}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2'>名字: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.name}</dd>
              <dt className='col-sm-3 col-md-2 col-xl-2'>生日: </dt>
              <dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.birthdate}</dd>
              <dt className='col-sm-3 col-md-2 col-xl-2'>年级: </dt>
              <dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.grade}</dd>
          	</dl>
          	<hr />
          	<Button color='light' onClick={this.handleUpgrade}>升一级</Button>{' '}
            <Button color='dark' onClick={this.handleDowngrade}>降一级</Button>{' '}
            <Button color='danger' className="float-right" onClick={this.handleDelete}>删除</Button>
          </CardBody>
				</Card>
			</div>
		);
	}
}

export default StudentDetail;