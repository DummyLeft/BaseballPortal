import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { getCommonDateFormat } from '../../../utils/timeUtil';
import { getProgressByGradeAndSubject } from '../../../utils/urlUtil';

const columns = [{
	dataField: 'date',
	text: '日期',
	sort: true
}, {
	dataField: 'teacher',
	text: '老师'
}, {
	dataField: 'progress',
	text: '教学内容',
	sort: true
}];

const defaultSorted = [{
	dataField: 'date'
}];

function emptyIndication() {
  return '没有数据.'
}

class Progress extends Component {
	constructor(props) {
		super(props);
		this.state = {
      curGrade: 1,
      curSubject: '语文',
			data: []
		};
    this.handleChange = this.handleChange.bind(this);
	}

  handleChange(event) {
    let state = {};
    switch(event.target.id) {
      case "hf-subject":
        state = {curSubject: event.target.value};
        break;
      case "hf-grade":
        state = {curGrade: event.target.value};
        break;
      default:
        break;
    }
    this.setState(state, () => this.loadData());
  }

	loadData() {
		let url = getProgressByGradeAndSubject(this.state.curGrade, this.state.curSubject);
		fetch(url).then(r => r.json()).then((res) => {
      let data = [];
      res.forEach(function(p) {
        data.push({
          id: p.id,
					date: getCommonDateFormat(new Date(p.date)),
					teacher: p.teacher,
					progress: p.progress
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
		            <i className="fa fa-align-justify"></i> 教学进度
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
              							md={{ size: 8, offset: 4 }} 
                            lg={{ size: 6, offset: 6}}
            							>
                            <FormGroup row>
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

                              <Label htmlFor="hf-subject" sm={2}>学科</Label>
                              <Col sm={4}>
                                <Input type="select" id="hf-subject" name="hf-subject" value={this.state.curSubject} onChange={this.handleChange} >
                                  <option value="语文">语文</option>
                                  <option value="数学">数学</option>
                                  <option value="英语">英语</option>
                                </Input>
                              </Col>
                            </FormGroup>
              						</Col>
              				  </Row>
              					<hr />
              					<BootstrapTable 
              						{ ...props.baseProps } 
              						headerClasses="bg-info"
              						pagination={ paginationFactory() }
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

export default Progress;