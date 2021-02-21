import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination
} from '@coreui/react'

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

const Students = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/students?page=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  

  var studentsData = [
    {id: 0, name: 'John Doe', birthdate: '2018/01/01', grade: 'Guest', status: 'Pending'},
    {id: 1, name: 'Samppa Nori', birthdate: '2018/01/01', grade: 'Member', status: 'Active'},
    {id: 2, name: 'Estavan Lykos', birthdate: '2018/02/01', grade: 'Staff', status: 'Banned'},
    {id: 3, name: 'Chetan Mohamed', birthdate: '2018/02/01', grade: 'Admin', status: 'Inactive'},
    {id: 4, name: 'Derick Maximinus', birthdate: '2018/03/01', grade: 'Member', status: 'Pending'},
    {id: 5, name: 'Friderik Dávid', birthdate: '2018/01/21', grade: 'Staff', status: 'Active'}
  ]

  return (
    <CRow>
      <CCol xl={6}>
        <CCard>
          <CCardHeader>
            学生
            <small className="text-muted"> 列表</small>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={studentsData}
            fields={[
              { key: 'name', label: '名字', _classes: 'font-weight-bold' },
              { key: 'birthdate', label: '生日'} , 
              { key: 'grade', label: '年级'}, 
              { key: 'status', label: '状态'}
            ]}
            hover
            striped
            itemsPerPage={10}
            activePage={page}
            clickableRows
            onRowClick={(item) => history.push(`/students/${item.id}`)}
            scopedSlots = {{
              'status':
                (item)=>(
                  <td>
                    <CBadge color={getBadge(item.status)}>
                      {item.status}
                    </CBadge>
                  </td>
                )
            }}
          />
          <CPagination
            activePage={page}
            onActivePageChange={pageChange}
            pages={1}
            doubleArrows={false} 
            align="center"
          />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Students
