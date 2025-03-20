import ProfileDetails from '../ProfileDetails'
import './index.css'

const JobsFilterGroup = props => {
  const getEmploymentTypeList = () => {
    const {employmentTypesList} = props

    return employmentTypesList.map(employ => {
      const {changeEmploymentType} = props
      const onChangeEmployType = event => {
        changeEmploymentType(event.target.value)
      }
      return (
        <li
          className="checkbox-list-items"
          key={employ.employmentTypeId}
          onChange={onChangeEmployType}
        >
          <input
            type="checkbox"
            className="check-radio"
            id={employ.employmentTypeId}
            value={employ.employmentTypeId}
          />
          <label htmlFor={employ.employmentTypeId} className="check-label">
            {employ.label}
          </label>
        </li>
      )
    })
  }

  const renderEmploymentType = () => (
    <div className="salary-container">
      <h1 className="salary-heading">Type of Employment</h1>
      <ul className="salary-range-container">{getEmploymentTypeList()}</ul>
    </div>
  )

  const getSalaryRangeList = () => {
    const {salaryRangesList} = props

    return salaryRangesList.map(salary => {
      const {changeSalaryRange} = props
      const onChangeSalary = () => changeSalaryRange(salary.salaryRangeId)

      return (
        <li
          className="checkbox-list-items"
          key={salary.salaryRangeId}
          onChange={onChangeSalary}
        >
          <input
            type="radio"
            className="check-radio"
            id={salary.salaryRangeId}
            name="salary"
          />
          <label htmlFor={salary.salaryRangeId} className="check-label">
            {salary.label}
          </label>
        </li>
      )
    })
  }

  const renderSalaryRange = () => (
    <div className="salary-container">
      <h1 className="salary-heading">Salary Range</h1>
      <ul className="salary-range-container">{getSalaryRangeList()}</ul>
    </div>
  )

  const getLocationList = () => {
    const {locationList, changeLocation} = props

    return locationList.map(location => {
      const onChangeEmployType = () => {
        changeLocation(location.id)
      }

      return (
        <li
          className="checkbox-list-items"
          key={location.id}
          onChange={onChangeEmployType}
        >
          <input
            type="checkbox"
            className="check-radio"
            id={location.id}
            value={location.id}
          />
          <label htmlFor={location.id} className="check-label">
            {location.label}
          </label>
        </li>
      )
    })
  }

  const renderLocation = () => (
    <div className="salary-container">
      <h1 className="salary-heading">Location</h1>
      <ul className="salary-range-container">{getLocationList()}</ul>
    </div>
  )

  return (
    <div className="job-filter-group">
      <ProfileDetails />
      <hr className="horizontal-line" />
      {renderEmploymentType()}
      <hr className="horizontal-line" />
      {renderSalaryRange()}
      <hr className="horizontal-line" />
      {renderLocation()}
    </div>
  )
}

export default JobsFilterGroup
