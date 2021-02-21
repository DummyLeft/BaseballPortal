import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';

import { getTeacherById, enableTeacher, disableTeacher, deleteTeacher } from '../../../utils/urlUtil';

class TeacherDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: 1,
			name: '',
      type: '志愿者',
      active: true
		};
    this.handleActive = this.handleActive.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
	}

  loadData() {
    let url = getTeacherById(this.props.match.params.id);
    fetch(url).then(r => r.json()).then((res) => {
      this.setState({
        id: res.id,
        name: res.name,
        type: res.type,
        active: res.active
      })
    });
  }

  handleActive() {
    let url = this.state.active ? disableTeacher(this.props.match.params.id) : enableTeacher(this.props.match.params.id);
    fetch(url).then(r => {
      this.loadData();
    })
  }

  handleDelete() {
    let url = deleteTeacher(this.props.match.params.id);
    fetch(url).then(r => {
      this.props.history.push('/manage/teacher');
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
            <i className="fa fa-sticky-note-o"></i> 教师详细信息
            <div className="card-header-actions">
              <Link to="/manage/teacher/" > 
              	<i className="fa fa-arrow-left float-right"></i>
            	</Link>
            </div>
          </CardHeader>
          <CardBody>
          	<dl className="row">
          		<dt className='col-sm-3 col-md-2 col-xl-2'>ID: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.id}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2'>名字: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.name}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2'>类型: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.type}</dd>
          		<dt className='col-sm-3 col-md-2 col-xl-2'>状态: </dt>
          		<dd className='col-sm-3 col-md-4 col-xl-4'>{this.state.active ? '正常': '暂离'}</dd>
          	</dl>
          	<hr />
            <Button color={this.state.active ? 'light' : 'success'} onClick={this.handleActive}>{this.state.active ? '暂离' : '激活'}</Button>{' '}
            <Button color='danger' className="float-right" onClick={this.handleDelete}>删除</Button>
          </CardBody>
				</Card>
			</div>
		);
	}
}

export default TeacherDetail;