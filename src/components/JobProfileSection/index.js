import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import JobCard from '../JobCard'
import JobsFilterGroup from '../JobsFilterGroup'
import './index.css'

const locationList = [
  {
    label: 'Hyderabad',
    id: 'Hyderabad',
  },
  {
    label: 'Bangalore',
    id: 'Bangalore',
  },
  {
    label: 'Chennai',
    id: 'Chennai',
  },
  {
    label: 'Delhi',
    id: 'Delhi',
  },
  {
    label: 'Mumbai',
    id: 'Mumbai',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobProfileSection extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    employmentType: [],
    locations: [],
    salaryRange: 0,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const {salaryRange, employmentType, searchInput} = this.state
    console.log(employmentType)
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterKey = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  changeSalaryRange = salary => {
    this.setState({salaryRange: salary}, this.getJobDetails)
  }

  changeLocation = id => {
    const {locations} = this.state
    let updatedList
    if (locations.includes(id)) {
      updatedList = locations.filter(each => each !== id)
    } else {
      updatedList = [...locations, id]
    }
    console.log(updatedList)
    this.setState({locations: updatedList})
  }

  changeEmploymentType = type => {
    const {employmentType} = this.state
    const isTypePresent = employmentType.filter(each => each === type)
    let updatedList
    if (isTypePresent.length === 1) {
      updatedList = employmentType.filter(each => each !== type)
    } else {
      updatedList = [...employmentType, type]
    }
    this.setState({employmentType: [...updatedList]}, this.getJobDetails)
  }

  renderJobDetails = () => {
    const {jobsList, searchInput, locations} = this.state
    let updatedJobList = jobsList
    if (locations.length > 0) {
      updatedJobList = jobsList.filter(each =>
        locations.includes(each.location),
      )
    }
    const jobsDisplay = updatedJobList.length > 0

    return jobsDisplay ? (
      <div className="details-container">
        <div className="search-input">
          <input
            type="search"
            className="search"
            placeholder="Search"
            value={searchInput}
            onChange={this.changeSearchInput}
            onKeyDown={this.onEnterKey}
          />
          <button
            type="button"
            data-testid="searchButton"
            className="search-button"
            onClick={this.getJobDetails}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <div className="job-details-item-container">
          {updatedJobList.map(eachData => (
            <JobCard key={eachData.id} jobDetails={eachData} />
          ))}
        </div>
      </div>
    ) : (
      <div className="no-jobs-container">
        <div className="search-input-content">
          <input
            type="search"
            className="search"
            placeholder="Search"
            value={searchInput}
            onChange={this.changeSearchInput}
            onKeyDown={this.onEnterKey}
          />
          <button
            type="button"
            data-testid="searchButton"
            className="search-button"
            onClick={this.getJobDetails}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-desc">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        we cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        data-testid="button"
        className="jobs-failure-button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobProfileDetailsList = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="job-details-container">
        <div className="render-group-items">
          <JobsFilterGroup
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            changeEmploymentType={this.changeEmploymentType}
            changeSalaryRange={this.changeSalaryRange}
            searchInput={searchInput}
            changeSearchInput={this.changeSearchInput}
            getJobDetails={this.getJobDetails}
            locationList={locationList}
            changeLocation={this.changeLocation}
          />
        </div>
        <div className="responsive-items">
          {this.renderJobProfileDetailsList()}
        </div>
      </div>
    )
  }
}

export default JobProfileSection
